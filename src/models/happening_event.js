module.exports = function(sequelize, Sequelize) {
 
    const HappeningEvent = sequelize.define('happening_event', {
 
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
        status: {
            type: Sequelize.INTEGER,
            notEmpty: true
        },
        status_mail: {
            type: Sequelize.BOOLEAN,
            defaultValue: false,
        },
        sheet_of_event: {
            type: Sequelize.BOOLEAN,
            defaultValue: false,
        },
        event_type_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
 
    });
 
    return HappeningEvent;
 
}