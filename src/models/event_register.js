module.exports = function (sequelize, Sequelize) {
  const EventRegister = sequelize.define('event_register', {
    id: {
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    email: {
      type: Sequelize.STRING,
      notEmpty: true,
    },
    event_title: {
      type: Sequelize.STRING,
      notEmpty: true,
    },
    year: {
      type: Sequelize.STRING,
      notEmpty: true,
    },
  });

  return EventRegister;
};
