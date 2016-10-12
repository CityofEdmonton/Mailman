

/**
 *
 */
var Util = module.exports = function() {};

$.fn.extend({
  insertAtCaret: function(myValue) {
    var obj;
    console.log(this);
    if (typeof this[0].name != 'undefined') obj = this[0];
    else obj = this;

    var startPos = obj.selectionStart;
    var endPos = obj.selectionEnd;
    var scrollTop = obj.scrollTop;
    obj.value = obj.value.substring(0, startPos) + myValue + obj.value.substring(endPos, obj.value.length);
    obj.focus();
    obj.selectionStart = startPos + myValue.length;
    obj.selectionEnd = startPos + myValue.length;
    obj.scrollTop = scrollTop;
  }
});


/**
 * Resolves an issue with jQuery UI's autocomplete not resizing the DDL properly.
 * http://stackoverflow.com/questions/5643767/jquery-ui-autocomplete-width-not-set-correctly
 */
jQuery.ui.autocomplete.prototype._resizeMenu = function() {
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
