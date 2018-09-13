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
        .addToUi();
  }
  
  
  /**
   * Creates an HTML sidebar for creating/viewing mailman rules.
   *
   */
  function openSidebar() {
  
    var ui = HtmlService.createHtmlOutput('<script>window.location.replace(\'https://localhost:44364/\');</script>')
        .setTitle(' ')
        .setSandboxMode(HtmlService.SandboxMode.IFRAME);
  
    SpreadsheetApp.getUi().showSidebar(ui);
  }
  
  