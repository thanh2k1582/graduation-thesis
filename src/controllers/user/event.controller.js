const _ = require('lodash');
const vn = require('sub-vn');
const moment = require('moment');
const { annualEventService, happenedEventService, userService } = require('../../service/index.service');

const { happened_event } = require('../../models');

const eventController = module.exports;

const asyncForEach = async (array, callback) => {
  const tmpArray = [];

  for (let index = 0; index < array.length; index++) {
    tmpArray.push(callback(array[index], index));
  }

  return Promise.all(tmpArray);
};

eventController.detailEvent = async (req, res) => {
  const googleId = req.cookies['google_account_id'];

  const event = await annualEventService.findByTitle(req.params.slug);
  const data = event.dataValues;

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

  res.render('user/event-detail', { data, dataEvents, googleId, user });
};

eventController.eventPage = async (req, res) => {
  const googleId = req.cookies['google_account_id'];

  const events = await annualEventService.findAll();
  const dataEvents = events.map(event => event.dataValues);
  const happenedEvents = await happened_event.findAll();

  const dataHappenEvents = happenedEvents.map(event => {
    event.dataValues.action_time = _.head(event.dataValues.action_time.split(':'));
    return event.dataValues;
  });

  await dataHappenEvents.map(event => {
    const getEvent = dataEvents.map(typeEvent => {
      if (event.event_type_id === typeEvent.id) {
        event.typeEvent = typeEvent.title
      }
    });
  });


  const years = [];
  for (i = 2010; i <= moment().year(); i++) {
    years.push({ year: i });
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

  await asyncForEach(dataHappenEvents, async(event) => {
    await dataEvents.map(item => {
      if (item.id === event.event_type_id) {
        Object.assign(event, { title_type: item.title});
      }
    })
  })

  res.render('user/event-page', { dataEvents, dataHappenEvents, years, googleId, user });
};

eventController.happenedEventDetail = async (req, res) => {
  const googleId = req.cookies['google_account_id'];
  const happenedEvent = await happenedEventService.findEventByTimeAndTitle(req.query.year, req.query.event_name);
  const happenedEventDetail = happenedEvent.dataValues;
  const events = await annualEventService.findAll();

  const dataEvents = events.map(event => event.dataValues);

  const image_names = happenedEventDetail.image_name;
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
  res.render('user/happened-event-detail', { happenedEventDetail, dataEvents, googleId, image_names, user });
};

eventController.homepage = async (req, res) => {
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

  res.render('user/home-page', { dataEvents, googleId, user });
};

eventController.filterEvent = async (req, res) => {
  try {
    const year = req.body.year;

    const events = await annualEventService.findAll();
    const dataEvents = events.map(event => event.dataValues);

    const happened_events = await happenedEventService.filter({ year });
    const filtered_events = happened_events.map(event => _.get(event, 'dataValues'));

    if (req.body.type === 'Loại sự kiện') {
      await filtered_events.map(event => {
        const getEvent = dataEvents.find(typeEvent => (event.event_type_id = typeEvent.id));

        Object.assign(event, { type: getEvent.title });
      });
      res.json(filtered_events);
      return true;
    }

    const eventss = [];

    const getEvent = dataEvents.find(typeEvent => (typeEvent.title = req.body.type));

    await filtered_events.map(event => {
      if (event.event_type_id === getEvent.id) {
        Object.assign(event, { type: getEvent.title });

        eventss.push(event);
      }
    });

    res.json(eventss);
  } catch (err) {
    console.log(err);
  }
};

eventController.filterEventByType = async (req, res) => {
  try {
    const year = req.body.year;

    const eventType = await annualEventService.findByTitle(req.body.type.trim());
    const dataEvent = _.get(eventType, 'dataValues');

    const happened_events = await happenedEventService.filter({ event_type_id: dataEvent.id });
    const filtered_events = happened_events.map(event => _.get(event, 'dataValues'));

    if (req.body.year === 'Năm tổ chức') {
      await filtered_events.map(event => Object.assign(event, { type: req.body.type }));
      res.json(filtered_events);
      return true;
    }

    const eventss = [];

    await filtered_events.map(event => {
      if (event.year === req.body.year) {
        Object.assign(event, { type: req.body.type });
        eventss.push(event);
      }
    });

    console.log(eventss);

    res.json(eventss);
  } catch (err) {
    console.log(err);
  }
};
