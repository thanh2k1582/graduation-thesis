const _ = require('lodash');
const { innService, postService, annualEventService, userService } = require('../../service/index.service');
const { report } = require('../../models')

const InnController = module.exports;


const asyncForEach = async (array, callback) => {
  const tmpArray = [];

  for (let index = 0; index < array.length; index++) {
    tmpArray.push(callback(array[index], index));
  }

  return Promise.all(tmpArray);
};

InnController.managerMotel = async (req, res) => {
  const googleId = req.cookies['google_account_id'];
  const posts = (await postService.filterByCreatorId(req.params.googleId)).map(post => _.get(post, 'dataValues'));
  const events = await annualEventService.findAll();
  const dataEvents = events.map(event => event.dataValues);
  let user = {
    email: '',
  };

  if (req.cookies.google_account_id) {
    user = _.get(await userService.findByGoogleAccountId(req.cookies.google_account_id), 'dataValues');
  }

  const pattern = /http/g;
  if (!pattern.test(user.avatar_link)) {
    user.avatar_link = `/images/${user.avatar_link}`;
  }

  await posts.map(post => {
    Object.assign(post, { imageShow: _.head(post.image)});
    delete user['id']
    delete user['address']

    Object.assign(post, user)
  });

  res.render('user/motelManager', { posts, dataEvents, googleId, user });
};

InnController.pageCreateInn = async (req, res) => {
  const googleId = req.cookies['google_account_id'];
  const events = await annualEventService.findAll();
  const dataEvents = events.map(event => event.dataValues);
  let user = {
    email: '',
  };

  if (req.cookies.google_account_id) {
    user = _.get(await userService.findByGoogleAccountId(req.cookies.google_account_id), 'dataValues');
  }

  const pattern = /http/g;
  if (!pattern.test(user.avatar_link)) {
    user.avatar_link = `/images/${user.avatar_link}`;
  }
  res.render('user/create-inn-page', { googleId, dataEvents, user });
};

InnController.addNewInn = async (req, res) => {
  const post = JSON.parse(JSON.stringify(req.body));

  let files = [];
  await req.files.map(file => files.push(file.filename));
  Object.assign(post, {
    creator_id: req.cookies['google_account_id'],
    image: files,
  });

  await postService.creatorOne(post);
  res.redirect(`/manager/${req.cookies['google_account_id']}`);
};

InnController.deleteInnPost = async (req, res) => {
  const postId = req.query.id;
  await postService.deleteById(postId);

  res.redirect(`/manager/${req.cookies['google_account_id']}`);
};

InnController.detailPost = async (req, res) => {
  const googleId = req.cookies['google_account_id'];
  const post = _.get(await postService.findById(req.params.id), 'dataValues');
  const events = await annualEventService.findAll();
  const dataEvents = events.map(event => event.dataValues);
  let user = {
    email: '',
  };

  if (req.cookies.google_account_id) {
    user = _.get(await userService.findByGoogleAccountId(req.cookies.google_account_id), 'dataValues');
  }

  const pattern = /http/g;
  if (!pattern.test(user.avatar_link)) {
    user.avatar_link = `/images/${user.avatar_link}`;
  }

  res.render('user/post-detail', { post, googleId, dataEvents, user });
};

InnController.detailMotel = async (req, res) => {
  const googleId = req.cookies['google_account_id'];
  const post = _.get(await postService.findById(req.params.id), 'dataValues');
  const events = await annualEventService.findAll();
  const dataEvents = events.map(event => event.dataValues);
  let user = {
    email: '',
  };

  if (req.cookies.google_account_id) {
    user = _.get(await userService.findByGoogleAccountId(req.cookies.google_account_id), 'dataValues');
  }

  const pattern = /http/g;
  if (!pattern.test(user.avatar_link)) {
    user.avatar_link = `/images/${user.avatar_link}`;
  }
  const image = post.image

  let statusSuccess = undefined;
  if (post.status === 2) {
    statusSuccess = 'oke'
  }
  let statusFailed = undefined;
  if (post.status === 3) {
    statusFailed = {}
    Object.assign(statusFailed, { reason: post.reason})
  }
  let statusWaiting = undefined;
  if (post.status === 1) {
    statusWaiting = {};
  }

  let statusDrop = undefined;
  if (post.status === 4) {
    const reports = (await report.findAll({ where: { type_post: 'motel', post_id: req.params.id } })).map( report => _.get(report, 'dataValues'));
    statusDrop = []
    reports.map(report => statusDrop.push(report))
  }

  res.render('user/detailMotel', { post, googleId, dataEvents, user, image, statusSuccess, statusFailed, statusWaiting , statusDrop});
};

