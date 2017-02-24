
var HeaderService = {
  get: function(sheet, row) {
    try {
      var ss = getSpreadsheet();
      var sheet = ss.getSheetByName(sheet);      
      return sheet.getRange(row, 1, 1, sheet.getLastColumn());
    }
    catch (e) {
      log(e);
      throw e;
    }
  }
};
