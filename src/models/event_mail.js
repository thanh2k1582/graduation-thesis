module.exports = function(sequelize, Sequelize) {
 
    const EventMail = sequelize.define('event_mail', {
        id: {
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        title: {
            type: Sequelize.STRING,
            notEmpty: true
        },
        content: {
            type: Sequelize.TEXT('long'),
            notEmpty: true
        },
    });
 
    return EventMail;
 
}