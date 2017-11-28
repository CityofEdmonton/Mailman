// inspired by the builtin contextmenu plugin
// and the mention plugin (https://github.com/StevenDevooght/tinyMCE-suggestion/blob/master/suggestion/plugin.js), 
// modified for use with MailMan

//var serviceFactory = new (require('../../../ServiceFactory'))();
//var AutocompleteConfig = require('../../../card/autocomplete-config.js');


(function () {
  
  var defs = {}; // id -> {dependencies, definition, instance (possibly undefined)}
  
  // Used when there is no 'main' module.
  // The name is probably (hopefully) unique so minification removes for releases.
  var register_3795 = function (id) {
    var module = dem(id);
    var fragments = id.split('.');
    var target = Function('return this;')();
    for (var i = 0; i < fragments.length - 1; ++i) {
      if (target[fragments[i]] === undefined)
        target[fragments[i]] = {};
      target = target[fragments[i]];
    }
    target[fragments[fragments.length - 1]] = module;
  };
  
  var instantiate = function (id) {
    var actual = defs[id];
    var dependencies = actual.deps;
    var definition = actual.defn;
    var len = dependencies.length;
    var instances = new Array(len);
    for (var i = 0; i < len; ++i)
      instances[i] = dem(dependencies[i]);
    var defResult = definition.apply(null, instances);
    if (defResult === undefined)
       throw 'module [' + id + '] returned undefined';
    actual.instance = defResult;
  };
  
  var def = function (id, dependencies, definition) {
    if (typeof id !== 'string')
      throw 'module id must be a string';
    else if (dependencies === undefined)
      throw 'no dependencies for ' + id;
    else if (definition === undefined)
      throw 'no definition function for ' + id;
    defs[id] = {
      deps: dependencies,
      defn: definition,
      instance: undefined
    };
  };
  
  var dem = function (id) {
    var actual = defs[id];
    if (actual === undefined)
      throw 'module [' + id + '] was undefined';
    else if (actual.instance === undefined)
      instantiate(id);
    return actual.instance;
  };
  
  var req = function (ids, callback) {
    var len = ids.length;
    var instances = new Array(len);
    for (var i = 0; i < len; ++i)
      instances[i] = dem(ids[i]);
    callback.apply(null, instances);
  };
  
  var ephox = {};
  
  ephox.bolt = {
    module: {
      api: {
        define: def,
        require: req,
        demand: dem
      }
    }
  };
  
  var define = def;
  var require = req;
  var demand = dem;
  // this helps with minification when using a lot of global references
  var defineGlobal = function (id, ref) {
    define(id, [], function () { return ref; });
  };
  /*jsc
  ["tinymce.plugins.suggestion.Plugin","ephox.katamari.api.Cell","tinymce.core.PluginManager","tinymce.plugins.suggestion.api.Commands","tinymce.plugins.suggestion.ui.Buttons","global!tinymce.util.Tools.resolve","tinymce.plugins.suggestion.ui.Dialog","tinymce.core.Env","tinymce.core.util.Tools","tinymce.plugins.suggestion.api.Settings","tinymce.plugins.suggestion.ui.IframeContent"]
  jsc*/
  define(
    'ephox.katamari.api.Cell',
  
    [
    ],
  
    function () {
      var Cell = function (initial) {
        var value = initial;
  
        var get = function () {
          return value;
        };
  
        var set = function (v) {
          value = v;
        };
  
        var clone = function () {
          return Cell(get());
        };
  
        return {
          get: get,
          set: set,
          clone: clone
        };
      };
  
      return Cell;
    }
  );  
  defineGlobal("global!tinymce.util.Tools.resolve", tinymce.util.Tools.resolve);

  
  // /**
  //  * Settings.js
  //  *
  //  * Released under LGPL License.
  //  * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
  //  *
  //  * License: http://www.tinymce.com/license
  //  * Contributing: http://www.tinymce.com/contributing
  //  */
  
  // define(
  //   'tinymce.plugins.suggestion.api.Settings',
  //   [
  //   ],
  //   function () {
  //   //   var getPreviewDialogWidth = function (editor) {
  //   //     return parseInt(editor.getParam('plugin_preview_width', '650'), 10);
  //   //   };
  
  //   //   var getPreviewDialogHeight = function (editor) {
  //   //     return parseInt(editor.getParam('plugin_preview_height', '500'), 10);
  //   //   };
  
  //   //   var getContentStyle = function (editor) {
  //   //     return editor.getParam('content_style', '');
  //   //   };
  
  //     return {
  //       // getPreviewDialogWidth: getPreviewDialogWidth,
  //       // getPreviewDialogHeight: getPreviewDialogHeight,
  //       // getContentStyle: getContentStyle
  //     };
  //   }
  // );
// /**
//  * Events.js
//  *
//  * Released under LGPL License.
//  * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
//  *
//  * License: http://www.tinymce.com/license
//  * Contributing: http://www.tinymce.com/contributing
//  */

// define(
// 'tinymce.plugins.suggestion.api.Events',
// [
// ],
// function () {
//   var firesuggestionOpening = function (editor, state) {
//     editor.fire('suggestionOpening', { state: state });
//   };

//   return {
//     firesuggestionOpening: firesuggestionOpening
//   };
// });

  // /**
  //  * Commands.js
  //  *
  //  * Released under LGPL License.
  //  * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
  //  *
  //  * License: http://www.tinymce.com/license
  //  * Contributing: http://www.tinymce.com/contributing
  //  */
  
  // define(
  //   'tinymce.plugins.suggestion.api.Commands',
  //   [
  //     //'tinymce.plugins.suggestion.ui.Dialog'
  //   ],
  //   function (Dialog) {
  //     var register = function (editor) {
  //       // editor.addCommand('mcePreview', function () {
  //       //   Dialog.open(editor);
  //       // });
  //     };
  
  //     return {
  //       register: register
  //     };
  //   }
  // );
  // /**
  //  * Buttons.js
  //  *
  //  * Released under LGPL License.
  //  * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
  //  *
  //  * License: http://www.tinymce.com/license
  //  * Contributing: http://www.tinymce.com/contributing
  //  */
  
  // define(
  //   'tinymce.plugins.suggestion.ui.Buttons',
  //   [
  //   ],
  //   function () {
  //     var register = function (editor) {
  //       editor.addButton('suggestion', {
  //         title: 'Tags',
  //         cmd: 'mcesuggestion'
  //       });
  
  //       editor.addMenuItem('preview', {
  //         text: 'Tags',
  //         cmd: 'mcesuggestion',
  //         context: 'view'
  //       });
  //     };
  
  //     return {
  //       register: register
  //     };
  //   }
  // );

  // define('tinymce.plugins.suggestion.ui.autocomplete',
  //   [

  //   ],
  //   function() {
  //     var AutoComplete = function(ed, options) {
  //       this.editor = ed;
        
  //       this.options = $.extend({}, {
  //           source: [],
  //           delay: 500,
  //           queryBy: 'name',
  //           items: 10
  //       }, options);

  //       this.options.insertFrom = this.options.insertFrom || this.options.queryBy;

  //       this.matcher = this.options.matcher || this.matcher;
  //       this.sorter = this.options.sorter || this.sorter;
  //       this.renderDropdown = this.options.renderDropdown || this.renderDropdown;
  //       this.render = this.options.render || this.render;
  //       this.insert = this.options.insert || this.insert;
  //       this.highlighter = this.options.highlighter || this.highlighter;

  //       this.query = '';
  //       this.hasFocus = true;

  //       this.renderInput();

  //       this.bindEvents();
  //     };

  //     AutoComplete.prototype = {
        
  //       constructor: AutoComplete,

  //       renderInput: function () {
  //           var rawHtml =  '<span id="autocomplete">' +
  //                               '<span id="autocomplete-delimiter">' + this.options.lastKeyPressed + '</span>' +
  //                               '<span id="autocomplete-searchtext"><span class="dummy">\uFEFF</span></span>' +
  //                           '</span>';

  //           this.editor.execCommand('mceInsertContent', false, rawHtml);
  //           this.editor.focus();
  //           this.editor.selection.select(this.editor.selection.dom.select('span#autocomplete-searchtext span')[0]);
  //           this.editor.selection.collapse(0);
  //       },

  //       bindEvents: function () {
  //           this.editor.on('keyup', this.editorKeyUpProxy = $.proxy(this.rteKeyUp, this));
  //           this.editor.on('keydown', this.editorKeyDownProxy = $.proxy(this.rteKeyDown, this), true);
  //           this.editor.on('click', this.editorClickProxy = $.proxy(this.rteClicked, this));

  //           $('body').on('click', this.bodyClickProxy = $.proxy(this.rteLostFocus, this));

  //           $(this.editor.getWin()).on('scroll', this.rteScroll = $.proxy(function () { this.cleanUp(true); }, this));
  //       },

  //       unbindEvents: function () {
  //           this.editor.off('keyup', this.editorKeyUpProxy);
  //           this.editor.off('keydown', this.editorKeyDownProxy);
  //           this.editor.off('click', this.editorClickProxy);

  //           $('body').off('click', this.bodyClickProxy);

  //           $(this.editor.getWin()).off('scroll', this.rteScroll);
  //       },

  //       rteKeyUp: function (e) {
  //           switch (e.which || e.keyCode) {
  //           //DOWN ARROW
  //           case 40:
  //           //UP ARROW
  //           case 38:
  //           //SHIFT
  //           case 16:
  //           //CTRL
  //           case 17:
  //           //ALT
  //           case 18:
  //               break;

  //           //BACKSPACE
  //           case 8:
  //               if (this.query === '') {
  //                   this.cleanUp(true);
  //               } else {
  //                   this.lookup();
  //               }
  //               break;

  //           //TAB
  //           case 9:
  //           //ENTER
  //           case 13:
  //               var item = (this.$dropdown !== undefined) ? this.$dropdown.find('li.active') : [];
  //               if (item.length) {
  //                   this.select(item.data());
  //                   this.cleanUp(false);
  //               } else {
  //                   this.cleanUp(true);
  //               }
  //               break;

  //           //ESC
  //           case 27:
  //               this.cleanUp(true);
  //               break;

  //           default:
  //               this.lookup();
  //           }
  //       },

  //       rteKeyDown: function (e) {
  //           switch (e.which || e.keyCode) {
  //             //TAB
  //           case 9:
  //           //ENTER
  //           case 13:
  //           //ESC
  //           case 27:
  //               e.preventDefault();
  //               break;

  //           //UP ARROW
  //           case 38:
  //               e.preventDefault();
  //               if (this.$dropdown !== undefined) {
  //                   this.highlightPreviousResult();
  //               }
  //               break;
  //           //DOWN ARROW
  //           case 40:
  //               e.preventDefault();
  //               if (this.$dropdown !== undefined) {
  //                   this.highlightNextResult();
  //               }
  //               break;
  //           }

  //           e.stopPropagation();
  //       },

  //       rteClicked: function (e) {
  //           var $target = $(e.target);

  //           if (this.hasFocus && $target.parent().attr('id') !== 'autocomplete-searchtext') {
  //               this.cleanUp(true);
  //           }
  //       },

  //       rteLostFocus: function () {
  //           if (this.hasFocus) {
  //               this.cleanUp(true);
  //           }
  //       },

  //       lookup: function () {
  //           this.query = $.trim($(this.editor.getBody()).find('#autocomplete-searchtext').text()).replace('\ufeff', '');

  //           // if (this.$dropdown === undefined) {
  //           //     this.show();
  //           // }

  //           clearTimeout(this.searchTimeout);
  //           this.searchTimeout = setTimeout($.proxy(function () {
  //               // Added delimiter parameter as last argument for backwards compatibility.
  //               var items = $.isFunction(this.options.source) ? this.options.source(this.query, $.proxy(this.process, this), this.options.delimiter) : this.options.source;
  //               if (items) {
  //                   this.process(items);
  //               }
  //           }, this), this.options.delay);
  //       },

  //       matcher: function (item) {
  //           return ~item[this.options.queryBy].toLowerCase().indexOf(this.query.toLowerCase());
  //       },

  //       sorter: function (items) {
  //           var beginswith = [],
  //               caseSensitive = [],
  //               caseInsensitive = [],
  //               item;

  //           while ((item = items.shift()) !== undefined) {
  //               if (!item[this.options.queryBy].toLowerCase().indexOf(this.query.toLowerCase())) {
  //                   beginswith.push(item);
  //               } else if (~item[this.options.queryBy].indexOf(this.query)) {
  //                   caseSensitive.push(item);
  //               } else {
  //                   caseInsensitive.push(item);
  //               }
  //           }

  //           return beginswith.concat(caseSensitive, caseInsensitive);
  //       },

  //       highlighter: function (text) {
  //           return text.replace(new RegExp('(' + this.query.replace(/([.?*+^$[\]\\(){}|-])/g, '\\$1') + ')', 'ig'), function ($1, match) {
  //               return '<strong>' + match + '</strong>';
  //           });
  //       },

  //       // show: function () {
  //       //     var offset = this.editor.inline ? this.offsetInline() : this.offset();

  //       //     this.$dropdown = $(this.renderDropdown())
  //       //                         .css({ 'top': offset.top, 'left': offset.left });

  //       //     $('body').append(this.$dropdown);

  //       //     this.$dropdown.on('click', $.proxy(this.autoCompleteClick, this));
  //       // },

  //       process: function (data) {
  //           if (!this.hasFocus) {
  //               return;
  //           }

  //           var _this = this,
  //               result = [],
  //               items = $.grep(data, function (item) {
  //                   return _this.matcher(item);
  //               });

  //           items = _this.sorter(items);

  //           items = items.slice(0, this.options.items);


  //           //debugger;
  //           //var offset = this.editor.inline ? this.offsetInline() : this.offset();
  //           // $(selection).autocomplete({
  //           //
  //           //});

  //           var finalItems = items.map(x => {
  //             return x[this.options.queryBy];
  //           });
  //           var autocompleteWidget = $(this.editor.getElement()).autocomplete({
  //             source: finalItems
  //           });

  //           debugger;


  //           // $.each(items, function (i, item) {
  //           //     var $element = $(_this.render(item, i));

  //           //     $element.html($element.html().replace($element.text(), _this.highlighter($element.text())));

  //           //     $.each(items[i], function (key, val) {
  //           //         $element.attr('data-' + key, val);
  //           //     });

  //           //     result.push($element[0].outerHTML);
  //           // });

  //           // if (result.length) {
  //           //     this.$dropdown.html(result.join('')).show();
  //           // } else {
  //           //     this.$dropdown.hide();
  //           // }
  //       },

  //       // renderDropdown: function () {
  //       //     return '<ul class="rte-autocomplete dropdown-menu"><li class="loading"></li></ul>';
  //       // },

  //       // render: function (item, index) {
  //       //     return '<li>' +
  //       //                 '<a href="javascript:;"><span>' + item[this.options.queryBy] + '</span></a>' +
  //       //             '</li>';
  //       // },

  //       autoCompleteClick: function (e) {
  //           var item = $(e.target).closest('li').data();
  //           if (!$.isEmptyObject(item)) {
  //               this.select(item);
  //               this.cleanUp(false);
  //           }
  //           e.stopPropagation();
  //           e.preventDefault();
  //       },

  //       highlightPreviousResult: function () {
  //           var currentIndex = this.$dropdown.find('li.active').index(),
  //               index = (currentIndex === 0) ? this.$dropdown.find('li').length - 1 : --currentIndex;

  //           this.$dropdown.find('li').removeClass('active').eq(index).addClass('active');
  //       },

  //       highlightNextResult: function () {
  //           var currentIndex = this.$dropdown.find('li.active').index(),
  //               index = (currentIndex === this.$dropdown.find('li').length - 1) ? 0 : ++currentIndex;

  //           this.$dropdown.find('li').removeClass('active').eq(index).addClass('active');
  //       },

  //       select: function (item) {
  //           this.editor.focus();
  //           var selection = this.editor.dom.select('span#autocomplete')[0];
  //           this.editor.dom.remove(selection);
  //           this.editor.execCommand('mceInsertContent', false, this.insert(item));
  //       },

  //       insert: function (item) {
  //           return '<span>' + item[this.options.insertFrom] + '</span>&nbsp;';
  //       },

  //       cleanUp: function (rollback) {
  //           this.unbindEvents();
  //           this.hasFocus = false;

  //           if (this.$dropdown !== undefined) {
  //               this.$dropdown.remove();
  //               delete this.$dropdown;
  //           }

  //           if (rollback) {
  //               var text = this.query,
  //                   $selection = $(this.editor.dom.select('span#autocomplete'));

  //               if (!$selection.length) {
  //                   return;
  //               }
                    
  //               var replacement = $('<p>' + this.options.delimiter + text + '</p>')[0].firstChild,
  //                   focus = $(this.editor.selection.getNode()).offset().top === ($selection.offset().top + (($selection.outerHeight() - $selection.height()) / 2));

  //               this.editor.dom.replace(replacement, $selection[0]);

  //               if (focus) {
  //                   this.editor.selection.select(replacement);
  //                   this.editor.selection.collapse();
  //               }
  //           }
  //       },

  //       offset: function () {
  //           var rtePosition = $(this.editor.getContainer()).offset(),
  //               contentAreaPosition = $(this.editor.getContentAreaContainer()).position(),
  //               nodePosition = $(this.editor.dom.select('span#autocomplete')).position();

  //           return {
  //               top: rtePosition.top + contentAreaPosition.top + nodePosition.top + $(this.editor.selection.getNode()).innerHeight() - $(this.editor.getDoc()).scrollTop() + 5,
  //               left: rtePosition.left + contentAreaPosition.left + nodePosition.left
  //           };
  //       },

  //       offsetInline: function () {
  //           var nodePosition = $(this.editor.dom.select('span#autocomplete')).offset();

  //           return {
  //               top: nodePosition.top + $(this.editor.selection.getNode()).innerHeight() + 5,
  //               left: nodePosition.left
  //           };
  //       }

  //   };      

  //     return {
  //       show: function(ed, options) {
  //         return new AutoComplete(ed, options);
  //       }
  //     };

  //   });


  // define('tinymce.plugins.suggestion.ui.behaviour',
  //   [
  //       'tinymce.plugins.suggestion.api.Events',
  //       'tinymce.plugins.suggestion.ui.autocomplete'
  //   ],
  //   function(Events, AutoComplete) {

  //     var register = function(ed) {
  //         var autoComplete,
  //           autoCompleteData = ed.getParam('suggestions') || {};

  //         // If the delimiter is undefined set default value to ['<<']
  //         // If the delimiter is a string value convert it to an array. (backwards compatibility)
  //         autoCompleteData.delimiter = (autoCompleteData.delimiter !== undefined) ? 
  //           !$.isArray(autoCompleteData.delimiter) ? [autoCompleteData.delimiter] : autoCompleteData.delimiter : ['<<'];

  //         // convert delimeters to array keycodes, e.g. ['<<','@'] becomes [ [32,32],[] ]
  //         autoCompleteData.delimiter = autoCompleteData.delimiter.map(x => x.split('').map(y => y.charCodeAt(0)));

  //         // function prevCharIsSpace() {
  //         //   var start = ed.selection.getRng(true).startOffset,
  //         //     text = ed.selection.getRng(true).startContainer.data || '',
  //         //     charachter = text.substr(start > 0 ? start - 1 : 0, 1);

  //         //   return (!!$.trim(charachter).length) ? false : true;
  //         // }
          
  //         // Get maximum length of characters we need to look at
  //         var charLength = 0, charIndex = 0;
  //         $.each(autoCompleteData.delimiter, (i,x) => { if (x.length > charLength) { charLength = x.length; } });
     
  //         // last characters pressed array, we'll keep going around in a "static" array of length charLength
  //         var charsPressed = [];        
  //         function enqueueKeyCode(keyCode) {
  //           charsPressed[charIndex] = keyCode;
  //           charIndex++;
  //           if (charIndex >= charLength) {
  //             charIndex = 0;              
  //           }
  //         }
  //         function popLastKeyCode() {

  //         }
  //         function emptyKeyList() {
  //           for (var i=0; i<charLength; i++) { 
  //             charsPressed[i] = 0;
  //           }
  //           charIndex = 0;
  //         }
  //         // retrieves the previous n keys pressed
  //         function getPreviousKeys(n) {
  //           var ret = [], i=charIndex-1, j=0;
  //           while (j++<n) {
  //             ret.unshift(charsPressed[i++]);
  //           }
  //           return ret;            
  //         }
  //         // start with initially empty list
  //         emptyKeyList();

  //         // special case for backspace
  //         ed.on('keydown', e => { 
  //           switch(e.which || e.keyCode) {
  //             case 8: popLastKeyCode(); break; // backspace
  //             case 46: emptyKeyList(); break;  // delete
  //           }
  //         });
  //         ed.on('keypress', function(e) {
            
  //           enqueueKeyCode(e.which || e.keyCode);
  //           var delimiterPressed = null; // will be filled in if we find one
  //           $.each(autoCompleteData.delimiter, (i, x) => {
  //             var previousKeys = (x.length == 1 ? [e.which || e.keyCode] : getPreviousKeys(x.length));
  //             if (x.length == previousKeys.length) {
  //               var flag = true; // true until proven false
  //               for (var k=0; k<x.length; k++) {
  //                 if (x[k] !== previousKeys[k]) {
  //                   flag = false;
  //                   break;
  //                 }
  //               }
  //               if (flag)
  //                 delimiterPressed = x;
  //             }
  //           });
            
  //           if (delimiterPressed) {
  //             if (autoComplete === undefined || (autoComplete.hasFocus !== undefined && !autoComplete.hasFocus)) {
  //               Events.firesuggestionOpening(ed, { keyEvent: e });
  //               e.preventDefault();
  //               // Clone options object and set the used delimiter.
  //               autoComplete = AutoComplete.show(ed, $.extend({}, autoCompleteData, { delimiter: delimiterPressed, lastKeyPressed: String.fromCharCode(e.which || e.keyCode) }));               
  //             }
  //           }
  //         });            
  //     };

  //     return {
  //       register: register
  //     };        
  //   });

  /**
   * ResolveGlobal.js
   *
   * Released under LGPL License.
   * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
   *
   * License: http://www.tinymce.com/license
   * Contributing: http://www.tinymce.com/contributing
   */
  
  define(
    'tinymce.core.PluginManager',
    [
      'global!tinymce.util.Tools.resolve'
    ],
    function (resolve) {
      return resolve('tinymce.PluginManager');
    }
  );  


/**
 * Api.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

define(
  'tinymce.plugins.suggestions.api.Api',
  [
  ],
  function () {
    var get = function (visibleState) {
      var isContextMenuVisible = function () {
        return visibleState.get();
      };

      return {
        isContextMenuVisible: isContextMenuVisible
      };
    };

    return {
      get: get
    };
  }
);


/**
 * ResolveGlobal.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

define(
  'tinymce.core.dom.DOMUtils',
  [
    'global!tinymce.util.Tools.resolve'
  ],
  function (resolve) {
    return resolve('tinymce.dom.DOMUtils');
  }
);

/**
 * ResolveGlobal.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

define(
  'tinymce.core.Env',
  [
    'global!tinymce.util.Tools.resolve'
  ],
  function (resolve) {
    return resolve('tinymce.Env');
  }
);


/**
 * Settings.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

define(
  'tinymce.plugins.suggestions.api.Settings',
  [
  ],
  function () {
    var getContextMenu = function (editor) {
      return editor.getParam('suggestions', 'link openlink image inserttable'); // set default values here
    };

    return {
      getContextMenu: getContextMenu
    };
  }
);



defineGlobal("global!Array", Array);
defineGlobal("global!Error", Error);
define(
  'ephox.katamari.api.Fun',

  [
    'global!Array',
    'global!Error'
  ],

  function (Array, Error) {

    var noop = function () { };

    var compose = function (fa, fb) {
      return function () {
        return fa(fb.apply(null, arguments));
      };
    };

    var constant = function (value) {
      return function () {
        return value;
      };
    };

    var identity = function (x) {
      return x;
    };

    var tripleEquals = function(a, b) {
      return a === b;
    };

    // Don't use array slice(arguments), makes the whole function unoptimisable on Chrome
    var curry = function (f) {
      // equivalent to arguments.slice(1)
      // starting at 1 because 0 is the f, makes things tricky.
      // Pay attention to what variable is where, and the -1 magic.
      // thankfully, we have tests for this.
      var args = new Array(arguments.length - 1);
      for (var i = 1; i < arguments.length; i++) args[i-1] = arguments[i];

      return function () {
        var newArgs = new Array(arguments.length);
        for (var j = 0; j < newArgs.length; j++) newArgs[j] = arguments[j];

        var all = args.concat(newArgs);
        return f.apply(null, all);
      };
    };

    var not = function (f) {
      return function () {
        return !f.apply(null, arguments);
      };
    };

    var die = function (msg) {
      return function () {
        throw new Error(msg);
      };
    };

    var apply = function (f) {
      return f();
    };

    var call = function(f) {
      f();
    };

    var never = constant(false);
    var always = constant(true);
    

    return {
      noop: noop,
      compose: compose,
      constant: constant,
      identity: identity,
      tripleEquals: tripleEquals,
      curry: curry,
      not: not,
      die: die,
      apply: apply,
      call: call,
      never: never,
      always: always
    };
  }
);

defineGlobal("global!Object", Object);
define(
  'ephox.katamari.api.Option',

  [
    'ephox.katamari.api.Fun',
    'global!Object'
  ],

  function (Fun, Object) {

    var never = Fun.never;
    var always = Fun.always;

    /**
      Option objects support the following methods:

      fold :: this Option a -> ((() -> b, a -> b)) -> Option b

      is :: this Option a -> a -> Boolean

      isSome :: this Option a -> () -> Boolean

      isNone :: this Option a -> () -> Boolean

      getOr :: this Option a -> a -> a

      getOrThunk :: this Option a -> (() -> a) -> a

      getOrDie :: this Option a -> String -> a

      or :: this Option a -> Option a -> Option a
        - if some: return self
        - if none: return opt

      orThunk :: this Option a -> (() -> Option a) -> Option a
        - Same as "or", but uses a thunk instead of a value

      map :: this Option a -> (a -> b) -> Option b
        - "fmap" operation on the Option Functor.
        - same as 'each'

      ap :: this Option a -> Option (a -> b) -> Option b
        - "apply" operation on the Option Apply/Applicative.
        - Equivalent to <*> in Haskell/PureScript.

      each :: this Option a -> (a -> b) -> Option b
        - same as 'map'

      bind :: this Option a -> (a -> Option b) -> Option b
        - "bind"/"flatMap" operation on the Option Bind/Monad.
        - Equivalent to >>= in Haskell/PureScript; flatMap in Scala.

      flatten :: {this Option (Option a))} -> () -> Option a
        - "flatten"/"join" operation on the Option Monad.

      exists :: this Option a -> (a -> Boolean) -> Boolean

      forall :: this Option a -> (a -> Boolean) -> Boolean

      filter :: this Option a -> (a -> Boolean) -> Option a

      equals :: this Option a -> Option a -> Boolean

      equals_ :: this Option a -> (Option a, a -> Boolean) -> Boolean

      toArray :: this Option a -> () -> [a]

    */

    var none = function () { return NONE; };

    var NONE = (function () {
      var eq = function (o) {
        return o.isNone();
      };

      // inlined from peanut, maybe a micro-optimisation?
      var call = function (thunk) { return thunk(); };
      var id = function (n) { return n; };
      var noop = function () { };

      var me = {
        fold: function (n, s) { return n(); },
        is: never,
        isSome: never,
        isNone: always,
        getOr: id,
        getOrThunk: call,
        getOrDie: function (msg) {
          throw new Error(msg || 'error: getOrDie called on none.');
        },
        or: id,
        orThunk: call,
        map: none,
        ap: none,
        each: noop,
        bind: none,
        flatten: none,
        exists: never,
        forall: always,
        filter: none,
        equals: eq,
        equals_: eq,
        toArray: function () { return []; },
        toString: Fun.constant("none()")
      };
      if (Object.freeze) Object.freeze(me);
      return me;
    })();


    /** some :: a -> Option a */
    var some = function (a) {

      // inlined from peanut, maybe a micro-optimisation?
      var constant_a = function () { return a; };

      var self = function () {
        // can't Fun.constant this one
        return me;
      };

      var map = function (f) {
        return some(f(a));
      };

      var bind = function (f) {
        return f(a);
      };

      var me = {
        fold: function (n, s) { return s(a); },
        is: function (v) { return a === v; },
        isSome: always,
        isNone: never,
        getOr: constant_a,
        getOrThunk: constant_a,
        getOrDie: constant_a,
        or: self,
        orThunk: self,
        map: map,
        ap: function (optfab) {
          return optfab.fold(none, function(fab) {
            return some(fab(a));
          });
        },
        each: function (f) {
          f(a);
        },
        bind: bind,
        flatten: constant_a,
        exists: bind,
        forall: bind,
        filter: function (f) {
          return f(a) ? me : NONE;
        },
        equals: function (o) {
          return o.is(a);
        },
        equals_: function (o, elementEq) {
          return o.fold(
            never,
            function (b) { return elementEq(a, b); }
          );
        },
        toArray: function () {
          return [a];
        },
        toString: function () {
          return 'some(' + a + ')';
        }
      };
      return me;
    };

    /** from :: undefined|null|a -> Option a */
    var from = function (value) {
      return value === null || value === undefined ? NONE : some(value);
    };

    return {
      some: some,
      none: none,
      from: from
    };
  }
);

