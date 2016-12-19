
// This is the logging spreadsheet I'm using.
var logSheet;
var logSheetID = '1IBQrb0zET4Zh_KpdpTGVww_y15SGTOmo8B9ZM9ZXVzg';
var maxRows = 3000;
var DEBUG = true;

function log(text) {
  if (DEBUG) {
    if (logSheet === undefined) {
      logSheet = SpreadsheetApp.openById(logSheetID);
    }
    if (logSheet.getLastRow() > maxRows) {
      var sheet = logSheet.getSheets()[0];
      sheet.getRange(2, 1, logSheet.getLastRow() - 1, logSheet.getLastColumn()).clear();
    }

    logSheet.appendRow([new Date().toString().slice(0, -15), text, Session.getActiveUser().getEmail(), MAILMAN_VERSION]);
  }

}
