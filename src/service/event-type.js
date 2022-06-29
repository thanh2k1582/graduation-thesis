const _ = require('lodash');

const { event_type } = require('../models');

const EventType = module.exports

EventType.findAll = async(req, res) => (await event_type.findAll()).map(type => _.get(type, 'dataValues'));