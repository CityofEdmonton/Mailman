
var Utility = {

  getSpreadsheet: function() {
    try {
      var id = PropertiesService.getDocumentProperties().getProperty(PROPERTY_SS_ID);
      var ss = SpreadsheetApp.openById(id);
    }
    catch (e) {
      log(e);
      throw e;
    }

    return ss;
  },

  /**
   * Creates the sheet used for storing mailman's data.
   *
   */
  setupSheet: function() {
    var ss = Utility.getSpreadsheet();
    var sheet = ss.getSheetByName(RULE_SHEET_NAME);

    if (sheet === null) {
      log('Creating config sheet.');
      sheet = ss.insertSheet(RULE_SHEET_NAME);
    }

    sheet.hideSheet();
  },

  /**
   * Validates all of Mailman's triggers. Logs any issues for debug purposes.
   *
   * @return {boolean} True if the triggers are set up properly, false if they are set up incorrectly.
   */
  validateTriggers: function() {
    var ss = Utility.getSpreadsheet();

    var triggers = ScriptApp.getUserTriggers(ss);
    log('Triggers:' + triggers.length);
    if (triggers.length !== 1) {
      log('Incorrect number of triggers: ' + triggers.length);
      return false;
    }

    return Utility.validateTrigger_(triggers[0]);
  },

  /**
   * Clears the data storage sheet.
   *
   */
  clearSheet: function() {
    var ss = Utility.getSpreadsheet();
    var sheet = ss.getSheetByName(RULE_SHEET_NAME);
    sheet.clear();
  },

  // *** Private functions *** //

  /**
   * Ensures the assigned trigger is valid.
   *
   * @param  {Trigger} trigger The Trigger to test.
   * @return {boolean} True if the Trigger is valid, false otherwise.
   */
  validateTrigger_: function(trigger) {
    if (trigger.getEventType() !== ScriptApp.EventType.CLOCK) {
      log('Invalid trigger event type');
      return false;
    }
    if (trigger.getHandlerFunction() !== 'sendManyEmails') {
      log('Invalid trigger function');
      return false;
    }

    return true;
  }
};
