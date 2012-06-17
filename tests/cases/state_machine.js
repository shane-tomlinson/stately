/*jshint browser:true, jQuery: true, forin: true, laxbreak:true */
/*globals BrowserID: true, _:true */
/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
(function() {
  "use strict";

  var bid = Stately,
      StateMachine = bid.StateMachine,
      stateMachine,
      mediator = bid.Mediator;

  function Callback() {
    var proxy = function() {
      proxy.called++;
      proxy.args = [].slice.call(arguments, 0);
    };
    proxy.called = 0;

    return proxy;
  }


  module("shared/state_machine", {
    setup: function() {
      stateMachine = StateMachine.create();
      stateMachine.start();
    },
    teardown: function() {
      stateMachine.destroy();
    }
  });

  test("gotoState with implied save - call callback", function() {
    var state = new Callback();

    // Call the state callback with the string passed as the first argument
    // to the callback.
    stateMachine.gotoState(state, "argument");

    equal(state.called, 1, "state called");
    equal(state.args[0], "argument", "argument passed to state callback as first argument");
  });

  test("storeMomento, popState - takes state off stack and runs it", function() {
    var origState = new Callback();

    // run the original state.
    stateMachine.gotoState(origState);

    // store a momento on the object.  When state called again after popState,
    // momento is passed to callback as second argument.
    stateMachine.storeMomento("momento");

    // goto a new state, saves origState for when the next popState occurs.
    stateMachine.gotoState(new Callback());

    // pop an item off the stack and return to the previous state.
    stateMachine.popState();

    equal(origState.called, 2, "origState called a second time after popState");
    equal(origState.args[1], "momento", "momento passed to state callback as second argument");
  });

  test("gotoState with explicit save=false - do not save to stack", function() {
    var savedState = new Callback(),
        notSavedState = new Callback();

    stateMachine.gotoState(savedState);

    // This will not go on the stack when the next state is added.
    stateMachine.gotoState(false, notSavedState);

    // This will never go on the stack.
    stateMachine.gotoState(new Callback());

    // This should go back to savedState
    stateMachine.popState();

    equal(notSavedState.called, 1, "notSavedState only called once for gotoState");
    equal(savedState.called, 2, "origState called twice, middle state not saved");
  });

  test("multiple calls to gotoState save states to stack correctly", function() {
    var state = new Callback();

    stateMachine.gotoState(state);

    // First item should go on stack.
    stateMachine.gotoState(function() {});

    // Original state should be run, no items on stack.
    stateMachine.popState();

    // original state on stack.
    stateMachine.gotoState(function() {});

    // After this, no items should be on stack, first item should be run.
    stateMachine.popState();

    equal(state.called, 3, "original state run 3 times");
  });

  test("replaceState replaces the current state, used for popState", function() {
    var origState = new Callback(),
        replacementState = new Callback();

    // Original state.
    stateMachine.gotoState(origState);

    // replace the original state on the stack.
    stateMachine.replaceState(replacementState);

    // Add a new state so we can call popState.
    stateMachine.gotoState(new Callback());

    // This goes back to the replacementState.
    stateMachine.popState();

    equal(origState.called, 1, "original only called once");
    equal(replacementState.called, 2, "replacement called twice");
  });

  test("continueState continues the current state, origState used for popState", function() {
    var origState = new Callback(),
        continueState = new Callback();

    // origState will be used for popState
    stateMachine.gotoState(origState);

    // a continuation of origState, ignored for popState
    stateMachine.continueState(continueState);

    stateMachine.gotoState(new Callback());

    // goes back to origState
    stateMachine.popState();

    equal(origState.called, 2, "origState called twice");
    equal(continueState.called, 1, "continueState called once");
  });
}());
