var TitledCard = require('./card-titled.js');
var inputHTML = require('../html/card-input.html');



var InputCard = function(appendTo, options) {
  TitledCard.call(this, appendTo, options);

  // Private variables
  var self = this;
  var innerBase = $(inputHTML);

  // Public Variables



  //***** Private Methods *****//
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
  this.setAutocomplete = function(options) {
    var append = '';
    var prepend = '';
    var maxResults;
    var trigger;
    var results = [];
    var input = innerBase.find('input');

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

  this.getValue = function() {
    return innerBase.find('input').val();
  };

  this.setValue = function(value) {
    innerBase.find('input').val(value);
  };

  this.setLabel = function(label) {
    innerBase.find('label').text(label);
  };


  // constructor
  this.append(innerBase);

  if (options !== undefined) {
    if (options.label !== undefined) {
      this.setLabel(options.label);
    }
    if(options.autocomplete !== undefined) {
      this.setAutocomplete(options.autocomplete);
    }
  }

  componentHandler.upgradeElement(innerBase.find('.mdl-js-textfield')[0], 'MaterialTextfield'); //TODO Could be source of error
};
InputCard.prototype = Object.create(TitledCard.prototype);
InputCard.prototype.constructor = InputCard;

//***** Public Methods *****//


module.exports = InputCard;
