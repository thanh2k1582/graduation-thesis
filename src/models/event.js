module.exports = function(sequelize, Sequelize) {
 
    const Event = sequelize.define('event', {
        id: {
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        event_type_id: {
            type: Sequelize.INTEGER,
            notEmpty: true
        },
        title: {
            type: Sequelize.STRING,
            notEmpty: true
        },
        content: {
            type: Sequelize.TEXT('long'),
            notEmpty: true
        },
        actionAt: {
            type: Sequelize.STRING,
            notEmpty: true
        },
        image: {
            type: Sequelize.JSON,
            notEmpty: true
        },
        register_total: {
            type: Sequelize.INTEGER,
            allowNull: true
        }
    });
 
    return Event;
 
}