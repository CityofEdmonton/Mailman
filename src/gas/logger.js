
// This is the logging spreadsheet I'm using.
var logSheet;
var maxRows = 3000;

function log(text) {
  try {
    getLogSheet();
    Logger.log(logSheet);
    if (logSheet == null) {
      return;
    }


    if (logSheet.getLastRow() > maxRows) {
      var sheet = logSheet.getSheets()[0];
      sheet.getRange(2, 1, logSheet.getLastRow() - 1, logSheet.getLastColumn()).clear();
    }

    logSheet.appendRow([new Date().toString().slice(0, -15), text, Session.getActiveUser().getEmail(), MAILMAN_VERSION]);
  }
  catch (e) {
    // This tends to be the user not having logging permissions to the Sheet.
    throw e;
  }

}

function getLogSheet() {
  if (logSheet == null) {
    var url = SettingsService.getLogURL();
    Logger.log(url);

    if(url === null) {
      return;
    }

    try {
      // This catches the event where the log sheet has been deleted.
      logSheet = SpreadsheetApp.openByUrl(url);
    }
    catch (e) {
      Logger.log(e);
      return;
    }
  }
}
