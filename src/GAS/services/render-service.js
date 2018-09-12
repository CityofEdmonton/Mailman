/**
 * @file A service focused on handling rendering text 
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
  getContext: function(sheetName, headerRowIndex, dataRowIndex, sheetData) {
    logger.debug('RenderService.getContext() - BEGIN, sheetName={SheetName}, headerRowIndex={HeaderRowIndex}, dataRowIndex={DataRowIndex}, sheetData.length={SheetDataLength}', sheetName, headerRowIndex, dataRowIndex, (sheetData || {}).length);
    var startTime = new Date();
    try {
      var headerRowValues, rowValues;
      var nHeaderRowIndex = headerRowIndex && headerRowIndex === parseInt(headerRowIndex,10) ? headerRowIndex : 1;
      var spreadsheet = sheetName ? Utility.getSpreadsheet() : SpreadsheetApp.getActive();
      if (dataRowIndex && sheetData && sheetData.length > dataRowIndex && sheetData.length > nHeaderRowIndex) {
        logger.debug('getContext() using provided sheetData');
        headerRowValues = sheetData[nHeaderRowIndex-1]; // -1 because the array is zero-based
        rowValues = sheetData[dataRowIndex-1]; // -1 because the array is zero-based
      } else {
        logger.debug('getContext() using SpreadSheetApp');
        var sheet = sheetName ? spreadsheet.getSheetByName(sheetName) : SpreadsheetApp.getActiveSheet();
  
        // startRow, startColumn, numRows, numColumns
        headerRowValues = sheet.getSheetValues(nHeaderRowIndex, 1, 1, 128)[0];
        var rowNum = dataRowIndex;
        if (!(rowNum && rowNum === parseInt(rowNum, 10))) {
          var cell = sheet.getActiveCell();
          rowNum = cell.getRow();
        }
       
        rowValues = sheet.getSheetValues(rowNum, 1, 1, 128)[0];
      }

      var returnValue = {
        _meta: {
          url: spreadsheet.getUrl()
        }
      };
      var minCellLength = headerRowValues.length < rowValues.length ? headerRowValues.length : rowValues.length ;
      for (var i=0; i<minCellLength; i++) {
        var k = headerRowValues[i], v = rowValues[i];
        if (k && v && typeof k === "string") {
          returnValue[k] = v;
        }
      }
      logger.debug('RenderService context retrived: {Context}', JSON.stringify(returnValue));

      var endTime = new Date();
      logger.debug('Retrieved RenderService context for row {RowNumber}, sheet {SheetName} in {ElapsedMilliseconds}ms', dataRowIndex, sheetName, endTime - startTime);
      return returnValue;
    }
    catch (e) {
      logger.error(e, 'Error retrieving RenderService context, {ErrorMessage}', e);
      throw e;
    }
  },

    /**
   * This function replaces  all instances of <<tags>> with the data in headerToData.
   *
   * @param {string} text The string that contains the tags.
   * @param {Object} headerToData A key-value pair where the key is a column name and the value is the data in the
   * column.
   * @return {string} The text with all tags replaced with data.
   */
  replaceTags: function(text, headerToData) {
    if (text == null) {
      text = '';
    }

    // This must match <<these>> and &lt;&lt;these&gt;&gt; since we need to support HTML.
    var dataText = text.replace(/<<(.*?)>>|&lt;&lt;(.*?)&gt;&gt;/g, function(match, m1, m2, offset, string) {
      if (m1) {
        // remove leading and trailing whitespace, including &nbsp;
        m1 = m1.replace('&nbsp;', ' ').replace(/^\s+|\s+$/g, '');
        if (headerToData[m1]) {
          return headerToData[m1];
        }
      }
      if (m2) {
        // remove leading and trailing whitespace, including &nbsp;
        m2 = m2.replace('&nbsp;', ' ').replace(/^\s+|\s+$/g, '');
        if (headerToData[m2]) {
          return headerToData[m2];
        }
      }
      return '';
    });

    return dataText;
  },

  render: function(templateText, options) {
    logger.debug('RenderService.render() - BEGIN');
    var startTime = new Date();
    var opt = options || {};
    var context = opt.context;
    if (!context) {
      var sheetName = opt.sheetName, headerRowIndex = opt.headerRowIndex, dataRowIndex = opt.dataRowIndex;
      context = RenderService.getContext(sheetName, headerRowIndex, dataRowIndex);
    }
    
    var returnValue = RenderService.replaceTags(templateText, context);
    var endTime = new Date();
    logger.debug('Rendered {TemplateText} in {ElapsedMilliseconds}ms', templateText, endTime - startTime);
    return returnValue;
  }
}
    