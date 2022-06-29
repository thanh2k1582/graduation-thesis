module.exports = function(sequelize, Sequelize) {
 
    const Inn = sequelize.define('inn', {
 
        id: {
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
 
        title: {
            type: Sequelize.STRING,
            notEmpty: true
        },
        price: {
            type: Sequelize.STRING,
            notEmpty: true
        },
        acreage: {
            type: Sequelize.STRING,
            notEmpty: true
        },
        address: {
            type: Sequelize.STRING,
            notEmpty: true
        },
        image_slide: {
            type: Sequelize.STRING,
            notEmpty: true
        },
        author: {
            type: Sequelize.STRING,
            notEmpty: true
        },
        avatar: {
            type: Sequelize.STRING,
            notEmpty: true
        },
        description: {
            type: Sequelize.TEXT('long'),
            notEmpty: true
        },
        description_short: {
            type: Sequelize.TEXT('long'),
            notEmpty: true
        },
        postPlace: {
            type: Sequelize.TEXT('long'),
            notEmpty: true
        },
        contact: {
            type: Sequelize.TEXT('long'),
            notEmpty: true
        },
        deletedAt: {
            type: Sequelize.BOOLEAN,
            defaultValue: false,
        },
        reason: {
            type: Sequelize.STRING,
            allowNull: true
        }
    });
 
    return Inn;
 
}