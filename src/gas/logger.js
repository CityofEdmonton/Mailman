
// This is the logging spreadsheet I'm using.
var logSheet;
var maxRows = 3000;
var MAILMAN_LOG_NAME = 'mailman_log';
var SS_KEY = 'MAILMAN_LOG_URL';

function log(text) {
  try {
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
  catch (e) {
    // This tends to be the user not having logging permissions to the Sheet.
  }

}

function turnOnLogging() {
  var ss = SpreadsheetApp.create(MAILMAN_LOG_NAME);

  // The log file needs to be editable by anyone that could use Mailman.
  // Ideally, this log is temporary.
  var file = DriveApp.getFileById(ss.getId());
  file.setSharing(DriveApp.Access.DOMAIN, DriveApp.Permission.EDIT);

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
