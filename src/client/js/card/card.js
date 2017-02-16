var baseHTML = require('./card-base.html');
var Util = require('../util.js');
var ID = require('../data/id.js');



/**
 * The Card forms an important base visual Object. It is used as a base for building other, more advanced Cards.
 *
 * @param {jquery} appendTo The div to append this Card to.
 * @param {Object} options The configuration Object for this Card.
 * @param {boolean} options.visible Whether to make the Card appear by default.
 * @param {Array<string>} options.paragraphs An array of strings to turn into paragraphs for this Card.
 */
var Card = function(appendTo, options) {
  // Private variables
  var self = this;

  // jquery objects
  var base = $(baseHTML);
  var menu; // This isn't created until the MDL component handler gets ahold of it.
  var button = base.find('[data-id="options-button"]');
  var myMenu = base.find('[data-id="card-list"]'); // This is the ul i created.

  //***** Private Methods *****//

  this.init_ = function(appendTo, options) {
    appendTo.append(base);

    var id = ID();
    button.attr('id', id);
    myMenu.attr('data-mdl-for', id);

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
          self.append('<p>' + data + '</p>');
          return true;
        });
      }
    }

    this.hide();
    componentHandler.upgradeElement(myMenu[0], 'MaterialMenu');
    menu = base.find('.mdl-menu__container');
  };

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
   * Removes this card.
   *
   */
  this.remove = function() {
    base.remove();
  };

  /**
   * Shows the Card. Also triggers the event card.show.
   *
   * @this Card
   */
  this.show = function() {
    if (!this.isShown()) {
      Util.setHidden(base, false);
      base.trigger('card.show', this);
    }
  };

  /**
   * Hides the card. Also triggers the event card.hide.
   *
   * @this Card
   */
  this.hide = function() {
    if (this.isShown()) {
      Util.setHidden(base, true);
      base.trigger('card.hide', this);
    }
  };

  /**
   * Determines whether the Card is visible or not.
   *
   * @return {Boolean} True for shown, false for hidden.
   */
  this.isShown = function() {
    return base.hasClass('hidden') === false;
  };

  /**
   * Attaches an event handler to this card.
   *
   * @param {string} name The event to watch for.
   * @param {function} toExecute The callback to execute when the event is fired.
   */
  this.attachEvent = function(name, toExecute) {
    base.on(name, toExecute);
  };

  /**
   * Adds an option to the Card. This can be used to trigger functions related to that Card.
   *
   * @param {String} title The text to be displayed in the menu.
   * @param {Function} callback The function to call when the menu item is clicked.
   * @param {String | undefined} icon The icon to display next to the title. Leave undefined for no icon.
   */
  this.addOption = function(title, callback, icon) {
    myMenu.append('<li class="mdl-menu__item">' + title + '</li>');

    var item = myMenu.children().filter(function() {
      return $(this).text() === title;
    });

    item.on('click', function() {
      callback();
      menu.removeClass('is-visible');
    });

    Util.setHidden(button, false);
  };

  /**
   * Removes an option from the Card.
   *
   * @param {String} title The title of the option to be displayed.
   */
  this.removeOption = function(title) {
    var item = myMenu.children().filter(function() {
      return $(this).text() === title;
    });

    item.off();
    item.remove();

    if (myMenu.children().length === 0) {
      Util.setHidden(button, true);
    }
  };

  this.init_(appendTo, options);
};


/** */
module.exports = Card;
