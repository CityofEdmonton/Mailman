

var SettingsService = {
  MAILMAN_LOG_NAME: 'mailman_log',
  SS_KEY: 'MAILMAN_LOG_URL',

  /**
   * Turns on logging and creates a log at the root of the user's drive.
   *
   * @return {string} The URL of the newly created log Sheet.
   */
  turnOnLogging: function() {
    var ss = SpreadsheetApp.create(SettingsService.MAILMAN_LOG_NAME);

    // The log file needs to be editable by anyone that could use Mailman.
    // Ideally, this log is temporary.
    var file = DriveApp.getFileById(ss.getId());
    file.setSharing(DriveApp.Access.DOMAIN, DriveApp.Permission.EDIT);

    var url = ss.getUrl();

    var prop = PropertiesService.getDocumentProperties();
    prop.setProperty(SettingsService.SS_KEY, url);

    return url;
  },

  /**
   * Turns off logging and deletes the log sheet.
   *
   */
  turnOffLogging: function() {
    var url = SettingsService.getLogURL();
    if (url === null) {
      return;
    }

    PropertiesService.getDocumentProperties().deleteProperty(SettingsService.SS_KEY);

    var ss = SpreadsheetApp.openByUrl(url);
    var id = ss.getId();
    var file = DriveApp.getFileById(id);
    file.setTrashed(true);
  },

  /**
   * Gets the URL of the log file or null if there isn't one.
   *
   * @return {string} The URL of the log file.
   */
  getLogURL: function() {
    var prop = PropertiesService.getDocumentProperties();
    return prop.getProperty(SettingsService.SS_KEY);
  }
};