InnController.editDetailPost = async (req, res) => {
  const googleId = req.cookies['google_account_id'];
  const post = _.get(await postService.findById(req.params.id), 'dataValues');
  const events = await annualEventService.findAll();
  const dataEvents = events.map(event => event.dataValues);
  let user = {
    email: '',
  };

  if (req.cookies.google_account_id) {
    user = _.get(await userService.findByGoogleAccountId(req.cookies.google_account_id), 'dataValues');
  }

  const pattern = /http/g;
  if (!pattern.test(user.avatar_link)) {
    user.avatar_link = `/images/${user.avatar_link}`;
  }

  let statusSuccess = undefined;
  if (post.status === 2) {
    statusSuccess = 'oke'
  }
  let statusFailed = undefined;
  if (post.status === 3) {
    statusFailed = {}
    Object.assign(statusFailed, { reason: post.reason})
  }
  let statusWaiting = undefined;
  if (post.status === 1) {
    statusWaiting = {};
  }

  let statusDrop = undefined;
  if (post.status === 4) {
    const reports = (await report.findAll({ where: { type_post: 'motel', post_id: req.params.id } })).map( report => _.get(report, 'dataValues'));
    statusDrop = []
    reports.map(report => statusDrop.push(report))
  }

  const images = post.image

  res.render('user/post-edit', { post, googleId, dataEvents, user, images, statusSuccess, statusFailed, statusWaiting, statusDrop });
};

InnController.postEdit = async (req, res) => {
  const post = JSON.parse(JSON.stringify(req.body));
  Object.assign(post, {
    creator_id: req.cookies['google_account_id'],
  });

  if (!_.isEmpty(req.files)) {
    let files = [];
    await req.files.map(file => files.push(file.filename));

    Object.assign(post, {
      creator_id: req.cookies['google_account_id'],
      image: files,
    });
  }

  await postService.updateById(post, req.query.id);

  res.redirect(`/manager/${req.cookies['google_account_id']}`);
};

InnController.DaNangInns = async (req, res) => {
  const googleId = req.cookies['google_account_id'];
  const inns = (await innService.findAll()).map(post => _.get(post, 'dataValues'));
  const events = await annualEventService.findAll();
  const dataEvents = events.map(event => event.dataValues);
  let user = {
    email: '',
  };

  if (req.cookies.google_account_id) {
    user = _.get(await userService.findByGoogleAccountId(req.cookies.google_account_id), 'dataValues');
  }

  const pattern = /http/g;
  if (!pattern.test(user.avatar_link)) {
    user.avatar_link = `/images/${user.avatar_link}`;
  }

  res.render('user/DaNangInns', { inns, googleId, dataEvents, user });
};

InnController.BinhSonInns = async (req, res) => {
  const googleId = req.cookies['google_account_id'];
  const inns = (await postService.findAll()).map(post => _.get(post, 'dataValues'));
  const events = await annualEventService.findAll();
  const dataEvents = events.map(event => event.dataValues);
  let user = {
    email: '',
  };

  if (req.cookies.google_account_id) {
    user = _.get(await userService.findByGoogleAccountId(req.cookies.google_account_id), 'dataValues');
  }

  const pattern = /http/g;
  if (!pattern.test(user.avatar_link)) {
    user.avatar_link = `/images/${user.avatar_link}`;
  }

  res.render('user/BinhSonInns', { inns, googleId, dataEvents, user });
};

