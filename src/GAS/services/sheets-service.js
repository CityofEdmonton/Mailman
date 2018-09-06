/**
 * @file A service focused on handling Google Sheets.
 * @author {@link https://github.com/j-rewerts|Jared Rewerts}
 */


/**
 * This service handles Google Sheets.
 * 
 * @type {Object}
 */
var SheetsService = {

  /**
   * Gets the names of all Sheets in the Spreadsheet this is installed in.
   *
   * @return {Array<string>} An array containing all of the Sheet names.
   */
  get: function() {
    try {
      var ss = Utility.getSpreadsheet();
      var sheets = ss.getSheets();
      var names = [];
      sheets.forEach(function(sheet) {
        var name = sheet.getName();
        if (name !== 'mm-config') {
          names.push(name);
        }
      });
      return names;
    }
    catch (e) {
      log(e);
      throw e;
    }
  },

  /**
   * Returns the active cell in the active sheet,
   * e.g. Sheet1!A2
   * 
   */
  getActiveCell: function() {
    try {
      var sheet = SpreadsheetApp.getActiveSheet(),   
        cell = sheet.getActiveCell();    
      return sheet.getName() + "!" + cell.getA1Notation();
    }
    catch (e) {
      log(e);
      throw e;
    }
  },

  getFormUrl: function(sheetName) {
    console.log("test3"+sheetName);
    var ss = Utility.getSpreadsheet();
    var sheet = ss.getSheetByName(sheetName);
    var formURL =sheet.getFormUrl();
    console.log("url is : "+ formURL);
    return formURL;

  }

}
