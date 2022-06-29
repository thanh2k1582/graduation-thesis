module.exports = function(sequelize, Sequelize) {
 
    const MotelType = sequelize.define('motel_type', {
        id: {
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
 
        title: {
            type: Sequelize.STRING,
            notEmpty: true
        }
    });
 
    return MotelType;
 
}