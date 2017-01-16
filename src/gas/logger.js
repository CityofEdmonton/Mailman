
// This is the logging spreadsheet I'm using.
var logSheet;
var maxRows = 3000;
var DEBUG = true;
var MAILMAN_LOG_NAME = 'mailman_log';
var SS_KEY = 'MAILMAN_LOG_URL';

function log(text) {
  if (DEBUG) {
    if (logSheet === undefined) {
      var url = getLogURL();

      if(url === null) {
        return;
      }

      logSheet = SpreadsheetApp.openByUrl(url);
    }
    if (logSheet.getLastRow() > maxRows) {
      var sheet = logSheet.getSheets()[0];
      sheet.getRange(2, 1, logSheet.getLastRow() - 1, logSheet.getLastColumn()).clear();
    }

    logSheet.appendRow([new Date().toString().slice(0, -15), text, Session.getActiveUser().getEmail(), MAILMAN_VERSION]);
  }

}

function turnOnLogging() {
  var ss = SpreadsheetApp.create(MAILMAN_LOG_NAME);
  var url = ss.getUrl();

  var prop = PropertiesService.getDocumentProperties();
  prop.setProperty(SS_KEY, url);

  return url;
};

function turnOffLogging() {
  var prop = PropertiesService.getDocumentProperties();
  var url = prop.getProperty(SS_KEY);
  prop.deleteProperty(SS_KEY);

  if (url === null) {
    return;
  }

  var ss = SpreadsheetApp.openByUrl(url);
  var id = ss.getId();
  var file = DriveApp.getFileById(id);
  file.setTrashed(true);
};

function getLogURL() {
  var prop = PropertiesService.getDocumentProperties();
  return prop.getProperty(SS_KEY);
};
