module.exports = function(sequelize, Sequelize) {
 
    const GoogleSpreadsheet = sequelize.define('google_spreadsheet', {
        id: {
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        event_id: {
            type: Sequelize.INTEGER,
            notEmpty: true
        },
        spreadsheet_id: {
            type: Sequelize.STRING,
            notEmpty: true
        },
        spreadsheet_name: {
            type: Sequelize.STRING,
            notEmpty: true
        },
        sheet_id: {
            type: Sequelize.STRING,
            notEmpty: true
        },
        sheet_name: {
            type: Sequelize.STRING,
            notEmpty: true
        },
        
    });
 
    return GoogleSpreadsheet;
 
}