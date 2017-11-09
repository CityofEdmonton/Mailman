/**
 * This module exports the TinyMce placeholder plugin, 
 * inspired by https://github.com/mohan/tinymce-placeholder
 * and built-in tinymce plugins
 *
 * @author {@link https://github.com/dchenier|Dan Chenier}
 */

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
["tinymce.plugins.placeholder.Plugin","tinymce.core.PluginManager"]
jsc*/
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
 * Plugin.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */
define(
  'tinymce.plugins.fullscreen.Plugin',
  [
    'tinymce.core.PluginManager'
  ],
  function (PluginManager) {
    PluginManager.add('placeholder', function(editor) {
      editor.on('init', function() {
          var label = new Label;
  
          onBlur();
  
          tinymce.DOM.bind(label.el, 'click', onFocus);
          editor.on('focus', onFocus);
          editor.on('blur', onBlur);
          editor.on('change', onBlur);
          editor.on('setContent', onBlur);
          editor.on('keydown', onKeydown);
  
          function onFocus() {
              if (!editor.settings.readonly === true) {
                  label.hide();
              }
              editor.execCommand('mceFocus', false);
          }
  
          function onBlur() {
              if (editor.getContent() == '') {
                  label.show();
              } else {
                  label.hide();
              }
          }
  
          function onKeydown(){
              label.hide();
          }
      });
  
      var Label = function(){
          var placeholder_text = editor.getElement().getAttribute("placeholder") || editor.settings.placeholder;
          var placeholder_attrs = editor.settings.placeholder_attrs || {style: {position: 'absolute', top:'5px', left:0, color: '#888', padding: '1%', width:'98%', overflow: 'hidden', 'white-space': 'pre-wrap'} };
          var contentAreaContainer = editor.getContentAreaContainer();
  
          tinymce.DOM.setStyle(contentAreaContainer, 'position', 'relative');
  
          // Create label el
          this.el = tinymce.DOM.add( contentAreaContainer, editor.settings.placeholder_tag || "label", placeholder_attrs, placeholder_text );
      }
  
      Label.prototype.hide = function(){
          tinymce.DOM.setStyle( this.el, 'display', 'none' );
      }
  
      Label.prototype.show = function(){
          tinymce.DOM.setStyle( this.el, 'display', '' );
      }
  });

    return function () { };
  }
);
dem('tinymce.plugins.fullscreen.Plugin')();
})();