defineGlobal("global!String", String);
define(
  'ephox.katamari.api.Arr',

  [
    'ephox.katamari.api.Option',
    'global!Array',
    'global!Error',
    'global!String'
  ],

  function (Option, Array, Error, String) {
    // Use the native Array.indexOf if it is available (IE9+) otherwise fall back to manual iteration
    // https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Array/indexOf
    var rawIndexOf = (function () {
      var pIndexOf = Array.prototype.indexOf;

      var fastIndex = function (xs, x) { return  pIndexOf.call(xs, x); };

      var slowIndex = function(xs, x) { return slowIndexOf(xs, x); };

      return pIndexOf === undefined ? slowIndex : fastIndex;
    })();

    var indexOf = function (xs, x) {
      // The rawIndexOf method does not wrap up in an option. This is for performance reasons.
      var r = rawIndexOf(xs, x);
      return r === -1 ? Option.none() : Option.some(r);
    };

    var contains = function (xs, x) {
      return rawIndexOf(xs, x) > -1;
    };

    // Using findIndex is likely less optimal in Chrome (dynamic return type instead of bool)
    // but if we need that micro-optimisation we can inline it later.
    var exists = function (xs, pred) {
      return findIndex(xs, pred).isSome();
    };

    var range = function (num, f) {
      var r = [];
      for (var i = 0; i < num; i++) {
        r.push(f(i));
      }
      return r;
    };

    // It's a total micro optimisation, but these do make some difference.
    // Particularly for browsers other than Chrome.
    // - length caching
    // http://jsperf.com/browser-diet-jquery-each-vs-for-loop/69
    // - not using push
    // http://jsperf.com/array-direct-assignment-vs-push/2

    var chunk = function (array, size) {
      var r = [];
      for (var i = 0; i < array.length; i += size) {
        var s = array.slice(i, i + size);
        r.push(s);
      }
      return r;
    };

    var map = function(xs, f) {
      // pre-allocating array size when it's guaranteed to be known
      // http://jsperf.com/push-allocated-vs-dynamic/22
      var len = xs.length;
      var r = new Array(len);
      for (var i = 0; i < len; i++) {
        var x = xs[i];
        r[i] = f(x, i, xs);
      }
      return r;
    };

    // Unwound implementing other functions in terms of each.
    // The code size is roughly the same, and it should allow for better optimisation.
    var each = function(xs, f) {
      for (var i = 0, len = xs.length; i < len; i++) {
        var x = xs[i];
        f(x, i, xs);
      }
    };

    var eachr = function (xs, f) {
      for (var i = xs.length - 1; i >= 0; i--) {
        var x = xs[i];
        f(x, i, xs);
      }
    };

    var partition = function(xs, pred) {
      var pass = [];
      var fail = [];
      for (var i = 0, len = xs.length; i < len; i++) {
        var x = xs[i];
        var arr = pred(x, i, xs) ? pass : fail;
        arr.push(x);
      }
      return { pass: pass, fail: fail };
    };

    var filter = function(xs, pred) {
      var r = [];
      for (var i = 0, len = xs.length; i < len; i++) {
        var x = xs[i];
        if (pred(x, i, xs)) {
          r.push(x);
        }
      }
      return r;
    };

    /*
     * Groups an array into contiguous arrays of like elements. Whether an element is like or not depends on f.
     *
     * f is a function that derives a value from an element - e.g. true or false, or a string.
     * Elements are like if this function generates the same value for them (according to ===).
     *
     *
     * Order of the elements is preserved. Arr.flatten() on the result will return the original list, as with Haskell groupBy function.
     *  For a good explanation, see the group function (which is a special case of groupBy)
     *  http://hackage.haskell.org/package/base-4.7.0.0/docs/Data-List.html#v:group
     */
    var groupBy = function (xs, f) {
      if (xs.length === 0) {
        return [];
      } else {
        var wasType = f(xs[0]); // initial case for matching
        var r = [];
        var group = [];

        for (var i = 0, len = xs.length; i < len; i++) {
          var x = xs[i];
          var type = f(x);
          if (type !== wasType) {
            r.push(group);
            group = [];
          }
          wasType = type;
          group.push(x);
        }
        if (group.length !== 0) {
          r.push(group);
        }
        return r;
      }
    };

    var foldr = function (xs, f, acc) {
      eachr(xs, function (x) {
        acc = f(acc, x);
      });
      return acc;
    };

    var foldl = function (xs, f, acc) {
      each(xs, function (x) {
        acc = f(acc, x);
      });
      return acc;
    };

    var find = function (xs, pred) {
      for (var i = 0, len = xs.length; i < len; i++) {
        var x = xs[i];
        if (pred(x, i, xs)) {
          return Option.some(x);
        }
      }
      return Option.none();
    };

    var findIndex = function (xs, pred) {
      for (var i = 0, len = xs.length; i < len; i++) {
        var x = xs[i];
        if (pred(x, i, xs)) {
          return Option.some(i);
        }
      }

      return Option.none();
    };

    var slowIndexOf = function (xs, x) {
      for (var i = 0, len = xs.length; i < len; ++i) {
        if (xs[i] === x) {
          return i;
        }
      }

      return -1;
    };

    var push = Array.prototype.push;
    var flatten = function (xs) {
      // Note, this is possible because push supports multiple arguments:
      // http://jsperf.com/concat-push/6
      // Note that in the past, concat() would silently work (very slowly) for array-like objects.
      // With this change it will throw an error.
      var r = [];
      for (var i = 0, len = xs.length; i < len; ++i) {
        // Ensure that each value is an array itself
        if (! Array.prototype.isPrototypeOf(xs[i])) throw new Error('Arr.flatten item ' + i + ' was not an array, input: ' + xs);
        push.apply(r, xs[i]);
      }
      return r;
    };

    var bind = function (xs, f) {
      var output = map(xs, f);
      return flatten(output);
    };

    var forall = function (xs, pred) {
      for (var i = 0, len = xs.length; i < len; ++i) {
        var x = xs[i];
        if (pred(x, i, xs) !== true) {
          return false;
        }
      }
      return true;
    };

    var equal = function (a1, a2) {
      return a1.length === a2.length && forall(a1, function (x, i) {
        return x === a2[i];
      });
    };

    var slice = Array.prototype.slice;
    var reverse = function (xs) {
      var r = slice.call(xs, 0);
      r.reverse();
      return r;
    };

    var difference = function (a1, a2) {
      return filter(a1, function (x) {
        return !contains(a2, x);
      });
    };

    var mapToObject = function(xs, f) {
      var r = {};
      for (var i = 0, len = xs.length; i < len; i++) {
        var x = xs[i];
        r[String(x)] = f(x, i);
      }
      return r;
    };

    var pure = function(x) {
      return [x];
    };

    var sort = function (xs, comparator) {
      var copy = slice.call(xs, 0);
      copy.sort(comparator);
      return copy;
    };

    var head = function (xs) {
      return xs.length === 0 ? Option.none() : Option.some(xs[0]);
    };

    var last = function (xs) {
      return xs.length === 0 ? Option.none() : Option.some(xs[xs.length - 1]);
    };

    return {
      map: map,
      each: each,
      eachr: eachr,
      partition: partition,
      filter: filter,
      groupBy: groupBy,
      indexOf: indexOf,
      foldr: foldr,
      foldl: foldl,
      find: find,
      findIndex: findIndex,
      flatten: flatten,
      bind: bind,
      forall: forall,
      exists: exists,
      contains: contains,
      equal: equal,
      reverse: reverse,
      chunk: chunk,
      difference: difference,
      mapToObject: mapToObject,
      pure: pure,
      sort: sort,
      range: range,
      head: head,
      last: last
    };
  }
);  

