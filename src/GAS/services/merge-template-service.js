
function runAllMergeTemplates() {
  MergeTemplateService.runAll();
};


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

      rObj.templates.forEach(function(template) {
        MergeTemplateService.validate(template);
        MergeTemplateService.validateMergeRepeater(template);
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
   * - The triggerID this is called from matches the triggerIDs inside MergeRepeater. TODO
   *
   */
  runAll: function() {
    try {
      log('Running all merge templates.');

      var user = Session.getEffectiveUser().getEmail();
      var templates = MergeTemplateService.getAll().templates;
      log(templates);
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

      log(JSON.stringify(templates));

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
      log(e);
      throw(e);
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
   * @return {Object} See MergeRepeater for details on members.
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
   * Remove the MergeRepeater from this MergeTemplate. This doesn't save the Merge.
   *
   * @param {Object} template The Object that has the MergeRepeater removed.
   * @return {Object} The Object that no longer has the MergeRepeater attached.
   */
  removeRepeatMerge: function(template) {
    try {
      var ss = Utility.getSpreadsheet();

      template.mergeRepeater = undefined;
      return template;
    }
    catch (e) {
      log(e);
      throw e;
    }
  },

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
   * Validates the correctness of a MergeTemplate.
   *
   * @param  {Object} template A simple config Object representing a MergeTemplate.
   */
  validate: function(template) {
    if (template == null) {
      throw new Error('MergeTemplate is null');
    }
    if (template.mergeData == null) {
      throw new Error('MergeTemplate.mergeData is null');
    }
    if (template.mergeData.type == null) {
      throw new Error('MergeTemplate.mergeData.type is null');
    }
    if (template.mergeData.data == null) {
      throw new Error('MergeTemplate.mergeData.data is null');
    }
    if (template.mergeData.sheet == null) {
      throw new Error('MergeTemplate.mergeData.sheet is null');
    }
    if (template.mergeData.title == null) {
      throw new Error('MergeTemplate.mergeData.title is null');
    }
    if (template.mergeData.headerRow == null) {
      throw new Error('MergeTemplate.mergeData.headerRow is null');
    }
    if (template.mergeData.timestampColumn == null) {
      throw new Error('MergeTemplate.mergeData.timestampColumn is null');
    }
  },

  validateMergeRepeater: function(template) {
    if (template.mergeRepeater != null) {
      if (template.mergeRepeater.owner == null) {
        throw new Error('MergeTemplate.mergeRepeater.owner is null');
      }
      if (template.mergeRepeater.triggers == null || template.mergeRepeater.triggers.length === 0) {
        throw new Error('MergeTemplate.mergeRepeater.triggers is empty');
      }

      log('SheetID: ' + Utility.getSpreadsheet().getId());
      log(template.mergeRepeater.sheetID);
      if (template.mergeRepeater.sheetID !== Utility.getSpreadsheet().getId()) {
        log('Invalid sheet: removing MergeRepeater.'); // TODO use the function for this.
        template.mergeRepeater = null;
        MergeTemplateService.update(template);
      }
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
    var ss = Utility.getSpreadsheet();
    return ss.getSheetByName(MergeTemplateService.SHEET_NAME);
  },

  appendColumn: function(sheetName, rowNum, name) {
    var ss = Utility.getSpreadsheet();
    var sheet = ss.getSheetByName(sheetName);
    var range = sheet.getDataRange();
    var headerRow = range.offset(rowNum - 1, 0, 1, range.getNumColumns());

    var newHeader = headerRow.offset(0, headerRow.getNumColumns(), 1, 1);
    newHeader.setValue(name);

    return newHeader;
  },

  validateTriggers_: function(triggers) {
    // Get a list of valid triggers.
    var user = Session.getEffectiveUser().getEmail();

    // We need to filter out all the other users repeats.
    var repeaters = MergeTemplateService.getMergeRepeaters_();
    repeaters = repeaters.filter(function(rep) {
      rep.owner === user;
    });

    // If this trigger has no repeaters, then we don't need it any more, so delete it.
    triggers.forEach(function(trigger) {
      var id = trigger.getUniqueId();

      // True if none of the repeaters have a reference to this trigger.
      var isUseless = repeaters.every(function(rep) {
        return rep.triggers.indexOf(id) === -1;
      });

      if (isUseless) {
        log('Deleting trigger: ' + id);
        ScriptApp.deleteTrigger(trigger);
      }
    });
  },

  /**
   * This function returns an Array of trigger IDs. This function has some major side effects.
   * 1. This function removes the MergeRepeaters that reference triggers that don't exist. This occurs when a sheet
   * is copied.
   * 2. This function also deletes any triggers that don't have a related MergeRepeater.
   *
   *
   *
   * @return {[type]} [description]
   */
  getActiveTriggers_: function() {
    var ss = Utility.getSpreadsheet();
    var triggers = ScriptApp.getUserTriggers(ss);

    var actualTriggerIDs = [];
    triggers.forEach(function(trigger) {
      actualTriggerIDs.push(trigger.getUniqueId());
    })

    var repeaters = MergeTemplateService.getMergeRepeaters_();
    repeaters = repeaters.filter(function(rep) {
      rep.owner === user;
    });

    // Consider deleting old triggers?

    var triggerIDs = [];

    repeaters.forEach(function(repeater) {
      repeater.triggers.forEach(function(triggerID) {
        if (triggerIDs.indexOf(triggerID) === -1) {
          triggerIDs.push(triggerID);
        }
      });
    })

  }


};
