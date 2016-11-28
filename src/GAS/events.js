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

  PropertiesService.getDocumentProperties().setProperty(PROPERTY_SS_ID, SpreadsheetApp.getActiveSpreadsheet().getId());
}


/**
 * Creates an HTML sidebar for creating/viewing mailman rules.
 *
 */
function openSidebar() {
  var ui = HtmlService.createHtmlOutputFromFile('new-email-dialog')
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