InnController.allInns = async (req, res) => {
  const googleId = req.cookies['google_account_id'];
  const events = await annualEventService.findAll();
  const dataEvents = events.map(event => event.dataValues);
// 
let inns = (await innService.deletedFilter()).map(inn => inn.dataValues);
let motels = (await postService.filterConfirm({ status: 2})).map(inn => inn.dataValues);

await asyncForEach(motels, async(post) => {
  const user = _.get(await userService.findByGoogleAccountId(post.creator_id), 'dataValues');
  delete user['id']
  const pattern = /http/g;
  if (!pattern.test(user.avatar_link)) {
    user.avatar_link = `/images/${user.avatar_link}`;
  }
  Object.assign(post, { imageShow: _.head(post.image)})
  Object.assign(post, user);
});

  inns.sort((a, b) => b.createdAt - a.createdAt);
  let sortedActivities = inns.concat(motels);
  let end = sortedActivities[sortedActivities.length - 1];
  console.log(end);

  sortedActivities.unshift(end);

  let length = null;

  const pageNum = {
    pre: parseInt(req.query.page) - 1,
    next: parseInt(req.query.page) + 1,
    next2: parseInt(req.query.page) + 2,
    now: req.query.page,
  };

  if (req.query.page) {
    sortedActivities = sortedActivities.slice((parseInt(req.query.page) - 1) * 10 + 1, parseInt(req.query.page) * 10 - 1);
    if (parseInt(req.query.page) > 1) {
      length = ['value'];
    }
  } else {
    sortedActivities = sortedActivities.slice(0, 9);
  }

  let user = {
    email: '',
  };

  if (req.cookies.google_account_id) {
    user = _.get(await userService.findByGoogleAccountId(req.cookies.google_account_id), 'dataValues');
  }

  const pattern = /http/g;
  if (!pattern.test(user.avatar_link)) {
    user.avatar_link = `/images/${user.avatar_link}`;
  }

  res.render('user/allInns', { sortedActivities, googleId, dataEvents, user, length, pageNum });
};

InnController.postDetail= async (req, res) => {
  const post = _.get(await postService.findById(req.query.id), 'dataValues');
  const googleId = req.cookies['google_account_id'];
  const events = await annualEventService.findAll();
  const dataEvents = events.map(event => event.dataValues);

  const user2 = _.get(await userService.findByGoogleAccountId(post.creator_id), 'dataValues');
  const image = post.image;

  const user = _.get(await userService.findByGoogleAccountId(googleId), 'dataValues');
  const pattern = /http/g;
  if (!pattern.test(user.avatar_link)) {
    user.avatar_link = `/images/${user.avatar_link}`;
  }

  res.render('user/postDetail', {post, image, googleId, dataEvents, user2, user });
}

InnController.postReport = async (req, res) => {
  if (req.query.type === 'motel') {
    await postService.updateById({ reason: '1'}, req.query.id);
  } else {
    await innService.updateById({ reason: '1'}, req.query.id);
  }

  await report.create({content: req.body.content, google_id_reporter: req.query.google_id, post_id: req.query.id, type_post : req.query.type});
  
  res.redirect('/all-inns');
}

InnController.allInnsSearch = async (req, res) => {
  let inns = (await innService.deletedFilter()).map(inn => inn.dataValues);
  let motels = (await postService.filterConfirm({ status: 2})).map(inn => inn.dataValues);

  await asyncForEach(motels, async(post) => {
    const user = _.get(await userService.findByGoogleAccountId(post.creator_id), 'dataValues');
    delete user['id']
    const pattern = /http/g;
    if (!pattern.test(user.avatar_link)) {
      user.avatar_link = `/images/${user.avatar_link}`;
    }
    Object.assign(post, { imageShow: _.head(post.image)})
    Object.assign(post, user);
  });

  inns = inns.concat(motels);
  let posts = []
  await asyncForEach(inns, async(inn) => {
    if (inn.title.match(req.body.payload)) {
      posts.push(inn)
    }
  })
  posts = posts.sort((a, b) => b.createdAt - a.createdAt);

  res.json(posts);
}
