const { inn } = require('../models');

const InnService = module.exports;

InnService.createOne = async one => await inn.create(one);

InnService.findAll = () => inn.findAll();

InnService.deletedFilter = () =>
  inn.findAll({
    where: {
      deletedAt: 0,
    },
  });

InnService.findById = async id => await inn.findOne({ where: { id } });

InnService.updateById = async (options, id) => await inn.update(options, { where: { id } });
