var $ = require('jquery');

// HTML Templates
var inputHTML = require('../html/input-content-div.html');
var textareaHTML = require('../html/textarea-content-div.html');

var Card = function(type, appendTo) {

  // *** LOCAL VARIABLES *** //


  // *** CONSTRUCTOR *** //
  var base = $(textareaHTML);
  appendTo.append(base);

  // *** PUBLIC FUNCTIONS *** //
  this.show = function() {
    base.removeClass('hidden');
  };

  this.hide = function() {
    base.addClass('hidden');
  };

  this.getValue = function() {
    base.children('input').val();
  }

  // *** PRIVATE FUNCTIONS *** //


}

module.exports = Card;
