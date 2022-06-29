module.exports = function(sequelize, Sequelize) {
 
    var Report = sequelize.define('report', {
 
        id: {
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        content: {
            type: Sequelize.STRING,
            notEmpty: true
        },
        google_id_reporter: {
            type: Sequelize.STRING,
            notEmpty: true
        },
        post_id: {
            type: Sequelize.STRING,
            notEmpty: true
        },
        type_post: {
            type: Sequelize.STRING,
            notEmpty: true
        },
    });

    return Report;
 
}