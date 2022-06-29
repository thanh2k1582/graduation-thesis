const _ = require('lodash');
const { google } = require('googleapis');

const googleService = module.exports;

const auth = new google.auth.GoogleAuth({
  keyFile: 'src/config/API-KEYS/google_spreadsheet_keys.json',
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const googleSheetsInstanceAsync = async () => google.sheets({ version: 'v4', auth: await auth.getClient() });

googleService.addSheet = async (spreadsheetId, title) => {
  const googleSheetsInstance = await googleSheetsInstanceAsync();
  await googleSheetsInstance.spreadsheets.batchUpdate({
    spreadsheetId,
    resource: { requests: [{ addSheet: { properties: { title: title } } }] },
  });
};

googleService.appendValueToSheet = async (spreadsheetId, title, value) => {
  const googleSheetsInstance = await googleSheetsInstanceAsync();
  await googleSheetsInstance.spreadsheets.values.append({
    auth,
    spreadsheetId,
    range: title,
    valueInputOption: 'USER_ENTERED',
    resource: {
      values: [value],
    },
  });
};

googleService.getDataSheet = async (spreadsheetId, title) => {
  const googleSheetsInstance = await googleSheetsInstanceAsync();

  return await googleSheetsInstance.spreadsheets.values.get({
    auth,
    spreadsheetId,
    range: title,
  });
};

googleService.getSheets = async spreadsheetId => {
  const googleSheetsInstance = await googleSheetsInstanceAsync();
  (await googleSheetsInstance.spreadsheets.get({ spreadsheetId })).data.sheets;
};