/**
 * RangePoint.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

define(
  'tinymce.plugins.suggestions.core.RangePoint',
  [
    'ephox.katamari.api.Arr'
  ],
  function (Arr) {
    var containsXY = function (clientRect, clientX, clientY) {
      return (
        clientX >= clientRect.left &&
        clientX <= clientRect.right &&
        clientY >= clientRect.top &&
        clientY <= clientRect.bottom
      );
    };

    var isXYWithinRange = function (clientX, clientY, range) {
      if (range.collapsed) {
        return false;
      }

      return Arr.foldl(range.getClientRects(), function (state, rect) {
        return state || containsXY(rect, clientX, clientY);
      }, false);
    };

    return {
      isXYWithinRange: isXYWithinRange
    };
  }
);
/**
 * ResolveGlobal.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

define(
  'tinymce.core.ui.Factory',
  [
    'global!tinymce.util.Tools.resolve'
  ],
  function (resolve) {
    return resolve('tinymce.ui.Factory');
  }
);

/**
 * ResolveGlobal.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

define(
  'tinymce.core.util.Tools',
  [
    'global!tinymce.util.Tools.resolve'
  ],
  function (resolve) {
    return resolve('tinymce.util.Tools');
  }
);




/**
 * ContextMenu.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

define(
  'tinymce.plugins.suggestions.ui.ContextMenu',
  [
    'tinymce.core.ui.Factory',
    'tinymce.core.util.Tools',
    'tinymce.plugins.suggestions.api.Settings'
  ],
  function (Factory, Tools, Settings) {
    var renderMenu = function (editor, visibleState) {
      var menu, contextmenu, items = [];

      contextmenu = Settings.getContextMenu(editor);
      Tools.each(contextmenu.split(/[ ,]/), function (name) {
        var item = editor.menuItems[name];

        if (name === '|') {
          item = { text: name };
        }

        if (item) {
          item.shortcut = ''; // Hide shortcuts
          items.push(item);
        }
      });

      for (var i = 0; i < items.length; i++) {
        if (items[i].text === '|') {
          if (i === 0 || i === items.length - 1) {
            items.splice(i, 1);
          }
        }
      }

      menu = Factory.create('menu', {
        items: items,
        context: 'contextmenu',
        classes: 'contextmenu'
      }).renderTo();

      menu.on('hide', function (e) {
        if (e.control === this) {
          visibleState.set(false);
        }
      });

      editor.on('remove', function () {
        menu.remove();
        menu = null;
      });

      return menu;
    };

    var show = function (editor, x, y, visibleState, menu) {
      if (menu.get() === null) {
        menu.set(renderMenu(editor, visibleState));
      } else {
        menu.get().show();
      }

      menu.get().moveTo(x, y);
      visibleState.set(true);
    };

    return {
      show: show
    };
  }
);
/**
 * Bind.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

define(
  'tinymce.plugins.suggestions.core.Bind',
  [
    'tinymce.core.dom.DOMUtils',
    'tinymce.core.Env',
    'tinymce.plugins.suggestions.api.Settings',
    'tinymce.plugins.suggestions.core.RangePoint',
    'tinymce.plugins.suggestions.ui.ContextMenu'
  ],
  function (DOMUtils, Env, Settings, RangePoint, ContextMenu) {

    var setup = function (editor, visibleState, menu) {
      // listen for delimiters...

      var autoCompleteData = editor.getParam('suggestions') || {},
        delimiters = autoCompleteData.delimiter || ['<<']; 

      // convert delimeters to array keycodes, e.g. ['<<','@'] becomes [ [32,32],[] ]
      autoCompleteData.delimiter = delimiters.map(x => x.split('').map(y => y.charCodeAt(0)));
       
      // Get maximum length of characters we need to look at
      var charLength = 0, charIndex = 0;
      $.each(autoCompleteData.delimiter, (i,x) => { if (x.length > charLength) { charLength = x.length; } });
  
      // last characters pressed array, we'll keep going around in a "static" array of length charLength
      var charsPressed = [];        
      function enqueueKeyCode(keyCode) {
        charsPressed[charIndex] = keyCode;
        charIndex++;
        if (charIndex >= charLength) {
          charIndex = 0;              
        }
      }
      function popLastKeyCode() {

      }
      function emptyKeyList() {
        for (var i=0; i<charLength; i++) { 
          charsPressed[i] = 0;
        }
        charIndex = 0;
      }
      // retrieves the previous n keys pressed
      function getPreviousKeys(n) {
        var ret = [], i=charIndex-1, j=0;
        while (j++<n) {
          ret.unshift(charsPressed[i++]);
        }
        return ret;            
      }
      // start with initially empty list
      emptyKeyList();

      // special case for backspace
      editor.on('keydown', e => { 
        switch(e.which || e.keyCode) {
          case 8: popLastKeyCode(); break; // backspace
          case 46: emptyKeyList(); break;  // delete
        }
      });
      editor.on('keypress', function(e) {
        
        enqueueKeyCode(e.which || e.keyCode);
        var delimiterPressed = null; // will be filled in if we find one
        $.each(autoCompleteData.delimiter, (i, x) => {
          var previousKeys = (x.length == 1 ? [e.which || e.keyCode] : getPreviousKeys(x.length));
          if (x.length == previousKeys.length) {
            var flag = true; // true until proven false
            for (var k=0; k<x.length; k++) {
              if (x[k] !== previousKeys[k]) {
                flag = false;
                break;
              }
            }
            if (flag)
              delimiterPressed = x;
          }
        });
        
        if (delimiterPressed) {
          //if (autoComplete === undefined || (autoComplete.hasFocus !== undefined && !autoComplete.hasFocus)) {
            editor.fire("suggestions");
          //}
        }
      });   


      editor.on('suggestions', function (e) {
        //var x = e.pageX, y = e.pageY;
        var charPos = DOMUtils.DOM.getPos(tinymce.activeEditor.selection.getNode());
        var x = charPos.x, y = charPos.y;

        if (!editor.inline) {
          var pos = DOMUtils.DOM.getPos(editor.getContentAreaContainer());
          x = x + pos.x;
          y = y + pos.y;
        }

        e.preventDefault();

        //ContextMenu.show(editor, x, y, visibleState, menu);
      });
    };

    return {
      setup: setup
    };
  }
);


  /**
   * Plugin.js
   *
   * Released under LGPL License.
   * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
   *
   * License: http://www.tinymce.com/license
   * Contributing: http://www.tinymce.com/contributing
   */
  
  define(
    'tinymce.plugins.suggestion.Plugin',
    [
      'ephox.katamari.api.Cell',
      'tinymce.core.PluginManager',
      'tinymce.plugins.suggestions.api.Api',
      'tinymce.plugins.suggestions.core.Bind'
    ],
    function (Cell, PluginManager, Api, Bind) {
      PluginManager.add('suggestions', function (editor) {
        var menu = Cell(null), visibleState = Cell(false);
        
        Bind.setup(editor, visibleState, menu);
  
        return Api.get(visibleState);        
      });
  
      return function () { };
    }
  );
  dem('tinymce.plugins.suggestion.Plugin')();
  })();
  