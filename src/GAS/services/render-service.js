/**
 * @file A service focused on handling rendering text (using handlebars)
 * 
 * @author {@link https://github.com/dchenier|Dan Chenier}
 */


/**
 * This service handles Google Sheets.
 * 
 * @type {Object}
 */
var RenderService = {
    
      /**
       * The data about the current context, including row, sheetInfo, etc.
       *
       * @return {Array<any>} An array containing all of the Sheet names.
       */
      getContext: function(sheetName, headerRowIndex) {
        try {
          var ss = Utility.getSpreadsheet();
          var sheet = sheetName ? ss.getSheetByName(sheetName) : ss.getActiveSheet();

          // startRow, startColumn, numRows, numColumns
          var headerRowValues = sheet.getSheetValues(headerRowIndex ? headerRowIndex : 1, 1, 1, 128);
          var cell = sheet.getActiveCell();
          var rowValues = sheet.getSheetValues(cell.getRow(), 1, 1, 128);

          var returnValue = {};
          var minCellLength = headerRowValues.length < rowValues.length ? headerRowValues.length : rowValues.length ;
          for (var i=0; i<minCellLength; i++) {
            var k = headerRowValues[i], v = rowValues[i];
            if (k && v && typeof k === "string") {
              returnValue[k] = v;
            }
          }
          
          return returnValue;
        }
        catch (e) {
          log(e);
          throw e;
        }
      }
    }
    