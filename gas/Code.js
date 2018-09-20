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
  var ui = HtmlService.createHtmlOutput('<script>var addonWindowInfo; window.addEventListener("message", function(e) { if ("' + url + '".startsWith(e.origin)) { addonWindowInfo = { window: e.source, origin: e.origin }; google.script.run.withSuccessHandler(onAddonLoaded).getAccessToken(); } });\nfunction onAddonLoaded(token) {\n addonWindowInfo.window.postMessage(token, addonWindowInfo.origin);\n}\n</script><iframe src="' + url + '?ssid=' + ssId + '" frameborder="0" style="overflow:hidden;height:100%;width:100%" height="100%" width="100%"></iframe>')
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