/**
 * @file A service focused on managing MergeTemplates.
 * @author {@link https://github.com/j-rewerts|Jared Rewerts}
 */


/**
 * Runs all MergeTemplates. Google Apps Script requires a function be globally accessible for it to be run via trigger.
 *
 */
function runAllMergeTemplates() {
  MergeTemplateService.runAll();
};


/**
 * This service allows easy access to the Mailman template data.
 *
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
        var row = range.offset(i, 0, 1, MergeTemplateService.DATA_INDEX);
        var value = row.getCell(1, MergeTemplateService.DATA_INDEX).getDisplayValue();

        if (value === '') {
          continue;
        }

        var config;
        try {
          config = JSON.parse(value);
          MergeTemplateService.validate(config);
          rObj.templates.push(config);
        }
        catch (e) {
          // Potentially delete the template.
          log(e);
          sheet.appendRow(['']);
          sheet.deleteRow(row.getRowIndex());
          log('Deleting invalid MergeTemplate.');
          i--;
        }
      }

      rObj.templates.forEach(function(template) {
        try {
          MergeTemplateService.validateMergeRepeater(template);
        }
        catch(e) {
          log(e);
          template.mergeRepeater = null;
          MergeTemplateService.update(template);
        }
      });

      return rObj;
    }
    catch (e) {
      log(e);
      throw e;
    }
  },

  /**
   * This function runs all previously created MergeTemplates.
   * Templates are filtered on the following conditions:
   * - MergeTemplate has a mergeRepeater
   * - MergeRepeater.owner is the same as the effective user.
   * - The triggerID this is called from matches the triggerIDs inside MergeRepeater.
   *
   */
  runAll: function() {
    try {
      log('Running all merge templates.');

      var user = Session.getEffectiveUser().getEmail();
      var templates = MergeTemplateService.getAll().templates;

      templates = templates.filter(function(template) {
        if (template.mergeRepeater == null) {
          return false;
        }
        if (template.mergeRepeater.owner !== user) {
          return false;
        }

        // TODO filter by the calling triggers id with template.mergeRepeater.triggers.

        return true;
      });

      templates.forEach(function(template) {
        var mergeData = template.mergeData;
        if (template.mergeData.type === "Email") {
          EmailService.startMergeTemplate(template);
        }
        else {
          log('Template attempting to run with type: ' + template.mergeData.type);
        }
      });

      log('Done running merge templates.');
    }
    catch (e) {
      console.log("Error running merge templates");
      console.log(e);
      log(e);
      throw(e);
    }
  },

  /**
   * Gets a MergeTemplate by id. Note that the returned object is just a string.
   * Use JSON.parse if you want the actual Object.
   *
   * @param  {string} id The id of the MergeTemplate to return.
   * @return {Object|null} A config Object of a {@link MergeTemplate}.
   */
  getByID: function(id) {
    try {
      var sheet = MergeTemplateService.getTemplateSheet();
      var row = MergeTemplateService.getRowByID(id);
      if (row === null) {
        log('MergeTemplate ' + id + ' doesn\'t exist.');
        return null;
      }

      var value = row.getCell(1, MergeTemplateService.DATA_INDEX).getDisplayValue();

      var config;
      try {
        config = JSON.parse(value);
        MergeTemplateService.validate(config);
        return config;
      }
      catch (e) {
        // Potentially delete the template.
        log(e);
        sheet.appendRow(['']);
        sheet.deleteRow(row.getRowIndex());
        log('Deleting invalid MergeTemplate.');
        return null;
      }
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
        log('Deleting ' + id);
        sheet.appendRow(['']);
        sheet.deleteRow(row.getRowIndex());
      }
      TriggerService.deleteUnusedTriggers();
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
      var dataSheet = Utility.getSpreadsheet().getSheetByName(template.mergeData.sheet);
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
      var dataSheet = Utility.getSpreadsheet().getSheetByName(template.mergeData.sheet);
      if (dataSheet !== null) {
        var headers = HeaderService.get(template.mergeData.sheet, template.mergeData.headerRow);
        var name = template.mergeData.timestampColumn.replace('<<', '').replace('>>', '');

        if (headers.indexOf(name) === -1) {
          MergeTemplateService.appendColumn(template.mergeData.sheet, template.mergeData.headerRow, name);
        }
      }

      log('updating: ' + template.id);
      // Verify the active user has permissions to edit this MergeTemplate.
      var oldTemplate = MergeTemplateService.getByID(template.id);
      if (oldTemplate === null) {
        throw new Error('Template ' + template.id + ' does not exist.');
      }

      var row = MergeTemplateService.getRowByID(template.id);
      if (row == null) {
        throw new Error('Template ' + template.id + ' does not exist.');
      }

      var cell = row.getCell(1, MergeTemplateService.DATA_INDEX);
      cell.setValue(JSON.stringify(template));

      TriggerService.deleteUnusedTriggers();
    }
    catch (e) {
      log(e);
      throw e;
    }
  },

  /**
   * Gets a config Object that describes a MergeRepeater. This creates the required triggers,
   * if they don't already exist.
   *
   * @return {MergeRepeater} See MergeRepeater for details on members.
   */
  getRepeatConfig: function() {
    try {
      var ss = Utility.getSpreadsheet();
      var triggers = ScriptApp.getUserTriggers(ss);

      return {
        triggers: TriggerService.createTriggers(),
        owner: Session.getEffectiveUser().getEmail(),
        events: [
          'Merge Repeater created.'
        ],
        sheetID: ss.getId()
      }
    }
    catch (e) {
      log(e);
      throw e;
    }
  },

  /**
   * Adds a MergeRepeater to the provided MergeTemplate.
   *
   * @param {MergeTemplate} template This MergeTemplate has a MergeRepeater added.
   * @return {MergeTemplate} The new MergeTemplate with the added MergeRepeater.
   */
  addRepeater: function(template) {
    try {
      var ss = Utility.getSpreadsheet();
      var triggers = ScriptApp.getUserTriggers(ss);

      template.mergeRepeater = {
        triggers: TriggerService.createTriggers(),
        owner: Session.getEffectiveUser().getEmail(),
        events: [
          'Merge Repeater created.'
        ],
        sheetID: ss.getId()
      };

      MergeTemplateService.update(template);
      log('MergeTemplate ' + template.id + ' now repeating.');
      return template;
    }
    catch (e) {
      log(e);
      throw e;
    }
  },

  /**
   * Remove the MergeRepeater from this MergeTemplate.
   *
   * @param {MergeTemplate} template The object that has the MergeRepeater to be removed.
   * @return {MergeTemplate} The Object that no longer has the MergeRepeater attached.
   */
  removeRepeatMerge: function(template) {
    try {
      var ss = Utility.getSpreadsheet();

      template.mergeRepeater = undefined;
      MergeTemplateService.update(template);
      return template;
    }
    catch (e) {
      log(e);
      throw e;
    }
  },

  /**
   * Gets all MergeRepeaters.
   *
   * @return {Array<MergeRepeater>} An array of MergeRepeaters.
   */
  getMergeRepeaters: function() {
    var templates = MergeTemplateService.getAll().templates;
    var mergeRepeaters = [];

    templates.forEach(function(tpl) {
      if (tpl.mergeRepeater != null) {
        mergeRepeaters.push(tpl.mergeRepeater);
      }
    });

    return mergeRepeaters;
  },

  /**
   * Validates the correctness of a MergeTemplate. Note that a template's mergeRepeater is not validated, but its
   * mergeData object is.
   *
   * @param  {MergeTemplate} template A simple config Object representing a MergeTemplate.
   */
  validate: function(template) {
    if (template == null) {
      throw new Error('MergeTemplate is null');
    }

    MergeTemplateService.validateMergeData(template.mergeData);
  },

  /**
   * Validates the correctness of a MergeData object.
   *
   * @param  {MergeData} mergeData A simple config Object representing a MergeData.
   */
  validateMergeData: function(mergeData) {
    if (mergeData == null) {
      throw new Error('MergeTemplate.mergeData is null');
    }
    if (mergeData.type == null) {
      throw new Error('MergeTemplate.mergeData.type is null');
    }
    if (mergeData.data == null) {
      throw new Error('MergeTemplate.mergeData.data is null');
    }
    if (mergeData.sheet == null) {
      throw new Error('MergeTemplate.mergeData.sheet is null');
    }
    if (mergeData.title == null) {
      throw new Error('MergeTemplate.mergeData.title is null');
    }
    if (mergeData.headerRow == null) {
      throw new Error('MergeTemplate.mergeData.headerRow is null');
    }
    if (mergeData.timestampColumn == null) {
      throw new Error('MergeTemplate.mergeData.timestampColumn is null');
    }

    if (mergeData.type.toLowerCase() == 'email') {
      if (mergeData.data.to == null || mergeData.data.to == '') {
        throw new Error('Email merge "to" is null');
      }
      if (mergeData.data.subject == null || mergeData.data.subject == '') {
        throw new Error('Email merge "subject" is null');
      }
      if (mergeData.data.body == null || mergeData.data.body == '') {
        throw new Error('Email merge "body" is null');
      }
    }
    else if (mergeData.type.toLowerCase() == 'document') {
      if (mergeData.data.to == null || mergeData.data.to == '') {
        throw new Error('Document merge "to" is null');
      }
      if (mergeData.data.subject == null || mergeData.data.subject == '') {
        throw new Error('Document merge "subject" is null');
      }
      if (mergeData.data.documentID == null || mergeData.data.documentID == '') {
        throw new Error('Document merge "documentID" is null');
      }
    }
    else {
      throw new Error('MergeTemplate.mergeData.type is unknown type: ' + mergeData.type);
    }
  },

  /**
   * Validates the MergeRepeater attached to a given MergeTemplate. Note that this throws errors when the
   * MergeRepeater is malformed.
   *
   * @param {MergeTemplate} template The MergeTemplate that contains a MergeRepeater to test.
   */
  validateMergeRepeater: function(template) {
    if (template.mergeRepeater != null) {
      if (template.mergeRepeater.owner == null) {
        throw new Error('MergeTemplate.mergeRepeater.owner is null');
      }
      if (template.mergeRepeater.triggers == null || template.mergeRepeater.triggers.length === 0) {
        throw new Error('MergeTemplate.mergeRepeater.triggers is empty');
      }

      if (template.mergeRepeater.sheetID !== Utility.getSpreadsheet().getId()) {
        throw new Error('MergeTemplate.mergeRepeater.sheetID is invalid');
      }
    }
  },

  //***** private methods / utility methods *****//

  /**
   * Gets a row (as a Range) based upon a supplied id. This Range will contain a cell with the id of the MergeTemplate,
   * as well as the stringified MergeTemplate object.
   *
   * @param  {string} id The id of the MergeTemplate.
   * @return {Range} The Range of the MergeTemplate and it's id.
   */
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

  /**
   * Gets the sheet that contains Mailman's MergeTemplates.
   *
   * @return {Sheet} The Sheet that contains the MergeTemplates.
   */
  getTemplateSheet: function() {
    var ss = Utility.getSpreadsheet();
    return ss.getSheetByName(MergeTemplateService.SHEET_NAME);
  },

  /**
   * Appends a column to the given sheet at the given 1-based row index.
   *
   * @param  {string} sheetName The name of the sheet to append the column to.
   * @param  {number} rowNum The 1-based row index to add the header to.
   * @param  {string} name The name of the column.
   * @return {Range} The cell with the new column name.
   */
  appendColumn: function(sheetName, rowNum, name) {
    var ss = Utility.getSpreadsheet();
    var sheet = ss.getSheetByName(sheetName);
    var range = sheet.getDataRange();
    var headerRow = range.offset(rowNum - 1, 0, 1, range.getNumColumns());

    var newHeader = headerRow.offset(0, headerRow.getNumColumns(), 1, 1);
    newHeader.setValue(name);

    return newHeader;
  },


  /**
   * Renders a merge template for the given sheet and row
   * 
   * @param {string} templateId The id of the template to render
   * @param  {number} rowNum The 1-based row index to add the header to.   * 
   */
  renderTemplate: function(templateId, rowNum) {
    var template = MergeTemplateService.getByID(templateId);
    var mergeData = (template || {}).mergeData, data = (mergeData || {}).data;

    var context = RenderService.getContext(null, mergeData.headerRow, rowNum);
    var renderOptions = { context: context };

    var returnValue = {};
    returnValue.to = data.to ? RenderService.render(data.to, renderOptions) : null;
    returnValue.cc = data.cc ? RenderService.render(data.cc, renderOptions) : null;
    returnValue.bcc = data.bcc ? RenderService.render(data.bcc, renderOptions) : null;
    returnValue.subject = data.subject ? RenderService.render(data.subject, renderOptions) : null;
    returnValue.body = data.body ? RenderService.render(data.body, renderOptions) : null;
    
    return returnValue;
  }
};
