
var mergeHandler

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

    return triggers.find(function(element) {
      return element.getUniqueId() === id;
    });
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

    return allTriggers.find(function(element) {
      return element.getEventType() === type;
    });
  },

  /**
   * Handles the creation of all needed triggers. If they already exist, just grab the ids and return those.
   * Currently, there are 2 triggers: A time based trigger that runs hourly and a form submit trigger.
   *
   * @return {Array<string>} An array of all the trigger ids.
   */
  createTriggers: function() {
    var handler = 'runAllMergeTemplates';
    var triggers = [];

    var trigger = TriggerService.getTriggerByEventType(ScriptApp.EventType.CLOCK);
    if (trigger == null) {
      triggers.push(TriggerService.createTimeBasedTrigger_(handler).getUniqueId());
    }
    else {
      triggers.push(trigger.getUniqueId());
    }

    // TODO add for form trigger

    return triggers;
  },

  //*** Private functions ***//

  createTimeBasedTrigger_: function(handler) {
    log('Creating CLOCK trigger.');
    return ScriptApp.newTrigger(handler)
      .timeBased()
      .everyHours(1)
      .create();
  },

  createFormTrigger_: function(handler) {
    log('Creating ON_FORM_SUBMIT trigger.');
    var ss = Utility.getSpreadsheet();

    return ScriptApp.newTrigger(handler)
      .forSpreadsheet(ss)
      .onFormSubmit()
      .create();
  }
};
