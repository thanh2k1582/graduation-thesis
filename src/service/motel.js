const _ = require('lodash');

const { motel } = require('../models');

const Motel = module.exports

Motel.getMotelsByUserId = async(user_id) => (await motel.findAll({where: { user_id }})).map(motel => _.get(motel, 'dataValues'));
