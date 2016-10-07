
var baseHTML = require('../html/card-base.html');

var Card = function(appendTo, options) {
  // Private variables
  var self = this;
  var base = $(baseHTML); // TEST THE LOCAL BASE

  // Public Variables


  //***** Private Methods *****//


  //***** Privileged Methods *****//

  this.insert = function(content, index) {
    if (index === 0) {
      base.prepend($(content));
    }
    else {
      $(content).insertBefore(base.children()[index]);
    }
  };

  this.show = function() {
    if (base.hasClass('hidden') === true) {
      base.removeClass('hidden');
      base.trigger('card.show');
    }
  };

  this.hide = function() {
    if (base.hasClass('hidden') === false) {
      base.addClass('hidden');
      base.trigger('card.hide');
    }
  };

  this.addParagraph = function(content) {
    var para = $('<p>' + content + '</p>');
    base.append(para);
  };

  this.attachEvent = function(name, toExecute) {
    base.on(name, toExecute);
  };

  this.append = function(content) {
    base.append($(content));
  };

  // constructor
  appendTo.append(base);

  if (options !== undefined) {
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
  }
};

//***** Public Methods *****//





module.exports = Card;
