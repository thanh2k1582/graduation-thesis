const { user } = require('../models');

const userService = module.exports;

userService.createOne = async profile => user.create(profile);

userService.updateByGoogleAccountId = async (profile, google_account_id) =>
  user.update(profile, { where: { google_account_id } });

userService.findByGoogleAccountId = async google_account_id =>
  user.findOne({
    where: {
      google_account_id,
    },
  });

userService.findByEmail = async email =>
  user.findOne({
    where: {
      email,
    },
  });
