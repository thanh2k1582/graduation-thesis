module.exports = function(sequelize, Sequelize) {
 
    const Area = sequelize.define('area', {
        id: {
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        ward_name: {
            type: Sequelize.STRING,
            notEmpty: true
        },
        county_name: {
            type: Sequelize.STRING,
            notEmpty: true
        },
    });
 
    return Area;
 
}