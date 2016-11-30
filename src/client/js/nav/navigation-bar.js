
var html = require('./nav-bar.html');

var NavigationBar = function(appendTo, maxNavItems, onClick) {
  // Private variables
  var self = this;
  var base = $(html);
  var clickHandler = onClick;
  var maxItems = maxNavItems;

  // Public Variables

  /**
   *
   *
   * @constructor
   */
  this.init = function(appendTo) {
    appendTo.prepend(base);
  };

  //***** Private Methods *****//

  //***** Privileged Methods *****//
  this.buildNavTree = function(node) {
    base.empty();

    var current = node;
    for (var i = 0; i < maxItems; i++) {

      if (current !== null) {
        var newLink = $('<a>' + current.name + '</a>')
            .on('click', current, clickHandler);

        base.prepend(newLink)
            .prepend('&nbsp;&gt;&nbsp;');

        current = current.previous;
      }
    }
  };

  this.init(appendTo);
};

module.exports = NavigationBar;
