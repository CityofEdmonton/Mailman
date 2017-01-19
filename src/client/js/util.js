

/** */
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
