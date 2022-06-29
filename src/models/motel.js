module.exports = function(sequelize, Sequelize) {
 
    const Motel = sequelize.define('motel', {
 
        id: {
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        user_id: {
            type: Sequelize.INTEGER,
            notEmpty: true
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
        description: {
            type: Sequelize.TEXT('long'),
            notEmpty: true
        },
        status: {
            type: Sequelize.INTEGER,
            notEmpty: true
        },
        images: {
            type: Sequelize.STRING,
            notEmpty: true
        },
        model_type_id: {
            type: Sequelize.INTEGER,
            notEmpty: true
        },
        area_id: {
            type: Sequelize.INTEGER,
            notEmpty: true
        },
        deletedAt: {
            type: Sequelize.BOOLEAN,
            defaultValue: false,
        }
    });
 
    return Motel;
 
}