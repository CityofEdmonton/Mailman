function createTrigger() {
  ScriptApp.newTrigger('sendManyEmails')
    .timeBased()
    .after(90000)
    .create();
}

function getHeaderRow() {
  var hRow = load(PROPERTY_HEADER_ROW);

  if (hRow === null) {
    hRow = 1;
  }

  return hRow;
}

function setHeaderRow(row, sheet) {
  save(PROPERTY_HEADER_ROW, row);

  return getHeaderNames(sheet);
}

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
