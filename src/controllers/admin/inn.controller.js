const fs = require('fs');
const moment = require('moment');
const cheerio = require('cheerio');
const request = require('request-promise');
const _ = require('lodash');
const {} = require('../../service/index.service');

const { innService, postService, userService } = require('../../service/index.service');
const { report } = require('../../models');

const InnController = module.exports;

const asyncForEach = async (array, callback) => {
  const tmpArray = [];

  for (let index = 0; index < array.length; index++) {
    tmpArray.push(callback(array[index], index));
  }

  return Promise.all(tmpArray);
};

const getPost = async ($, el) => {
  const post = {
    title: $(el).find('.post-title a').text(),
    price: $(el).find('.post-price').text(),
    acreage: $(el).find('.post-acreage').text(),
    address: $(el).find('.post-location a').text(),
    summary: $(el).find('.post-summary').text(),
    image: $(el).find('.clearfix img').attr('data-src'),
    author_avatar: $(el).find('.post-author img').attr('src'),
    author_name: $(el).find('.author-name').text(),
    url_detail_page: $(el).find('.post-title a').attr('href'),
  };

  return post;
};

InnController.getInn = async (req, res) => {
  try {
    res.cookie('admin', 'admin');
    const admin = req.cookies.admin;

    let url = { url: 'https://phongtro123.com/tinh-thanh/da-nang?page=1' };
    res.cookie('url_fetch', `${url.url}`);

    // craw data from a website
    let posts = [];
    const fetch = await request(url.url);
    let listPosted = await innService.findAll();
    let postedTitles;
    if (listPosted) {
      postedTitles = await listPosted.map(posted => posted.dataValues.title);
    }

    const $ = cheerio.load(fetch);
    const pattern = /\w+-\w+\/da-nang/g;
    await asyncForEach($('.post-item'), async el => {
      const post = await getPost($, el);
      if (post.url_detail_page) {
        if (!post.url_detail_page.match(pattern)) {
          posts.push(post);
        }
      }
    });
    await posts.forEach((post, index) => {
      postedTitles.forEach(postedTitle => {
        if (_.trim(post.title) === postedTitle) {
          posts[index] = null;
        }
      });
    });

    posts = posts.filter(el => el != null);
    const page_fetch = { index: 2 };
    res.render('admin/inn-page', { admin, posts, page_fetch });
  } catch (err) {
    console.log(err);
    res.redirect('/admin');
  }
};

InnController.pageFetch = async (req, res) => {
  const admin = req.cookies.admin;

  let url = { url: req.cookies.url_fetch };
  let url_fetch_split = _.split(req.cookies.url_fetch, '');

  let page = req.params.page;
  page = { index: _.toNumber(page) + 1 };

  url_fetch_split.pop();
  url_fetch_split.push(page.index);

  _.set(url, 'url', url_fetch_split.join(''));
  res.cookie('url_fetch', `${url.url}`);

  // craw data from a website
  let posts = [];
  const fetch = await request(url.url);
  let listPosted = await innService.findAll();
  let postedTitles;
  if (listPosted) {
    postedTitles = await listPosted.map(posted => posted.dataValues.title);
  }

  const $ = cheerio.load(fetch);
  const pattern = /\w+-\w+\/da-nang/g;
  await asyncForEach($('.post-item'), async el => {
    const post = await getPost($, el);
    if (post.url_detail_page) {
      if (!post.url_detail_page.match(pattern)) {
        posts.push(post);
      }
    }
  });
  await posts.forEach((post, index) => {
    postedTitles.forEach(postedTitle => {
      if (_.trim(post.title) === postedTitle) {
        posts[index] = null;
      }
    });
  });

  posts = posts.filter(el => el != null);
  posts.map(el => Object.assign(el, { index: page.index }));

  const page_fetch = { index: page.index };

  res.render('admin/inn-page', { admin, posts, page_fetch });
};

