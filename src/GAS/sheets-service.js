var SheetsService = {

  /**
   * Gets the names of all Sheets in the Spreadsheet this is installed in.
   *
   * @return {Array<string>} An array containing all of the Sheet names.
   */
  get: function() {
    var ss = getSpreadsheet();
    return ss.getSheets().map(function(sheet) {
      return sheet.getName();
    });
  }
}
