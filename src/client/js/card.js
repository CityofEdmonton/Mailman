
var baseHTML = require('../html/card-base.html');

var Card = function(appendTo, options) {
  // Private variables
  var self = this;
  var base = $(baseHTML); // TEST THE LOCAL BASE

  // Public Variables


  //***** Private Methods *****//


  //***** Privileged Methods *****//

  /**
   * Inserts HTML content at the given index.
   *
   * @param {string} content An HTML string to insert into the card.
   * @param {number} index The index to insert the content at.
   */
  this.insert = function(content, index) {
    if (index === 0) {
      base.prepend($(content));
    }
    else {
      $(content).insertBefore(base.children()[index]);
    }
  };

  /**
   * Appends content to the end of the base div (as the last child).
   *
   * @param {string} content An HTML string to append to base.
   */
  this.append = function(content) {
    base.append($(content));
  };

  /**
   * Shows the Card. Also triggers the event card.show.
   *
   */
  this.show = function() {
    if (base.hasClass('hidden') === true) {
      base.removeClass('hidden');
      base.trigger('card.show');
    }
  };

  /**
   * Hides the card. Also triggers the event card.hide.
   *
   */
  this.hide = function() {
    if (base.hasClass('hidden') === false) {
      base.addClass('hidden');
      base.trigger('card.hide');
    }
  };

  /**
   * Attaches an event handler to this card.
   *
   * @param {string} name The event to watch for.
   @ @param {function} toExecute The callback to execute when the event is fired.
   */
  this.attachEvent = function(name, toExecute) {
    base.on(name, toExecute);
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


/**
 *
 */
module.exports = Card;