InnController.innDetail = async (req, res) => {
  const admin = req.cookies.admin;

  const fetch_detail_url = `https://phongtro123.com/${req.params.url}`;
  const fetch = await request(fetch_detail_url);

  const $ = cheerio.load(fetch);
  let post = [];
  let title, price, acreage, address, description, postPlace, contact;
  $('.the-post').each((index, el) => {
    title = $(el).find('.page-h1 a').text();
    price = $(el).find('.price span').text();
    acreage = $(el).find('.acreage span').text();
    address = $(el).find('.post-address').text();
    image_slide = $(el).find('.swiper-slide img').attr('src');

    const desContainer = $('.post-main-content .section-content');
    description = desContainer.children('p');

    const postAddress = $('.post-overview .section-content');
    postPlace = postAddress.children('table');

    const contactPoster = $('.post-contact .section-content');
    contact = contactPoster.children('table');

    post.push({
      title,
      price,
      acreage,
      address,
      image_slide,
      description,
      postPlace,
      contact,
    });
  });

  post = _.head(post);

  res.render('admin/inn-detail', { admin, post });
};

InnController.newInn = async (req, res) => {
  try {
    const fetch_detail_url = `https://phongtro123.com/${req.params.url}`;
    const fetch = await request(fetch_detail_url);

    const $ = cheerio.load(fetch);
    let title, price, acreage, address, description, postPlace, contact;
    let post;
    $('.the-post').each((index, el) => {
      title = $(el).find('.page-h1 a').text();
      price = $(el).find('.price span').text();
      acreage = $(el).find('.acreage span').text();
      address = $(el).find('.post-address').text();
      image_slide = $(el).find('.swiper-slide img').attr('src');

      const desContainer = $('.post-main-content .section-content');
      description = desContainer.children('p').toString();

      const postAddress = $('.post-overview .section-content');
      postPlace = postAddress.children('table').toString();

      const contactPoster = $('.post-contact .section-content');
      contact = contactPoster.children('table').toString();

      price = price.replace('triệu/tháng', '');
      address = address.replace('Địa chỉ: ', '');
      acreage = acreage.replace('m2', '');

      post = {
        title,
        price,
        acreage,
        address,
        image_slide,
        description,
        postPlace,
        contact,
      };
    });
    Object.assign(post, req.query);
    await innService.createOne(post);

    if (req.query.page.length !== 0) {
      res.redirect(`/admin/inn/page/${_.toNumber(req.query.page) - 1}`);
      return;
    }
    res.redirect('/admin/inn');
  } catch (err) {
    console.error(err);
    res.redirect('/admin/inn');
  }
};

InnController.confirmedInns = async (req, res) => {
  const admin = req.cookies.admin;
  const inns = (await innService.deletedFilter()).map(inn => inn.dataValues);
  const motels = (await postService.filterConfirm({ status: 2})).map(inn => inn.dataValues);

  await asyncForEach(motels, async(post) => {
    const user = _.get(await userService.findByGoogleAccountId(post.creator_id), 'dataValues');

    const pattern = /http/g;
    if (!pattern.test(user.avatar_link)) {
      user.avatar_link = `/images/${user.avatar_link}`;
    }
    Object.assign(post, { imageShow: _.head(post.image)})
    Object.assign(post, user);
  });

  const posts = inns.concat(motels);
  const sortedActivities = posts.sort((a, b) => b.createdAt - a.createdAt);

  res.render('admin/confirmed-inns', { admin, inns, sortedActivities });
};

InnController.confirmedInnDetail = async (req, res) => {
  res.cookie('admin', 'admin');
  const admin = req.cookies.admin;
  const post = _.get(await innService.findById(req.query.id), 'dataValues');

  res.render('admin/inn-detail', { admin, post });
};

InnController.deleteConfirmInn = async (req, res) => {
  await innService.updateById({ deletedAt: true }, req.query.id);

  res.redirect('/admin/confirmed-inns');
};

