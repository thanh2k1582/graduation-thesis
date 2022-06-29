module.exports = function(sequelize, Sequelize) {
 
    var sliderImage = sequelize.define('slider_image', {
 
        id: {
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
 
        image_name: {
            type: Sequelize.STRING,
            notEmpty: true
        },
 
        image: {
            type: Sequelize.BLOB,
            notEmpty: true
        },
 
    });
 
    return sliderImage;
 
}