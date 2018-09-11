
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
    var sheet = ss.getSheetByName(MergeTemplateService.SHEET_NAME);

    if (sheet === null) {
      log('Creating config sheet.');
      sheet = ss.insertSheet(MergeTemplateService.SHEET_NAME);
    }

    sheet.hideSheet();
  },

  /**
   * Clears the data storage sheet.
   *
   */
  clearSheet: function() {
    var ss = Utility.getSpreadsheet();
    var sheet = ss.getSheetByName(MergeTemplateService.SHEET_NAME);
    sheet.clear();
  },

  createGuid: function () {
    // from https://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
};