InnController.reportInn = async (req, res) => {
  res.cookie('admin', 'admin');
  const admin = req.cookies.admin;

  const reports = (await report.findAll()).map(report => _.get(report, 'dataValues'));

  let posts = [];

  await asyncForEach(reports, async(report) => {
    if (report.type_post === 'motel') {
      const inn = _.get(await postService.findById(report.post_id), 'dataValues');
      const user = _.get(await userService.findByGoogleAccountId(inn.creator_id), 'dataValues');
      delete user['id']
      const pattern = /http/g;
      if (!pattern.test(user.avatar_link)) {
        user.avatar_link = `/images/${user.avatar_link}`;
      }
      Object.assign(user, { imageShow: _.head(inn.image)})

      Object.assign(inn, user);
      posts.push(inn);
    } else {
      const inn = _.get(await innService.findById(report.post_id), 'dataValues');
      posts.push(inn);
    }
  })

  const sortedActivities = posts.sort((a, b) => b.createdAt - a.createdAt);

  res.render('admin/report-inns', { admin, sortedActivities });
};

InnController.deletePost = async (req, res) => {
  await postService.updateById({ reason: req.body.reason, status: 0 }, req.query.id);

  res.redirect('/admin/confirm-inns');
};

InnController.postDetail = async (req, res) => {
  res.cookie('admin', 'admin');
  const admin = req.cookies.admin;
  const post = _.get(await postService.findById(req.query.id), 'dataValues');

  const user = _.get(await userService.findByGoogleAccountId(post.creator_id), 'dataValues');
  delete user['id']

  const image = post.image
  Object.assign(post, user)

  res.render('admin/post-detail', { admin, post, image });
};

InnController.confirmedInnsUser = async (req, res) => {
  res.cookie('admin', 'admin');
  const admin = req.cookies.admin;

  const posts = (await postService.findByStatus(1)).map(post => _.get(post, 'dataValues'));

  await asyncForEach(posts, async(post) => {
    const user = _.get(await userService.findByGoogleAccountId(post.creator_id), 'dataValues');

    delete user['id']

    const pattern = /http/g;
    if (!pattern.test(user.avatar_link)) {
      user.avatar_link = `/images/${user.avatar_link}`;
    }
    
    Object.assign(post, { imageShow: _.head(post.image)})
    Object.assign(post, user);
  });

  res.render('admin/confirmPostUser', {admin, posts});
};

InnController.postDetailConfirm = async (req, res) => {
  await postService.updateById({ status: 2}, req.query.id);

  res.redirect('/admin/confirm/inns');
}

InnController.postDetailRefuse = async (req, res) => {
  await postService.updateById({ status: 3, reason: req.body.reason }, req.query.id);

  res.redirect('/admin/confirm/inns');
}

InnController.reportDetailInn = async (req, res) => {
  res.cookie('admin', 'admin');
  const admin = req.cookies.admin;
  const post = _.get(await innService.findById(req.query.id), 'dataValues');

  const reports = (await report.findAll({ where: {
    post_id: post.id,
    type_post: 'inn'
  }})).map(report => _.get(report, 'dataValues'));

  await asyncForEach(reports, async(report) => {
    const user = _.get(await userService.findByGoogleAccountId(report.google_id_reporter), 'dataValues');
    delete user['id']
    Object.assign(report, user);
  })

  res.render('admin/reportInnDetail', { admin, post, reports });
}

InnController.reportDetailPost = async (req, res) => {
  res.cookie('admin', 'admin');
  const admin = req.cookies.admin;
  
  const post = _.get(await postService.findById(req.query.id), 'dataValues');
  const image = post.image;

  const reports = (await report.findAll({ where: {
    post_id: post.id,
    type_post: 'motel'
  }})).map(report => _.get(report, 'dataValues'));


  await asyncForEach(reports, async(report) => {
    const user = _.get(await userService.findByGoogleAccountId(report.google_id_reporter), 'dataValues');
    delete user['id']
    Object.assign(report, user, reports);
  })
  res.render('admin/reportMotelDetail', { post, image, admin, reports });
}

InnController.reportRefuse = async (req, res) => {
  if ( req.query.type === "inn") {
    await innService.updateById({ deletedAt: 1}, req.query.id);

    const reports = (await report.findAll({ where: { type_post: 'inn', post_id: req.query.id }})).map(report => _.get(report, 'dataValues'));

    await asyncForEach(reports, async(item) => {
      await report.destroy({ where: { id: item.id }});
    })
  } else {
    await postService.updateById({ status: 4}, req.query.id);
  }
  res.redirect('/admin/report-inns');
}