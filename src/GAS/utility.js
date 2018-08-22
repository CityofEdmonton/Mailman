
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
  }
};
