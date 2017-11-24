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
    ["tinymce.plugins.window.Plugin","ephox.katamari.api.Cell","tinymce.core.PluginManager","tinymce.plugins.window.api.Api","tinymce.plugins.window.api.Commands","tinymce.plugins.window.ui.Buttons","global!tinymce.util.Tools.resolve","tinymce.plugins.window.core.Actions","global!document","global!window","tinymce.core.dom.DOMUtils","tinymce.plugins.window.api.Events"]
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
      'tinymce.plugins.window.api.Api',
      [
      ],
      function () {
        var get = function (windowState) {
          return {
            isInOwnWindow: function () {
              return windowState.get() !== null;
            }
          };
        };
    
        return {
          get: get
        };
      }
    );
    
    defineGlobal("global!document", document);
    defineGlobal("global!window", window);
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
     * Events.js
     *
     * Released under LGPL License.
     * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
     *
     * License: http://www.tinymce.com/license
     * Contributing: http://www.tinymce.com/contributing
     */
    
    define(
      'tinymce.plugins.window.api.Events',
      [
      ],
      function () {
        var fireWindowStateChanged = function (editor, state) {
          editor.fire('WindowStateChanged', { state: state });
        };
    
        return {
          fireWindowStateChanged: fireWindowStateChanged
        };
      }
    );
    
    /**
     * Actions.js
     *
     * Released under LGPL License.
     * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
     *
     * License: http://www.tinymce.com/license
     * Contributing: http://www.tinymce.com/contributing
     */
    
    define(
      'tinymce.plugins.window.core.Actions',
      [
        'global!document',
        'global!window',
        'tinymce.core.dom.DOMUtils',
        'tinymce.plugins.window.api.Events'
      ],
      function (document, window, DOMUtils, Events) {
        var DOM = DOMUtils.DOM;
    
        // var getWindowSize = function () {
        //   var w, h, win = window, doc = document;
        //   var body = doc.body;
    
        //   // Old IE
        //   if (body.offsetWidth) {
        //     w = body.offsetWidth;
        //     h = body.offsetHeight;
        //   }
    
        //   // Modern browsers
        //   if (win.innerWidth && win.innerHeight) {
        //     w = win.innerWidth;
        //     h = win.innerHeight;
        //   }
    
        //   return { w: w, h: h };
        // };
    
        // var getScrollPos = function () {
        //   var vp = DOM.getViewPort();
    
        //   return {
        //     x: vp.x,
        //     y: vp.y
        //   };
        // };
    
        // var setScrollPos = function (pos) {
        //   window.scrollTo(pos.x, pos.y);
        // };
    
        var toggleWindow = function (editor, windowState) {
          var body = document.body, documentElement = document.documentElement, editorContainerStyle;
          var editorContainer, iframe, iframeStyle;
          var windowInfo = windowState.get();
    
          // var resize = function () {
          //   DOM.setStyle(iframe, 'height', getWindowSize().h - (editorContainer.clientHeight - iframe.clientHeight));
          // };
    
          // var removeResize = function () {
          //   DOM.unbind(window, 'resize', resize);
          // };
    
          editorContainer = editor.getContainer();
          editorContainerStyle = editorContainer.style;
          iframe = editor.getContentAreaContainer().firstChild;
          iframeStyle = iframe.style;
    
          if (!windowInfo) {
            

            // var newWindownInfo = {
            //   scrollPos: getScrollPos(),
            //   containerWidth: editorContainerStyle.width,
            //   containerHeight: editorContainerStyle.height,
            //   iframeWidth: iframeStyle.width,
            //   iframeHeight: iframeStyle.height,
            //   resizeHandler: resize,
            //   removeHandler: removeResize
            // };
    
            // iframeStyle.width = iframeStyle.height = '100%';
            // editorContainerStyle.width = editorContainerStyle.height = '';
    
            // DOM.addClass(body, 'mce-window');
            // DOM.addClass(documentElement, 'mce-window');
            // DOM.addClass(editorContainer, 'mce-window');
    
            // DOM.bind(window, 'resize', resize);
            // editor.on('remove', removeResize);
    
            // resize();
    
            // windowState.set(newWindowInfo);
            Events.fireWindowStateChanged(editor, true);
          } else {
            // iframeStyle.width = windowInfo.iframeWidth;
            // iframeStyle.height = windowInfo.iframeHeight;
    
            // if (windowInfo.containerWidth) {
            //   editorContainerStyle.width = windowInfo.containerWidth;
            // }
    
            // if (windowInfo.containerHeight) {
            //   editorContainerStyle.height = windowInfo.containerHeight;
            // }
    
            // DOM.removeClass(body, 'mce-window');
            // DOM.removeClass(documentElement, 'mce-window');
            // DOM.removeClass(editorContainer, 'mce-window');
            // setScrollPos(windowInfo.scrollPos);
    
            // DOM.unbind(window, 'resize', windowInfo.resizeHandler);
            // editor.off('remove', windowInfo.removeHandler);
    
            // windowState.set(null);
            Events.fireWindowStateChanged(editor, false);
          }
        };
    
        return {
          toggleWindow: toggleWindow
        };
      }
    );
    
    /**
     * Commands.js
     *
     * Released under LGPL License.
     * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
     *
     * License: http://www.tinymce.com/license
     * Contributing: http://www.tinymce.com/contributing
     */
    
    define(
      'tinymce.plugins.window.api.Commands',
      [
        'tinymce.plugins.window.core.Actions'
      ],
      function (Actions) {
        var register = function (editor, windowState) {
          editor.addCommand('mceWindow', function () {
            Actions.toggleWindow(editor, windowState);
          });
        };
    
        return {
          register: register
        };
      }
    );
    
    /**
     * Buttons.js
     *
     * Released under LGPL License.
     * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
     *
     * License: http://www.tinymce.com/license
     * Contributing: http://www.tinymce.com/contributing
     */
    
    define(
      'tinymce.plugins.window.ui.Buttons',
      [
      ],
      function () {
        var postRender = function (editor) {
          return function (e) {
            var ctrl = e.control;
    
            editor.on('WindowStateChanged', function (e) {
              // should I do anything here...?
              //ctrl.active(e.state);
            });
          };
        };
    
        var register = function (editor) {
          editor.addMenuItem('window', {
            text: 'Window',
            //shortcut: 'Ctrl+Shift+F',
            selectable: true,
            cmd: 'mceWindow',
            onPostRender: postRender(editor),
            context: 'view'
          });
    
          editor.addButton('window', {
            tooltip: 'Window',
            cmd: 'mceWindow',
            onPostRender: postRender(editor)
          });
        };
    
        return {
          register: register
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
      'tinymce.plugins.window.Plugin',
      [
        'ephox.katamari.api.Cell',
        'tinymce.core.PluginManager',
        'tinymce.plugins.window.api.Api',
        'tinymce.plugins.window.api.Commands',
        'tinymce.plugins.window.ui.Buttons'
      ],
      function (Cell, PluginManager, Api, Commands, Buttons) {
        PluginManager.add('window', function (editor) {
          var windowState = Cell(null);
    
          Commands.register(editor, windowState);
          Buttons.register(editor);
    
          // what should the shortcut be...?
          //editor.addShortcut('Ctrl+Shift+F', '', 'mceWindow');
    
          return Api.get(windowState);
        });
    
        return function () { };
      }
    );
    dem('tinymce.plugins.window.Plugin')();
    })();
    