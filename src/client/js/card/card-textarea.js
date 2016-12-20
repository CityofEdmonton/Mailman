var TitledCard = require('./card-titled.js');
var textareaHTML = require('./card-textarea.html');



var TextareaCard = function(appendTo, options) {
  TitledCard.call(this, appendTo, options);

  // Private variables
  var self = this;
  var innerBase = $(textareaHTML);

  // Public Variables

  //***** Private Methods *****//
  /**
   * Gets the jQuery UI autocomplete config.
   *
   * @param {string} append The string to put after a selection is made.
   * @param {string} prepend The string to put before the selection.
   * @param {number} maxResults The maximum number of results displayed when filtering results.
   * @param {string} trigger A string to watch for that triggers selection.
   * @param {Array<string>} results The results to filter for autocomplete.
   * @return {object} A configuration object used by jQuery UI.
   */
  var getAutocompleteConfig = function(append, prepend, maxResults, trigger, results) {
    return {
      minLength: 0,
      source: function(request, response) {
        if (trigger === undefined) {
          response($.ui.autocomplete.filter(results, request.term.split(/,\s*/).pop()).slice(0, maxResults));
        }
        else {
          var last = request.term.split(trigger).pop();

          // Fixes weird bug that doesn't force the DDL to hide if you trigger it with nothing.
          if (trigger !== '' && request.term === '') {
            response('');
          }
          else {
            // delegate back to autocomplete, but extract the last term
            response($.ui.autocomplete.filter(results, last).slice(0, maxResults));
          }
        }
      },
      focus: function() {
        return false;
      },
      select: function(event, ui) {
        if (trigger === undefined) {
          var terms = this.value.split(/,\s*/);
          terms.pop();
          terms.push(prepend);
          terms.push(ui.item.value);
          terms.push(append);
          this.value = terms.join('');
        }
        else {
          var terms = [this.value.substring(0, this.value.lastIndexOf(trigger))];

          terms.push(prepend);
          terms.push(ui.item.value);
          terms.push(append);
          this.value = terms.join('');
        }

        // We have to manually mark the text field as dirty. If we don't, MDL text fields act weird.
        $(this).parent().addClass('is-dirty');

        return false;
      }
    };
  };


  //***** Privileged Methods *****//
  /**
   * Sets autocomplete bsaed upon some options.
   *
   * @param {object} options The options to set up autocomplete.
   */
  this.setAutocomplete = function(options) {
    var append = '';
    var prepend = '';
    var maxResults;
    var trigger;
    var results = [];
    var input = innerBase.find('textarea');

    if (options.trigger !== undefined) {
      trigger = options.trigger;
    }
    if (options.append !== undefined) {
      append = options.append;
    }
    if (options.prepend !== undefined) {
      prepend = options.prepend;
    }
    if (options.maxResults !== undefined) {
      maxResults = options.maxResults;
    }
    if (options.triggerOnFocus === true) {
      input.on('focus', function() {input.autocomplete('search', self.getValue())});
    }
    if (options.results !== undefined) {
      results = options.results;
    }

    input.autocomplete(getAutocompleteConfig(append, prepend, maxResults, trigger, results));
  };

  /**
   * Gets the value in the input.
   *
   * @return {string} The value in the input.
   */
  this.getValue = function() {
    return innerBase.find('textarea').val();
  };

  /**
   * Sets the value of the input.
   *
   * @param {string} value The value to set in the input.
   */
  this.setValue = function(value) {
    innerBase.find('textarea').val(value);
    innerBase.addClass('is-dirty');
  };

  /**
   * Sets the label shown in the input when nothing has been typed.
   *
   * @param {string} label The value to set as the label.
   */
  this.setLabel = function(label) {
    innerBase.find('label').text(label);
  };

  // constructor
  this.append(innerBase);

  if (options !== undefined) {
    if (options.label !== undefined) {
      this.setLabel(options.label);
    }
    if (options.autocomplete !== undefined) {
      this.setAutocomplete(options.autocomplete);
    }
  }

  componentHandler.upgradeElement(innerBase[0], 'MaterialTextfield');
};


/** */
TextareaCard.prototype.constructor = TextareaCard;
TextareaCard.prototype = Object.create(TitledCard.prototype);

//***** Public Methods *****//


/** */
module.exports = TextareaCard;
