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

    start: function(options) {
      options = options || {};
    },

    stop: function() {
      var subscription;

      while(subscription = this.subscriptions.pop()) {
        mediator.unsubscribe(subscription);
      }
    },

    destroy: function() {
      this.stop();
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
