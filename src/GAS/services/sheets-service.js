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
      logger.error(e, 'Error getting sheet names, {ErrorMessage}', e);
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
      logger.error(e, 'Error getting active cell, {ErrorMessage}', e);
      throw e;
    }
  },

  getFormUrl: function(sheetName) {
    logger.debug('Getting formUrl for sheet {SheetName}', sheetName);
    var ss = Utility.getSpreadsheet();
    var sheet = ss.getSheetByName(sheetName);
    var formUrl =sheet.getFormUrl();
    logger.debug('formUrl for {SheetName} is {FormUrl}', sheetName, formUrl);
    return formUrl;

  }

}
