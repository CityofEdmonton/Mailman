var $ = require('jquery');

// HTML Templates
var inputHTML = require('../html/input-content-div.html');
var textareaHTML = require('../html/textarea-content-div.html');
var infoHTML = require('../html/info-content-div.html');

var Card = function(appendTo, type, options) {

  // *** LOCAL VARIABLES *** //
  var base;
  var self;

  // *** CONSTRUCTOR *** //

  this.init = function(appendTo, type, options) {
    var self = this;

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
        })
      }
    }

    appendTo.append(base);
    // MDL requires dynamically created components be registered. TODO force MDL to use browserify. Right now, componentHandler is just floating around in global.
    if (type !== Card.types.INFO) {
      componentHandler.upgradeElement(base.find('.mdl-js-textfield')[0], 'MaterialTextfield');
    }

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
    base.find('.help').text(help);
  };

  this.setLabel = function(label) {
    base.find('label').text(label);
  };

  this.addParagraph = function(content) {
    var para = $('<p>' + content + '</p>');
    base.append(para);
  }

  // *** PRIVATE FUNCTIONS *** //

  this.init(appendTo, type, options);
}

// This is meant to be accessed statically.
Card.types = {
    INPUT: 'input',
    TEXTAREA: 'textarea',
    INFO: 'info'
};

module.exports = Card;
