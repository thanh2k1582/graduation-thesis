module.exports = function(sequelize, Sequelize) {
 
    const EventAnnual = sequelize.define('happened_event', {
 
        id: {
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
 
        title: {
            type: Sequelize.STRING,
            notEmpty: true
        },
 
        description: {
            type: Sequelize.TEXT('long'),
            notEmpty: true
        },
        image_name: {
            type: Sequelize.JSON,
            notEmpty: true
        },

        action_time: {
            type: Sequelize.STRING,
            notEmpty: true
        },
        place: {
            type: Sequelize.STRING,
            notEmpty: true
        },
        event_type_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        year: {
            type: Sequelize.STRING,
            notEmpty: true
        },
        total_register: {
            type: Sequelize.INTEGER
        }
    });
 
    return EventAnnual;
 
}