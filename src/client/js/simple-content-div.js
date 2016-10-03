

// HTML Templates
var inputHTML = require('../html/input-content-div.html');
var textareaHTML = require('../html/textarea-content-div.html');
var infoHTML = require('../html/info-content-div.html');

var Card = function(appendTo, type, options) {

  //***** LOCAL VARIABLES *****//

  var base;
  var self;
  var type;

  //***** CONSTRUCTOR *****//

  this.init = function(appendTo, type, options) {
    var type = type;
    self = this;

    // Handle type
    if (type === Card.types.INPUT) {
      base = $(inputHTML);
    }
    else if (type === Card.types.TEXTAREA) {
      base = $(textareaHTML);
    }
    else if (type === Card.types.INFO) {
      base = $(infoHTML);
    }
    else {
      throw new Error('type must be one of ' + JSON.stringify(Card.types));
    }

    // Handle options
    if (options !== undefined) {
      if (options.title !== undefined) {
        this.setTitle(options.title);
      }
      if (options.help !== undefined) {
        this.setHelp(options.help);
      }
      if (options.label !== undefined) {
        this.setLabel(options.label);
      }
      if (options.visible !== undefined) {
        if (options.visible === true) {
          this.show();
        }
        else {
          this.hide();
        }
      }
      if (options.paragraphs !== undefined) {
        options.paragraphs.every(function(data) {
          self.addParagraph(data);
          return true;
        });
      }
      if (options.autocomplete !== undefined) {
        var trigger;
        var append = '';
        var prepend = '';
        var maxResults;
        var results = [];
        var input;

        if (type === Card.types.INPUT) {
          input = base.find('input');
        }
        else if (type === Card.types.TEXTAREA) {
          input = base.find('textarea');
        }
        else {
          throw new Error('Card type ' + type + ' doesn\'t support autocomplete.');
        }

        if (options.autocomplete.trigger !== undefined) {
          trigger = options.autocomplete.trigger;
        }
        if (options.autocomplete.append !== undefined) {
          append = options.autocomplete.append;
        }
        if (options.autocomplete.prepend !== undefined) {
          prepend = options.autocomplete.prepend;
        }
        if (options.autocomplete.maxResults !== undefined) {
          maxResults = options.autocomplete.maxResults;
        }
        if (options.autocomplete.triggerOnFocus === true) {
          input.on('focus', function() {input.autocomplete('search', self.getValue())});
        }
        if (options.autocomplete.results !== undefined) {
          results = options.autocomplete.results;
        }

        input.autocomplete(getAutocompleteConfig(results, trigger, append, prepend, maxResults));
      }
    }

    appendTo.append(base);
    // MDL requires dynamically created components be registered.
    // TODO force MDL to use browserify. Right now, componentHandler is just floating around in global.
    if (type !== Card.types.INFO) {
      componentHandler.upgradeElement(base.find('.mdl-js-textfield')[0], 'MaterialTextfield');
    }
  };

  //***** PUBLIC FUNCTIONS *****//

  this.show = function() {
    base.removeClass('hidden');
  };

  this.hide = function() {
    base.addClass('hidden');
  };

  this.getValue = function() {
    if (type === Card.types.INPUT) {
      return base.find('input').val();
    }
    else if (type === Card.types.TEXTAREA) {
      return base.find('textarea').val();
    }

    return null;
  };

  this.setValue = function(value) {
    base.find('input').val(value);
  };

  this.setTitle = function(title) {
    base.find('h4').text(title);
  };

  this.setHelp = function(help) {
    base.find('.help').text(help);
  };

  this.setLabel = function(label) {
    base.find('label').text(label);
  };

  this.addParagraph = function(content) {
    var para = $('<p>' + content + '</p>');
    base.append(para);
  };

  //***** PRIVATE FUNCTIONS *****//

  var getAutocompleteConfig = function(results, trigger, append, prepend, maxResults) {
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
        // prevent value inserted on focus
        return false;
      },
      select: function(event, ui) {
        if (trigger === undefined) {
          var terms = this.value.split(/,\s*/);
          // remove the current input
          terms.pop();

          // Prepend the value if needed.
          terms.push(prepend);

          // add the selected item
          terms.push(ui.item.value);
          // add placeholder to get the comma-and-space at the end
          terms.push(append);
          this.value = terms.join('');
        }
        else {
          var terms = [this.value.substring(0, this.value.lastIndexOf(trigger))];

          terms.push(prepend);

          // add the selected item
          terms.push(ui.item.value);
          // add placeholder to get the comma-and-space at the end
          terms.push(append);

          this.value = terms.join('');
        }

        // We have to manually mark the text field as dirty. If we don't, MDL text fields act weird.
        $(this).parent().addClass('is-dirty');

        return false;
      }
    };
  };

  // Call the constructor
  this.init(appendTo, type, options);
};


/**
 * This is meant to be accessed statically.
 */
Card.types = {
  INPUT: 'input',
  TEXTAREA: 'textarea',
  INFO: 'info'
};


/**
 *
 */
module.exports = Card;
