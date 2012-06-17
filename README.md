# Stately - A W3C History API inspired state (undo) micro-library

Stately is a microlibrary to keep a state machine with undo capabilities. It is similar to the W3C History API with more flexibility and no URL rewrites. While some web puritsts argue that a change in application state should be reflected in its URL, this is not always needed or even desired.

Stately provides mechanisms to start a state, replace a state, start "ephemeral" states, and pop a state. There are currently no mechanisms to redo once a popState occurs.

## Simple Usage
```
// Create a state machine
var stateMachine = Stately.StateMachine.create();

// first state: Start a state with a set of options.
stateMachine.startState(function(options, momento) { /* callback code */, origOptions);

// save a momento for when the first state is restored due to a popState.
stateMachine.storeMomento(momento);

// second state: Start a second state with a set of options.
stateMachine.startState(function(options, momento) { /* callback code */, otherOptions);

// go back to first state. first state callback will be called with origOptions
// and momento.
stateMachine.popState();
```


## Advanced Usage

### Mark a State as Non-Savable
Sometimes it is desired to start a state, but it is known ahead of time that the state should not be saved in history.  This can be accomplished by calling startState with its first parameter set to false.
```
// original state:
stateMachine.startState(function(options, momento) { /* callback code */, origOptions);

// not saved state: start a state marking it non-savable.
stateMachine.startState(false, notSavedStateCallback);

// last state: start a new state without saving notSavedStateCallback
stateMachine.startState(stateCallback);

// goes back to original state.
stateMachine.popState();
```

### Replace a State
It is possible to replace the current state using the replaceState command.  This replace the previously started state completely, ignoring any savable options or momentos that were set.

```
// original state: This is replaced in the stack by replacement state.
stateMachine.startState(function(options, momento) { /* callback code */, origOptions);

// replacement state: replace the state on the state machine.
stateMachine.replaceState(function(options, momento) { /* callback code */, replacementOptions);

// last state:
stateMachine.startState(....);

// call the replacement state
stateMachine.popState();
```

### Start a New State as If It Did Not Exist (Ephemeral States).
Sometimes it is necessary to start a state that is not in any way part of the history. These ephemeral states can be started by calling startState.
```
// original state:
stateMachine.startState(function(options, momento) { /* callback code */, origOptions);

// second state:
stateMachine.startState(function(options, momento) { /* callback code */,

// ephemeral state: it is like this state does not exist for the purposes of
// popState.
stateMachine.ephemeralState(function(options) { /* callback code */, continueOptions);

// momento is stored on second state.
stateMachine.storeMomento(momento);

// goes back to the original state.
stateMachine.popState();
```


## Building a version
1. If not already installed, install Google Closure compiler (http://closure-compiler.googlecode.com/files/compiler-latest.zip) and make it executable(https://gist.github.com/739724/ee4b7f60a9838ba9ad5370e703131d6394602fed)
2. Run ./build.sh

## Inspiration
I wrote the original version of BrowserID [https://github.com/mozilla/browserid/].

## License
Mozilla Public License (MPL) 2.0

## Author
* Shane Tomlinson
* @shane_tomlinson
* shane@shanetomlinson.com
* set117@yahoo.com
* stomlinson@mozilla.com
* http://shanetomlinson.com
