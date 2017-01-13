/**
 * Prepares the add on after a user has opted to install it.
 * TODO Test this
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
  var menu = SpreadsheetApp.getUi().createAddonMenu();

  menu.addItem('Setup', 'openSidebar')
      .addItem('Feedback', 'openFeedbackDialog')
      .addToUi();
}


/**
 * Creates an HTML sidebar for creating/viewing mailman rules.
 *
 */
function openSidebar() {
  PropertiesService.getDocumentProperties().setProperty(PROPERTY_SS_ID, SpreadsheetApp.getActiveSpreadsheet().getId());

  var ui = HtmlService.createHtmlOutputFromFile('mailman')
      .setTitle(' ')
      .setSandboxMode(HtmlService.SandboxMode.IFRAME);

  if (!validateTriggers()) {
    deleteForThisSheet();
    log('Triggers should be rebuilt.');
    createTriggerBasedEmail(); // IMPORTANT
  }

  setupSheet();

  SpreadsheetApp.getUi().showSidebar(ui);
}


/**
 * Opens the feedback to dialog which directs users to the form.
 *
 */
function openFeedbackDialog() {
  var ui = HtmlService.createHtmlOutputFromFile('feedback-dialog')
      .setTitle('Feedback')
      .setSandboxMode(HtmlService.SandboxMode.IFRAME);

  SpreadsheetApp.getUi().showModalDialog(ui, 'Feedback');
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
