

function launchRTE() {
  openModalDialog();
}

/**
 * Called from the client-side. Returns the current selection in A1 notation.
 *
 * @return {string} The sheets selection in A1 notation.
 */
function getSheetSelection() {
  var column = columnToLetter(SpreadsheetApp.getActiveRange().getColumn());
  var sheet = SpreadsheetApp.getActiveRange().getSheet().getName();

  return sheet + '!' + column + ':' + column;
}


/**
 * The ultimate output of the client-side html form.
 * Used to create a new rule to check.
 *
 * @param {string} to The user to send the email to.
 * @param {string} subject The subject of the email.
 * @param {string} body The body of the email. If it's HTML, you must set the htmlBody option to have it rendered.
 * @param {object} options The additional options for the email. See:
 *  https://developers.google.com/apps-script/reference/mail/mail-app#sendEmail(String,String,String,Object)
 * @param {string} sheet The sheet name that emails will be sent from.
 * @return {string} Success value that informs users of issues/success
 */
function createRule(to, subject, body, options, sheet) {
  // Test all the values

  var rule = {
    'to': to,
    'subject': subject,
    'body': body,
    'options': options,
    'sheet': sheet
  };

  PropertiesService.getDocumentProperties().setProperty(PROPERTY_RULE, JSON.stringify(rule));

  Logger.log(rule);

  // TEMP
  onTrigger();

  return 'Success';
}


/**
 * Sends an email.
 * TODO Ensure success/fail are handled elegantly.
 *
 * @param {string} to The user to send the email to.
 * @param {string} subject The subject of the email.
 * @param {string} body The body of the email. If it's HTML, you must set the htmlBody option to have it rendered.
 * @param {object} options The additional options for the email. See:
 *  https://developers.google.com/apps-script/reference/mail/mail-app#sendEmail(String,String,String,Object)
 */
function sendEmail(to, subject, body, options) {
  Logger.log('Sending email to ' + to);
  MailApp.sendEmail(to, subject, body, options);
}


/**
 * Gets the names of all the available sheets.
 *
 * @return {Array<string>} The names of all the sheets.
 */
function getSheets() {
  SPREADSHEET_ID = PropertiesService.getDocumentProperties().getProperty(PROPERTY_SS_ID);
  var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  var sheets = ss.getSheets();

  var names = [];
  for (var i = 0; i < sheets.length; i++) {
    names.push(sheets[i].getName());
  }

  return names;
}


/**
 * Gets the headers from a specified sheet.
 *
 * @param {string} sheetName The name of the sheet.
 * @return {Array<string>} The names of all the headers.
 */
function getHeaderNames(sheetName) {
  SPREADSHEET_ID = PropertiesService.getDocumentProperties().getProperty(PROPERTY_SS_ID);
  var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  var sheet = ss.getSheetByName(sheetName);

  return getHeaderStrings(sheet);
}
