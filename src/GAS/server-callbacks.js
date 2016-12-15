

/**
 * Creates a trigger for sending emails.
 *
 */
function createTriggerBasedEmail() {
  try {
    SPREADSHEET_ID = PropertiesService.getDocumentProperties().getProperty(PROPERTY_SS_ID);
    var ss = SpreadsheetApp.openById(SPREADSHEET_ID);

    deleteAllTriggers(ss);

    log('Creating trigger.');
    ScriptApp.newTrigger('sendManyEmails')
        .timeBased()
        .everyHours(1)
        .create();
  }
  catch (e) {
    log('Error: ' + e);
    throw e;
  }
}


/**
 * Gets the property PROPERTY_HEADER_ROW. This is the value used as a header row.
 *
 * @return {string} The header row to look in for header information.
 */
function getHeaderRow() {
  var hRow = load(PROPERTY_HEADER_ROW);

  if (hRow === null) {
    hRow = '1';
  }

  return hRow;
}


/**
 * Sets the PROPERTY_HEADER_ROW value. This is used for determining which row to look in for headers.
 *
 * @param {string} row The 1-based row-value corresponding to the header row.
 * @param {string} sheet The name of the Sheet we are interested in.
 * @return {Array<string>} The header names.
 */
function setHeaderRow(row, sheet) {
  save(PROPERTY_HEADER_ROW, row);

  return getHeaderNames(sheet);
}


/**
 * Launches the Rich Text Editor.
 *
 * @return {string} The id of the newly created dialog.
 */
function launchRTE() {
  var dialogId = Utilities.base64Encode(Math.random());

  var template = HtmlService.createTemplateFromFile('rich-text-editor');
  template.dialogId = dialogId;

  var ui = template.evaluate()
      .setTitle('Mailman')
      .setSandboxMode(HtmlService.SandboxMode.IFRAME)
      .setHeight(600)
      .setWidth(750);

  SpreadsheetApp.getUi().showModalDialog(ui, ' ');

  return 'dialog';
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
