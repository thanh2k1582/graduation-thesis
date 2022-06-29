module.exports = function(sequelize, Sequelize) {
 
    var Reason = sequelize.define('reason', {
 
        id: {
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        content: {
            type: Sequelize.STRING,
            notEmpty: true
        },
    });

    return Reason;
 
}