/**
 * Prepares the add on after a user has opted to install it.
 *
 * @param {object} e The event object https://developers.google.com/apps-script/guides/triggers/events
 */
function onInstall(e) {
  onOpen(e);
}


/**
 * Called when the Spreadsheet is opened.
 *
 * @param {object} e The event object https://developers.google.com/apps-script/guides/triggers/events
 */
function onOpen(e) {
  logger.info("Starting Mailman {Version}", MAILMAN_VERSION);

  var menu = SpreadsheetApp.getUi().createAddonMenu();

  menu.addItem('Start', 'openSidebar')
      .addItem('Feedback', 'openFeedbackDialog')
      .addToUi();
}


/**
 * Creates an HTML sidebar for creating/viewing mailman rules.
 *
 */
function openSidebar() {
  var ssId = SpreadsheetApp.getActiveSpreadsheet().getId();
  PropertiesService.getDocumentProperties().setProperty(PROPERTY_SS_ID, ssId);
  PropertiesService.getUserProperties().setProperty(MAILMAN_SESSION_ID, Utility.createGuid());

  logger.info("Opening sidebar for {SpreadsheetId}", ssId);

  var ui = HtmlService.createHtmlOutputFromFile('html/mailman')
      .setTitle(' ')
      .setSandboxMode(HtmlService.SandboxMode.IFRAME);

  Utility.setupSheet();
  TriggerService.deleteUnusedTriggers();

  SpreadsheetApp.getUi().showSidebar(ui);
}


/**
 * Opens the feedback to dialog which directs users to the form.
 *
 */
function openFeedbackDialog() {
  logger.info("Opening feedback dialog");
  var ui = HtmlService.createHtmlOutputFromFile('html/feedback-dialog')
      .setTitle('Feedback')
      .setSandboxMode(HtmlService.SandboxMode.IFRAME);

  SpreadsheetApp.getUi().showModalDialog(ui, 'Feedback');
}
