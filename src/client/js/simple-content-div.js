var $ = require('jquery');

// HTML Templates
var inputHTML = require('../html/input-content-div.html');
var textareaHTML = require('../html/textarea-content-div.html');

var Card = function(appendTo, type, options) {

  // *** LOCAL VARIABLES *** //
  var base;

  // *** CONSTRUCTOR *** //

  this.init = function(appendTo, type, options) {
    // Handle type
    if (type === Card.types.input) {
      base = $(inputHTML);
    }
    else if (type === Card.types.textarea) {
      base = $(textareaHTML);
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
    }

    appendTo.append(base);
    // MDL requires dynamically created components be registered. TODO force MDL to use browserify. Right now, componentHandler is just floating around in global.
    componentHandler.upgradeElement(base.find('.mdl-js-textfield')[0], 'MaterialTextfield');
  }



  // *** PUBLIC FUNCTIONS *** //

  this.show = function() {
    base.removeClass('hidden');
  };

  this.hide = function() {
    base.addClass('hidden');
  };

  this.getValue = function() {
    base.find('input').val();
  };

  this.setValue = function(value) {
    base.find('input').val(value);
  };

  this.setTitle = function(title) {
    base.find('h4').text(title);
  };

  this.setHelp = function(help) {
    base.find('p').text(help);
  };

  this.setLabel = function(label) {
    base.find('label').text(label);
  };



  // *** PRIVATE FUNCTIONS *** //

  this.init(appendTo, type, options);
}

// This is meant to be accessed statically.
Card.types = {
    input: 'input',
    textarea: 'textarea'
};

module.exports = Card;
