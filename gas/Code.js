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
  console.log("Starting Mailman 2.0");

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
  var url = PropertiesService.getScriptProperties().getProperty("url");

  var ssId = SpreadsheetApp.getActiveSpreadsheet().getId();
  var template = HtmlService.createTemplateFromFile("Startup")
  template.loginurl = url + '?ssid=' + ssId;

  var ui = template.evaluate()
      .setTitle(' ')
      .setSandboxMode(HtmlService.SandboxMode.IFRAME);

  SpreadsheetApp.getUi().showSidebar(ui);
}


/**
* Opens the feedback to dialog which directs users to the form.
*
*/
function openFeedbackDialog() {
var url = PropertiesService.getScriptProperties().getProperty("feedbackUrl");
var ssId = SpreadsheetApp.getActiveSpreadsheet().getId();
var ui = HtmlService.createHtmlOutput('<script>window.location.replace(\'' + url + '?ssid=' + ssId + '\');</script>')
    .setTitle('Feedback')
    .setSandboxMode(HtmlService.SandboxMode.IFRAME);

SpreadsheetApp.getUi().showModalDialog(ui, 'Feedback');
}


function getAccessToken() {
  return ScriptApp.getOAuthToken();
}

function getUserInfo() {
  // this function is here just to make the app use the Plus+ scope, which the web application needs.
  // Be sure to add this "Advanced Google Service" under the Resources menu
  var me = Plus.People.get('me');
  console.log('getUserInfo', me);
}