
var HeaderService = {
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
      log(e);
      throw e;
    }
  }
};
