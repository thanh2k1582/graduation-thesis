module.exports = function(sequelize, Sequelize) {
 
    var Admin = sequelize.define('admin', {
 
        id: {
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        account: {
            type: Sequelize.STRING,
            notEmpty: true
        },
        password: {
            type: Sequelize.STRING,
            notEmpty: true
        },
        avatar: {
            type: Sequelize.STRING
        },
    });

    return Admin;
 
}