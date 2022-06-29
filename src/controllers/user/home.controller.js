const _ = require('lodash');
const {
  annualEventService,
  userService,
  googleService,
  happeningEventService,
  innService,
  postService,
} = require('../../service/index.service');

const { event_register } = require('../../models');

const homeController = module.exports;

homeController.homepage = async (req, res) => {
  try {
    const googleId = req.cookies['google_account_id'];
    const events = await annualEventService.findAll();
    const dataEvents = events.map(event => event.dataValues);

    let inns = (await innService.deletedFilter()).map(inn => inn.dataValues);
    inns = inns.slice(0, 10);
    const happeningEvent = await happeningEventService.findOne();
    const happeningEventData = _.get(happeningEvent, 'dataValues');

    const image_names = happeningEventData.image_name;

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

    res.render('user/home-page', { dataEvents, user, happeningEventData, inns, googleId, image_names });
  } catch (err) {
    console.log(err);
  }
};

homeController.registerEvent = async (req, res) => {
  try {
    const spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID;
    const happeningEvent = await happeningEventService.findOne();
    const happeningEventData = _.get(happeningEvent, 'dataValues');

    const value = [
      req.body.email,
      req.body.name,
      req.body.birthday,
      req.body.address,
      req.body.facebook,
      req.body.phoneNumber,
      req.body.zalo,
    ];

    await googleService.appendValueToSheet(spreadsheetId, happeningEventData.title, value);
  } catch (err) {
    console.error(err);
  }
  res.redirect('/');
};

homeController.slug = async (req, res) => {
  res.redirect('/');
};

homeController.happeningEvent = async (req, res) => {
  const googleId = req.cookies['google_account_id'];

  const events = await annualEventService.findAll();
  const dataEvents = events.map(event => event.dataValues);

  const happeningEvent = await happeningEventService.findOne();
  const happeningEventData = _.get(happeningEvent, 'dataValues');
  const image_names = happeningEventData.image_name;

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

  res.render('user/happening-event', { dataEvents, user, happeningEventData, googleId, image_names });
};

homeController.innDetail = async (req, res) => {
  const googleId = req.cookies['google_account_id'];
  const inn = _.get(await innService.findById(req.params.id), 'dataValues');
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

  res.render('user/inn-detail', { dataEvents, user, inn, googleId });
};

homeController.postDetail = async (req, res) => {
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

  res.render('user/post-detail', { dataEvents, user, post, googleId });
};

homeController.logout = async (req, res) => {
  res.clearCookie('google_account_id');
  res.redirect('/');
};

homeController.profile = async (req, res) => {
  try {
    const googleId = req.cookies['google_account_id'];
    const events = await annualEventService.findAll();
    const dataEvents = events.map(event => event.dataValues);

    const user = _.get(await userService.findByGoogleAccountId(req.cookies['google_account_id']), 'dataValues');

    const pattern = /http/g;
    if (!pattern.test(user.avatar_link)) {
      user.avatar_link = `/images/${user.avatar_link}`;
    }

    const joinEvents = (await event_register.findAll({ where: { email: user.email } })).map(event =>
      _.get(event, 'dataValues')
    );

    res.render('user/profile', { googleId, user, dataEvents, joinEvents });
  } catch (err) {
    console.log(err);
  }
};

homeController.editProfile = async (req, res) => {
  try {
    const profile = JSON.parse(JSON.stringify(req.body));

    console.log(req.body);

    if (req.file) {
      Object.assign(profile, { avatar_link: req.file.filename });
    }

    await userService.updateByGoogleAccountId(profile, req.cookies['google_account_id']);
  } catch (err) {
    console.error(err);
  }

  res.redirect('edit-profile');
};
