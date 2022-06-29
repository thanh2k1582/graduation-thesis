const { annual_event } = require('../models');

const annualEventService = module.exports

annualEventService.findByTitle = async(title) => annual_event.findOne({
    where: {
        title
    }
});

annualEventService.findAll = async() => annual_event.findAll();

annualEventService.updateById = async(event, id) => annual_event.update(event, {
    where: {
        id
    }
})

annualEventService.createOne = async(event) => annual_event.create(event);