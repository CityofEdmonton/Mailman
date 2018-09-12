/**
 * @file A service focused on recieving headers.
 * @author {@link https://github.com/j-rewerts|Jared Rewerts}
 */


/**
 * A service used for retireving arrays of headers.
 *
 * @type {Object}
 */
var HeaderService = {

  /**
   * Gets an Array of header strings.
   * 
   * @param {string} sheet The name of the Sheet.
   * @param {string} row The 1-based index of the header.
   * @return {Array<string>} An Array of headers.
   */
  get: function(sheet, row) {
    try {
      var ss = Utility.getSpreadsheet();
      var sheet = ss.getSheetByName(sheet);

      if (sheet == null) {
        return [];
      }

      return sheet.getRange(row, 1, 1, sheet.getLastColumn()).getDisplayValues()[0];
    }
    catch (e) {
      logger.error(e, "Unable to get header, {ErrorMessage}", e);
      throw e;
    }
  }
};
