
var baseHTML = require('./card-base.html');

var Card = function(appendTo, options) {
  // Private variables
  var self = this;
  var base = $(baseHTML);

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
    if (base.hasClass('hidden') === true) {
      base.removeClass('hidden');
      base.trigger('card.show', this);
    }
  };

  /**
   * Hides the card. Also triggers the event card.hide.
   *
   * @this Card
   */
  this.hide = function() {
    if (base.hasClass('hidden') === false) {
      base.addClass('hidden');
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
    var menu = base.find('ul');
    menu.append('<li class="mdl-menu__item">' + title + '</li>');

    var item = menu.children().filter(function() {
      return $(this).text() === title;
    });

    item.on('click', callback);

    var button = base.find('button');
    button.removeClass('hidden');
  };

  /**
   * Removes an option from the Card.
   *
   * @param {String} title The title of the option to be displayed.
   */
  this.removeOption = function(title) {
    var menu = base.find('ul');

    var item = menu.children().filter(function() {
      return $(this).text() === title;
    });

    item.off();
    item.remove();

    if (menu.children().length === 0) {
      var button = base.find('button');
      button.addClass('hidden');
    }
  };

  // constructor
  appendTo.append(base);

  // Create a unique ID for binding the menu to the button.
  // From here: https://gist.github.com/gordonbrander/2230317
  var id = 'UID_' + Math.random().toString(36).substr(2, 9);
  var menu = base.find('ul');
  var button = base.find('button');

  button.attr('id', id);
  menu.attr('data-mdl-for', id);

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
  componentHandler.upgradeElement(base.find('.mdl-js-menu')[0], 'MaterialMenu');
};

//***** Public Methods *****//


/** */
module.exports = Card;
