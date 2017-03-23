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
  }
}
