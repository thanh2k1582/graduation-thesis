const { happening_event } = require('../models');

const happeningEventService = module.exports;

happeningEventService.findOne = async () => happening_event.findOne();

happeningEventService.updateSheetEvent = async () =>
  happening_event.update(
    {
      sheet_of_event: 1,
    },
    {
      where: {
        id: 1,
      },
    }
  );

happeningEventService.updateStatusMail = async () =>
  happening_event.update(
    {
      status_mail: 1,
    },
    {
      where: {
        id: 1,
      },
    }
  );

happeningEventService.createOne = async (event) =>
  happening_event.create(event);

happeningEventService.removeEvent = async (event) =>
  happening_event.destroy({
    where: {},
    truncate: true,
  });

happeningEventService.updateEvent = async (event, id) =>
  happening_event.update(event, {
    where: {
      id
    },
  });
