


/**
 * This service allows easy access to the Mailman template data.
 *
 * @type {Object}
 */
var MergeTemplateService = {
  SHEET_NAME: 'mm-config',
  ID_INDEX: 1,
  DATA_INDEX: 2,

  //***** public methods *****//

  /**
   * Gets all MergeTemplates.
   *
   * @return {string} A stringified array (<Array<MergeTemplate>).
   */
  getAll: function() {
    try {
      var sheet = MergeTemplateService.getTemplateSheet();
      var range = sheet.getDataRange();
      var rObj = {
        templates: []
      };

      for (var i = 0; i < range.getNumRows(); i++) {
        var row = range.offset(i, 0, 1, range.getNumColumns());
        try {
          var config = JSON.parse(row.getCell(1, MergeTemplateService.DATA_INDEX).getDisplayValue());
          rObj.templates.push(config);
        }
        catch (e) {
          // Potentially delete the template.
          log('Invalid JSON discovered.');
        }
      }

      return rObj;
    }
    catch (e) {
      log(e);
      throw e;
    }
  },

  /**
   * Gets a MergeTemplate by id. Note that the returned object is just a string.
   * Use JSON.parse if you want the actual Object.
   *
   * @param  {string} id The id of the MergeTemplate to return.
   * @return {string} A stringified version of the MergeTemplate.
   */
  getByID: function(id) {
    try {
      var row = MergeTemplateService.getRowByID(id);
      if (row === null) {
        return {};
      }

      return row.getCell(1, MergeTemplateService.DATA_INDEX).getDisplayValue();
    }
    catch (e) {
      log(e);
      throw e;
    }
  },

  /**
   * Deletes a MergeTemplate by id.
   *
   * @param  {string} id The id of the MergeTemplate to delete.
   */
  deleteByID: function(id) {
    try {
      var sheet = MergeTemplateService.getTemplateSheet();
      var row = MergeTemplateService.getRowByID(id);

      if (row !== null) {
        sheet.deleteRow(row.getRowIndex());
      }
    }
    catch (e) {
      log(e);
      throw e;
    }
  },

  /**
   * Creates a new MergeTemplate.
   *
   * @param  {MergeTemplate} template The stringified version of the MergeTemplate to create.
   */
  create: function(template) {
    try {
      // We need to verify there is a timestamp column.
      var dataSheet = getSpreadsheet().getSheetByName(template.mergeData.sheet);
      if (dataSheet !== null) {
        var headers = HeaderService.get(template.mergeData.sheet, template.mergeData.headerRow);
        var name = template.mergeData.timestampColumn.replace('<<', '').replace('>>', '');

        if (headers.indexOf(name) === -1) {
          MergeTemplateService.appendColumn(template.mergeData.sheet, template.mergeData.headerRow, name);
        }
      }

      var sheet = MergeTemplateService.getTemplateSheet();

      sheet.appendRow([template.id, JSON.stringify(template)]);
    }
    catch (e) {
      log(e);
      throw e;
    }
  },

  /**
   * Updates an existing MergeTemplate. MergeTemplate.id is used to do the comparison.
   *
   * @param  {MergeTemplate} template The new MergeTemplate.
   */
  update: function(template) {
    try {
      // We need to verify there is a timestamp column.
      var dataSheet = getSpreadsheet().getSheetByName(template.mergeData.sheet);
      if (dataSheet !== null) {
        var headers = HeaderService.get(template.mergeData.sheet, template.mergeData.headerRow);
        var name = template.mergeData.timestampColumn.replace('<<', '').replace('>>', '');

        if (headers.indexOf(name) === -1) {
          MergeTemplateService.appendColumn(template.mergeData.sheet, template.mergeData.headerRow, name);
        }
      }

      log('updating: ' + template.id);
      var row = MergeTemplateService.getRowByID(template.id);

      if (row == null) {
        throw new Error('Template ' + template.id + ' does not exist.');
      }

      var cell = row.getCell(1, MergeTemplateService.DATA_INDEX);
      cell.setValue(JSON.stringify(template));
    }
    catch (e) {
      log(e);
      throw e;
    }
  },

  //***** private methods / utility methods *****//

  getRowByID: function(id) {
    var sheet = MergeTemplateService.getTemplateSheet();
    var range = sheet.getDataRange();

    for (var i = 0; i < range.getNumRows(); i++) {

      var row = range.offset(i, 0, 1, range.getNumColumns());
      var idCell = row.getCell(1, MergeTemplateService.ID_INDEX);

      if (idCell.getDisplayValue() === id) {
        return row;
      }
    }

    return null;
  },

  getTemplateSheet: function() {
    var ss = getSpreadsheet();
    return ss.getSheetByName(MergeTemplateService.SHEET_NAME);
  },

  appendColumn: function(sheetName, rowNum, name) {
    var ss = getSpreadsheet();
    var sheet = ss.getSheetByName(sheetName);
    var range = sheet.getDataRange();
    var headerRow = range.offset(rowNum - 1, 0, 1, range.getNumColumns());

    var newHeader = headerRow.offset(0, headerRow.getNumColumns(), 1, 1);
    newHeader.setValue(name);

    return newHeader;
  }
};
