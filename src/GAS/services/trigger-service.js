/**
 * @file A service focused on handling triggers.
 * @author {@link https://github.com/j-rewerts|Jared Rewerts}

 */

/**
 * This service is meant for handling triggers that run MergeTemplates repeatedly.
 *
 * @type {Object}
 */
var TriggerService = {

  /**
   * Gets a Trigger based upon an id. Returns undefined if it doesn't exist.
   *
   * @param  {string} id The id of the Trigger to return.
   * @return {Trigger} The Trigger with the specified id.
   */
  getTriggerByID: function(id) {
    var ss = Utility.getSpreadsheet();
    var triggers = ScriptApp.getUserTriggers(ss);
    var trigger;

    triggers.forEach(function(element) {
      if (element.getUniqueId() === id) {
        trigger = element;
      }
    });

    return trigger;
  },

  /**
   * Gets an Array of triggers based upon their handler function. Returns an empty Array if the handler can't be found.
   * NOTE Untested.
   *
   * @param  {string} handler The string name of the function to call.
   * @return {Array<Trigger>} All of the Triggers that call handler.
   */
  getTriggerByFunction: function(handler) {
    var ss = Utility.getSpreadsheet();
    var allTriggers = ScriptApp.getUserTriggers(ss);

    var triggers = [];
    allTriggers.forEach(function(element) {
      if (element.getHandlerFunction() === handler) {
        triggers.push(element);
      }
    });

    return triggers;
  },

  /**
   * Gets the trigger by type. In add ons, it's only possible to have 1 trigger per type.
   *
   * @param  {EventType} type The type of the trigger to return. Found here:
   * https://developers.google.com/apps-script/reference/script/event-type
   * @return {Trigger|undefined} The trigger of the given type.
   */
  getTriggerByEventType: function(type) {
    var ss = Utility.getSpreadsheet();
    var allTriggers = ScriptApp.getUserTriggers(ss);
    var trigger;

    allTriggers.forEach(function(element) {
      if (element.getEventType() === type) {
        trigger = element;
      }
    });

    return trigger;
  },

  /**
   * Handles the creation of all needed triggers. If they already exist, just grab the ids and return those.
   * Currently, there are 2 triggers: A time based trigger that runs hourly and a form submit trigger.
   *
   * @return {Array<string>} An array of all the trigger ids.
   */
  createTriggers: function(trigger_name) {
    var handler = 'runAllMergeTemplates';
    var triggers = [];

    if (trigger_name=="auto"){
      var trigger = TriggerService.getTriggerByEventType(ScriptApp.EventType.CLOCK);
      if (trigger == null) {
        logger.info('Creating hourly trigger, with {TriggerName}', trigger_name);

        triggers.push(TriggerService.createTimeBasedTrigger_(handler).getUniqueId());
      }
      else {
        triggers.push(trigger.getUniqueId());
      }
    }

    else if (trigger_name=="onform")
    {
      handler = 'runOnFormSubmitTemplates';
      var trigger = TriggerService.getTriggerByEventType(ScriptApp.EventType.ON_FORM_SUBMIT);
      if (trigger == null) {
        logger.info('Creating OnForm trigger, with {TriggerName}', trigger_name);

        triggers.push(TriggerService.createFormTrigger_(handler).getUniqueId());
      }
      else {
        triggers.push(trigger.getUniqueId());
      }
    }
    // TODO add for form trigger

    return triggers;
  },

  deleteUnusedTriggers: function() {
    var ss = Utility.getSpreadsheet();
    var allTriggers = ScriptApp.getUserTriggers(ss);

    var repeaters = MergeTemplateService.getMergeRepeaters();

    allTriggers.forEach(function(trigger) {
      if (!TriggerService.triggerExistsInRepeaters_(trigger, repeaters)) {
        logger.info('Deleting trigger {TriggerId}', trigger.getUniqueId());
        ScriptApp.deleteTrigger(trigger);
      }
    });
  },

  //*** Private functions ***//

  createTimeBasedTrigger_: function(handler) {
    logger.info('Creating CLOCK trigger');
    return ScriptApp.newTrigger(handler)
      .timeBased()
      .everyHours(1)
      .create();
  },

  createFormTrigger_: function(handler) {
    logger.info('Creating ON_FORM_SUBMIT trigger');
    var ss = Utility.getSpreadsheet();
    return ScriptApp.newTrigger(handler)
      .forSpreadsheet(ss)
      .onFormSubmit()
      .create();
  },

  triggerExistsInRepeaters_: function(trigger, repeaters) {
    var id = trigger.getUniqueId();

    for (var i = 0; i < repeaters.length; i++) {
      for (var j = 0; j < repeaters[i].triggers.length; j++) {
        if (id === repeaters[i].triggers[j]) {
          return true;
        }
      }
    }

    return false;
  }
};
