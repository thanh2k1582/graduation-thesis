module.exports = function(sequelize, Sequelize) {
 
    const EventType = sequelize.define('event_type', {
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
        youtube: {
            type: Sequelize.STRING,
            notEmpty: true
        },
        event_type_mail_id: {
            type: Sequelize.INTEGER,
            notEmpty: true
        },
    });
 
    return EventType;
 
}