const _ = require('lodash');
const moment = require('moment');
const {
  annualEventService,
  happeningEventService,
  googleService,
  recentEventService,
  happenedEventService,
  userService,
} = require('../../service/index.service');
const mailHelper = require('../../helpers/mail');

const { admin, event_register } = require('../../models');

const adminController = module.exports;

adminController.adminPage = async (req, res) => {
  res.cookie('admin', 'admin');
  const admin = req.cookies.admin;

  res.redirect('/admin/chart');
};

adminController.annualEvents = async (req, res) => {
  const events = await annualEventService.findAll();
  const dataEvents = events.map(event => event.dataValues);
  const admin = req.cookies.admin;

  await dataEvents.map((event, index) => {
    Object.assign(event, { index: index + 1});
  })

  res.render('admin/annual-events', { admin, dataEvents });
};

adminController.updateAnnualEvent = async (req, res) => {
  const title = req.body.title;
  const description = req.body.description;
  let event = {
    title,
    description,
  };
  if (req.file) {
    Object.assign(event, { image_name: req.file.filename });
  }
  await annualEventService.updateById(event, req.query.id);
  res.redirect('/admin');
};

adminController.annualEventDetail = async (req, res) => {
  const event = await annualEventService.findByTitle(req.query.title);
  const data = event.dataValues;

  const admin = req.cookies.admin;
  res.render('admin/event-annual-detail', { admin, data });
};

adminController.addAnnualEventPage = async (req, res) => {
  const admin = req.cookies.admin;
  res.render('admin/add-annual-event', { admin });
};

adminController.addAnnualEvent = async (req, res) => {
  const event = {
    title: req.body.title,
    description: req.body.description,
    video_id: req.body.video_id,
  };

  await annualEventService.createOne(event);
  res.redirect('/admin/annual-events');
};

adminController.happeningEvent = async (req, res) => {
  const admin = req.cookies.admin;

  const happeningEvent = _.get(await happeningEventService.findOne(), 'dataValues');

  const image_names = happeningEvent.image_name;

  res.render('admin/happening-event', { admin, happeningEvent, image_names });
};

adminController.changeNewEvent = async (req, res) => {
  const admin = req.cookies.admin;
  const time = {
    date: moment().format('YYYY-MM-DD'),
  };

  const events = await annualEventService.findAll();
  const dataEvents = events.map(event => event.dataValues);

  res.render('admin/change-happening-event', { admin, time, dataEvents });
};

adminController.changeNewEventPost = async (req, res) => {
  try {
    const spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID;
    const happeningEvent = await happeningEventService.findOne();
    const happeningEventData = _.get(happeningEvent, 'dataValues');

    const registers = (await googleService.getDataSheet(spreadsheetId, happeningEventData.title)).data.values;
    await registers.map(register =>
      event_register.create({
        email: _.head(register),
        event_title: happeningEventData.title,
        year: happeningEventData.action_time,
      })
    );
    await googleService.addSheet(spreadsheetId, req.body.title);

    let files = [];
    await req.files.map(file => files.push(file.filename));
    const event = {
      title: req.body.title,
      description: req.body.description,
      image_name: files,
      action_time: req.body.action_time,
      place: req.body.place,
      event_type_id: req.body.event_type_id,
    };
    delete happeningEventData['id'];
    Object.assign(happeningEventData, { 
      year: _.head(happeningEventData.action_time.split('-')),
      total_register: registers.length
    });
    await recentEventService.createOne(happeningEventData);

    await happeningEventService.removeEvent();
    await happeningEventService.createOne(event);
  } catch (err) {
    console.log(err);
  }
  res.redirect('/admin/happening-event');
};

adminController.editHappeningEventPage = async (req, res) => {
  const admin = req.cookies.admin;
  const happeningEvent = await happeningEventService.findOne();
  const happeningEventData = _.get(happeningEvent, 'dataValues');

  const image_names = happeningEventData.image_name;

  res.render('admin/edit-happening-event', { admin, happeningEventData, image_names });
};

adminController.editHappeningEventPagePost = async (req, res) => {
  let files = [];
  await req.files.map(file => files.push(file.filename));

  const event = {
    title: req.body.title,
    description: req.body.description,
    image_name: files,
    action_time: req.body.action_time,
    place: req.body.place,
  };

  const id = req.query.id;

  await happeningEventService.updateEvent(event, id);

  res.redirect('/admin/happening-event');
};

adminController.setupMailEvent = async (req, res) => {
  const admin = req.cookies.admin;
  const happeningEvent = await happeningEventService.findOne();
  const happeningEventData = _.get(happeningEvent, 'dataValues');
  const statusMail = happeningEventData.status_mail;

  res.render('admin/setup-event-mail', { admin, statusMail, happeningEventData });
};

adminController.sendMailHappeningEvent = async (req, res) => {
  try {
    const mailSubject = req.body.subject;
    let mailContent = req.body.content;
    const happeningEvent = await happeningEventService.findOne();
    const happeningEventData = _.get(happeningEvent, 'dataValues');
    const titleSheet = happeningEventData.title;

    const registers = (await googleService.getDataSheet(process.env.GOOGLE_SPREADSHEET_ID, titleSheet)).data.values;

    registers.map(async register => {
      const user = await userService.findByEmail(_.head(register).trim());
      mailContent = `Thân gửi anh/chị ${user.name} <br> ${mailContent}`;

      await mailHelper.sendMail(_.head(register), mailContent, mailSubject);
    });
    await happeningEventService.updateStatusMail();
  } catch (err) {
    console.log(err);
  }
  res.redirect('/admin/happening-event');
};

adminController.recentEventPage = async (req, res) => {
  const events = await recentEventService.findAll();
  let image_names = [];
  let data = [];
  if (!_.isEmpty(events)) {
    const dataEvents = events.map(event => event.dataValues);
    data = _.head(dataEvents);
    image_names = data.image_name;
  }

  const admin = req.cookies.admin;

  res.render('admin/recent-events', { admin, data, image_names });
};

adminController.saveRecentEvent = async (req, res) => {
  let recentEvent = await recentEventService.findById(req.query.id);
  recentEvent = _.get(recentEvent, 'dataValues');
  if (req.file) {
    recentEvent.image_name = req.file.filename;
  }
  recentEvent.description = req.body.description;

  Object.assign(recentEvent, { year: _.head(_.split(recentEvent.action_time, '-')) });

  delete recentEvent['id'];

  await happenedEventService.createOne(recentEvent);
  await recentEventService.removeEventByTitle(recentEvent.title);

  res.redirect('/admin/recent-events');
};

adminController.chartEvent = async (req, res) => {
  const admin = req.cookies.admin;

  res.render('admin/chartEvent', { admin });
};

adminController.login = async (req, res) => {
  const login = { login: 'login' };

  res.render('admin/login', { login });
};

adminController.loginPost = async (req, res) => {
  res.clearCookie('google_account_id');

  const account = _.get(await admin.findOne({ account: req.body.account }), 'dataValues');

  if (account && account.password === req.body.password && req.body.password) {
    res.cookie('admin', 'account.account');
    res.redirect('/admin/chart');
    return true;
  }
};

adminController.logout = async (req, res) => {
  res.clearCookie('google_account_id');
  res.clearCookie('admin');

  res.redirect('/admin/login');
};

adminController.confirmRecentEvent = async (req, res) => {
  const recentEvent = _.get(await recentEventService.findById(req.query.id), 'dataValues');
  await recentEventService.removeEventById(req.query.id);
  
  delete recentEvent['id']

  await happenedEventService.createOne(recentEvent);

  res.redirect('/admin/recent-events');
}