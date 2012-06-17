window.Stately = {};

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */


(function(ns) {
  function create(constr, config) {
    var inst = new constr;
    inst.init(config);
    return inst;
  }

  function extend(sup, extension) {
    // No superclass
    if(!extension) {
      extension = sup;
      sup = null;
    }

    var subclass = extension.hasOwnProperty("constructor") ? extension.constructor : function() {};

    if(sup) {
      // there is a superclass, set it up.
      // Object.create would work well here.
      var F = function() {};
      F.prototype = sup.prototype;
      subclass.prototype = new F;
      subclass.sc = sup.prototype;
    }
    else {
      // no superclass, create a prototype object.
      subclass.prototype = {};
    }

    for(var key in extension) {
      subclass.prototype[key] = extension[key];
    }
    subclass.prototype.constructor = subclass;

    /**
     * Extend a class to create a subclass.
     * @method extend
     * @param {object} extensions - prototype extensions
     * @returns {function} subclass
     */
    subclass.extend = extend.bind(null, subclass);
    /**
     * Create an instance of a class
     * @method create
     * @param {object} [config] - configuration, passed on to init.
     */
    subclass.create = create.bind(null, subclass);

    return subclass;
  }

  ns.Class = extend;

}(Stately));

/*globals Stately: true */
/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
(function(ns) {
  "use strict";

  ns.Command = ns.Class({
    init: function(options) {
      if (!options.callback) {
        throw "callback required";
      }
      this.callback = options.callback;
      this.options = options.options || {};
    },

    run: function() {
      this.callback(this.options, this.momento);
    },

    storeMomento: function(momento) {
      this.momento = momento;
    }
  });

  return ns.Command;
}(Stately));

/*jshint browser:true, jQuery: true, forin: true, laxbreak:true */
/*globals Stately: true, _:true */
/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

(function(ns) {
  "use strict";

  var Command = ns.Command;

  function createState(callback, options, saveable) {
    var cmd = Command.create({
      callback: callback,
      options: options
    });
    cmd.saveable = saveable;
    return cmd;
  }

  ns.StateMachine = ns.Class({
    init: function() {
      this.history = [];
      this.subscriptions = [];
    },

    storeMomento: function(momento) {
      if (!this.currentState) throw "no current state to store momento";

      this.currentState.storeMomento(momento);
    },

    gotoState: function(saveable, callback, options) {
      if (typeof saveable !== "boolean") {
        options = callback;
        callback = saveable;
        saveable = true;
      }

      // save the current state when a new state comes in.
      var cmd = this.currentState;
      if (cmd && cmd.saveable) {
        this.history.push(cmd);
      }

      cmd = this.currentState = createState(callback, options, saveable);
      cmd.run();
    },

    replaceState: function(saveable, callback, options) {
      if (!this.currentState) throw "no current state to replace";

      if (typeof saveable !== "boolean") {
        options = callback;
        callback = saveable;
        saveable = true;
      }

      var cmd = this.currentState = createState(callback, options, saveable);
      cmd.run();
    },

    continueState: function(callback, options) {
      if (!this.currentState) throw "no current state to continue";

      var cmd = createState(callback, options, false);
      cmd.run();
    },

    popState: function() {
      var cmd = this.history.pop();

      if (!cmd) throw "empty history, cannot popState";

      if(cmd.saveable) this.currentState = cmd;
      cmd.run();
    }
  });

}(Stately));
