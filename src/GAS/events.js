/**
 * Prepares the add on after a user has opted to install it.
 * TODO Test this
 *
 * @param {object} e The event object https://developers.google.com/apps-script/guides/triggers/events
 */
function onInstall(e) {
  //Install triggers
  PropertiesService.getDocumentProperties().setProperty(PROPERTY_SS_ID, SpreadsheetApp.getActiveSpreadsheet().getId());

  onOpen(e);
}


/**
 * Called when the Spreadsheet is opened.
 *
 * @param {object} e The event object https://developers.google.com/apps-script/guides/triggers/events
 */
function onOpen(e) {
  var menu = SpreadsheetApp.getUi().createAddonMenu();

  menu.addItem('Set Up Email List', 'openSidebar')
      .addToUi();

  menu.addItem('Build Email', 'openModalDialog')
      .addToUi();

  PropertiesService.getDocumentProperties().setProperty(PROPERTY_SS_ID, SpreadsheetApp.getActiveSpreadsheet().getId());
}


/**
 * Creates an HTML sidebar for creating/viewing mailman rules.
 *
 */
function openSidebar() {
  var ui = HtmlService.createHtmlOutputFromFile('NewEmailDialog')
      .setTitle('Mailman')
      .setSandboxMode(HtmlService.SandboxMode.IFRAME);

  SpreadsheetApp.getUi().showSidebar(ui);
}


/**
 * Creates an HTML modal for creating/viewing Mailman email templates.
 *
 */
function openModalDialog() {
  var ui = HtmlService.createHtmlOutputFromFile('rich-text-editor')
      .setTitle('Mailman')
      .setSandboxMode(HtmlService.SandboxMode.IFRAME)
      .setHeight(600)
      .setWidth(750);

  SpreadsheetApp.getUi().showModalDialog(ui, ' ');
}

/**
 *
 */
function onTrigger() {
  Logger.log('Running trigger function...');

  var headers = 1;

  // Get all rules (TODO Multiple rules)
  var rule = getRule();
  SPREADSHEET_ID = PropertiesService.getDocumentProperties().getProperty(PROPERTY_SS_ID);

  // Validate each rule for each row
  var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  var sheet = ss.getSheetByName(rule.sheet);
  var range = sheet.getDataRange();
  var header = getHeaderStrings(sheet);

  for (var i = 1; i < range.getNumRows(); i++) {
    var row = getValues(sheet, i);

    var combinedObj = {};
    for (var j = 0; j < header.length; j++) {
      combinedObj[header[j]] = row[j];
    }

    // Convert <<>> tags to actual text.
    var to = replaceTags(rule.to, combinedObj);
    var subject = replaceTags(rule.subject, combinedObj);
    var body = replaceTags(rule.body, combinedObj);

    Logger.log('Sending email to ' + to);
    MailApp.sendEmail(to, subject, body);
  }

}
