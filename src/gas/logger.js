
// This is the logging spreadsheet I'm using.
var logSheet;
var logSheetID = '1IBQrb0zET4Zh_KpdpTGVww_y15SGTOmo8B9ZM9ZXVzg';
var maxRows = 3000;

function log(text) {
  if (logSheet === undefined) {
    logSheet = SpreadsheetApp.openById(logSheetID);
  }
  if (logSheet.getLastRow() > maxRows) {
    logSheet.deleteRows(2, logSheet.getLastRow() - 1);
  }

  logSheet.appendRow([new Date().toString().slice(0, -15), text, Session.getActiveUser().getEmail()]);
}
