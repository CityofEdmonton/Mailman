/**
 * A component handler interface using the revealing module design pattern.
 * @author Jason Mayes
 *
 * From https://github.com/jasonmayes/mdl-component-design-pattern
 */
var componentHandler = (function() {
  'use strict';

  var registeredComponents_ = [];
  var createdComponents_ = [];


  /**
   * Searches registered components for a class we are interested in using.
   * Optionally replaces a match with passed object if specified.
   * @param {string} name The name of a class we want to use.
   * @param {object} opt_replace Optional object to replace match with.
   * @return {Object | false}
   * @private
   */
  function findRegisteredClass_(name, opt_replace) {
    for (var i = 0; i < registeredComponents_.length; i++) {
      if (registeredComponents_[i].className === name) {
        if (opt_replace !== undefined) {
          registeredComponents_[i] = opt_replace;
        }
        return registeredComponents_[i];
      }
    }
    return false;
  }


  /**
   * Searches existing DOM for elements of our component type and upgrades them
   * if they have not already been upgraded.
   * @param {string} jsClass the programatic name of the element class we need
   * to create a new instance of.
   * @param {string} cssClass the name of the CSS class elements of this type
   * will have.
   */
  function upgradeDomInternal(jsClass, cssClass) {
    if (jsClass === undefined && cssClass === undefined) {
      for (var i = 0; i < registeredComponents_.length; i++) {
        upgradeDomInternal(registeredComponents_[i].className,
            registeredComponents_[i].cssClass);
      }
    } else {
      if (cssClass === undefined) {
        var registeredClass = findRegisteredClass_(jsClass);
        if (registeredClass) {
          cssClass = registeredClass.cssClass;
        }
      }

      var elements = document.querySelectorAll('.' + cssClass);
      for (var n = 0; n < elements.length; n++) {
        upgradeElementInternal(elements[n], jsClass);
      }
    }
  }


  /**
   * Upgrades a specific element rather than all in the DOM.
   * @param {HTMLElement} element The element we wish to upgrade.
   * @param {string} jsClass The name of the class we want to upgrade
   * the element to.
   */
  function upgradeElementInternal(element, jsClass) {
    if (jsClass === undefined) {
      for (var i = 0; i < registeredComponents_.length; i++) {
        var elemClasses = element.getAttribute('class').split(' ');
        if (elemClasses.indexOf(registeredComponents_[i].cssClass) >= 0) {
          upgradeElementInternal(element, registeredComponents_[i].className);
        }
      }
      return;
    }
    // Only upgrade elements that have not already been upgraded for the given
    // Class type. This allows you to upgrade an element with multiple classes.
    var dataUpgraded = element.getAttribute('data-upgraded');
    if (dataUpgraded === null || dataUpgraded.indexOf(jsClass) === -1) {
      // Upgrade element.
      if (dataUpgraded === null) {
        dataUpgraded = '';
      }
      element.setAttribute('data-upgraded', dataUpgraded + ',' + jsClass);
      var registeredClass = findRegisteredClass_(jsClass);
      if (registeredClass) {
        createdComponents_.push(new registeredClass.classConstructor(element));
        // Call any callbacks the user has registered with this component type.
        registeredClass.callbacks.forEach(function (callback) {
          callback(element);
        });
      } else {
        // If component creator forgot to register, try and see if
        // it is in global scope.
        createdComponents_.push(new window[jsClass](element));
      }
    }
  }


  /**
   * Registers a class for future use and attempts to upgrade existing DOM.
   * @param {object} config An object containting:
   * {constructor: Constructor, classAsString: string, cssClass: string}
   */
  function registerInternal(config) {
    var newConfig = {
      'classConstructor': config.constructor,
      'className': config.classAsString,
      'cssClass': config.cssClass,
      'callbacks': []
    };

    var found = findRegisteredClass_(config.classAsString, newConfig);

    if (!found) {
      registeredComponents_.push(newConfig);
    }

    upgradeDomInternal(config.classAsString, config.cssClass);
  }


  /**
   * Allows user to be alerted to any upgrades that are performed for a given
   * component type
   * @param {string} jsClass The class name of the MDL component we wish
   * to hook into for any upgrades performed.
   * @param {function} callback The function to call upon an upgrade. This
   * function should expect 1 parameter - the HTMLElement which got upgraded.
   */
  function registerUpgradedCallbackInternal(jsClass, callback) {
    var regClass = findRegisteredClass_(jsClass);
    if (regClass) {
      regClass.callbacks.push(callback);
    }
  }


  /**
   * Upgrades all registered components found in the current DOM. This is
   * automatically called on window load.
   */
  function upgradeAllRegisteredInternal() {
    for (var n = 0; n < registeredComponents_.length; n++) {
      upgradeDomInternal(registeredComponents_[n].className);
    }
  }


  // Now return the functions that should be made public with their publicly
  // facing names...
  return {
    upgradeDom: upgradeDomInternal,
    upgradeElement: upgradeElementInternal,
    upgradeAllRegistered: upgradeAllRegisteredInternal,
    registerUpgradedCallback: registerUpgradedCallbackInternal,
    register: registerInternal
  };
})();


window.addEventListener('load', function() {
  'use strict';

  componentHandler.upgradeAllRegistered();
});
