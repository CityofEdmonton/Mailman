

var Util = module.exports = function() {};


$.fn.extend({
  insertAtCaret: function(myValue) {
    var obj;
    if (typeof this[0].name != 'undefined') {
      obj = this[0];
    }
    else {
      obj = this;
    }

    var startPos = obj.selectionStart;
    var endPos = obj.selectionEnd;
    var scrollTop = obj.scrollTop;
    obj.value = obj.value.substring(0, startPos) + myValue + obj.value.substring(endPos, obj.value.length);
    obj.focus();
    obj.selectionStart = startPos + myValue.length;
    obj.selectionEnd = startPos + myValue.length;
    obj.scrollTop = scrollTop;
  },
  actual : function ( method, options ){
    // From https://github.com/dreamerslab/jquery.actual/blob/master/jquery.actual.js
    // check if the jQuery method exist
    if (!this[method]) {
      throw '$.actual => The jQuery method "' + method + '" you called does not exist';
    }

    var defaults = {
      absolute      : false,
      clone         : false,
      includeMargin : false,
      display       : 'block'
    };

    var configs = $.extend(defaults, options);

    var $target = this.eq(0);
    var fix, restore;

    if (configs.clone === true) {
      fix = function() {
        var style = 'position: absolute !important; top: -1000 !important; ';

        // this is useful with css3pie
        $target = $target
        .clone()
        .attr('style', style)
        .appendTo('body');
      };

      restore = function() {
        // remove DOM element after getting the width
        $target.remove();
      };
    }
    else {
      var tmp = [];
      var style = '';
      var $hidden;

      fix = function() {
        // get all hidden parents
        $hidden = $target.parents().addBack().filter(':hidden');
        style += 'visibility: hidden !important; display: ' + configs.display + ' !important; ';

        if (configs.absolute === true) {
          style += 'position: absolute !important; ';
        }

        // save the origin style props
        // set the hidden el css to be got the actual value later
        $hidden.each(function() {
          // Save original style. If no style was set, attr() returns undefined
          var $this = $(this);
          var thisStyle = $this.attr('style');

          tmp.push(thisStyle);
          // Retain as much of the original style as possible, if there is one
          $this.attr('style', thisStyle ? thisStyle + ';' + style : style);
        });
      };

      restore = function() {
        // restore origin style values
        $hidden.each(function(i) {
          var $this = $(this);
          var _tmp = tmp[i];

          if(_tmp === undefined) {
            $this.removeAttr('style');
          }
          else {
            $this.attr('style', _tmp);
          }
        });
      };
    }

    fix();
    // get the actual value with user specific methed
    // it can be 'width', 'height', 'outerWidth', 'innerWidth'... etc
    // configs.includeMargin only works for 'outerWidth' and 'outerHeight'
    var actual = /(outer)/.test(method) ?
    $target[method](configs.includeMargin) :
    $target[method]();

    restore();
    // IMPORTANT, this plugin only return the value of the first element
    return actual;
  }
});



/**
* Resolves an issue with jQuery UI's autocomplete not resizing the DDL properly.
* http://stackoverflow.com/questions/5643767/jquery-ui-autocomplete-width-not-set-correctly
*/
$.ui.autocomplete.prototype._resizeMenu = function() {
  var ul = this.menu.element;
  ul.outerWidth(this.element.outerWidth());
};


/**
* Reverses the properties in a JavaScript object.
* Found here:
*http://stackoverflow.com/questions/10974493/javascript-quickly-lookup-value-in-object-like-we-can-with-properties
*
* @param {object} map The object that we are interested in flipping.
* @return {object} An object with all keys and values swapped.
*/
Util.reverseObject = function(map) {
  var reverseMap = {};

  for (j in map) {
    if (Object.prototype.hasOwnProperty.call(map, j)) {
      reverseMap[map[j]] = j;
    }
  }

  return reverseMap;
};


/**
* A generic UI element hider. Removes the object from the flow of the document.
*
* @param {jquery} object The object to apply the change to.
* @param {boolean} state True for display:none, false for default.
*/
Util.setHidden = function(object, state) {
  if (state) {
    object.addClass('hidden');
  }
  else {
    object.removeClass('hidden');
  }
};


/**
* A generic UI element hider. Doesn't remove the object from the flow of the document.
*
* @param {jquery} object The object to apply the change to.
* @param {boolean} state True for visible, false for invisible.
*/
Util.setVisibility = function(object, state) {
  if (state) {
    object.removeClass('invisible');
  }
  else {
    object.addClass('invisible');
  }
};


// From https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Object/assign#Polyfill
if (typeof Object.assign != 'function') {
  Object.assign = function(target, varArgs) { // .length of function is 2
    'use strict';
    if (target == null) { // TypeError if undefined or null
      throw new TypeError('Cannot convert undefined or null to object');
    }

    var to = Object(target);

    for (var index = 1; index < arguments.length; index++) {
      var nextSource = arguments[index];

      if (nextSource != null) { // Skip over if undefined or null
        for (var nextKey in nextSource) {
          // Avoid bugs when hasOwnProperty is shadowed
          if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
            to[nextKey] = nextSource[nextKey];
          }
        }
      }
    }
    return to;
  };
}
