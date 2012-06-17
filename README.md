# Stately - A W3C History API inspired state (undo) micro-library

Stately is a microlibrary to keep a state machine with undo capabilities. It is similar to the W3C History API with more flexibility and no URL rewrites. While some web puritsts argue that a change in application state should be reflected in its URL, this is not always needed or even desired.

Stately provides mechanisms to start a state, replace a state, start "ephemeral" states, and pop a state. There are currently no mechanisms to redo once a popState occurs.

## Simple Usage
```
// Create a state machine
var stateMachine = Stately.StateMachine.create();

// first state: Start a state with a set of options.
stateMachine.startState(function(options, momento) { /* callback code */ }, origOptions);

// save a momento for when the first state is restored due to a popState.
stateMachine.storeMomento(momento);

// second state: Start a second state with a set of options.
stateMachine.startState(function(options, momento) { /* callback code */ }, otherOptions);

// go back to first state. first state callback will be called with origOptions
// and momento.
stateMachine.popState();
```


## Advanced Usage

### Mark a State as Non-Savable
Sometimes it is desired to start a state, but it is known ahead of time that the state should not be saved in history.  This can be accomplished by calling startState with its first parameter set to false.
```
// original state:
stateMachine.startState(function(options, momento) { /* callback code */ }, origOptions);

// not saved state: start a state marking it non-savable.
stateMachine.startState(false, notSavedStateCallback);

// momento is saved to a state that will not be stored.
stateMachine.storeMomento(momento);

// popped state: start a new state without saving not saved state
stateMachine.startState(stateCallback);

// goes back to original state.
stateMachine.popState();
```

### Replace a State
It is possible to replace the current state using the replaceState command.  This replace the previously started state completely, ignoring any savable options or momentos that were set.

```
// original state:
stateMachine.startState(...);

// replaced state: replaced in the stack by replacement state.
stateMachine.startState(...);

// replacement state: replace the state on the state machine.
stateMachine.replaceState(...);

// popped state: used to show how replacement state works.
stateMachine.startState(....);

// call the replacement state
stateMachine.popState();

// call original state.
stateMachine.popState();
```

### Start an Ephemeral State
Sometimes it is necessary to start a state that is not in any way part of the history. These ephemeral states can be started by calling ephemeralState.
```
// original state:
stateMachine.startState(...);

// popped state:
stateMachine.startState(...);

// ephemeral state: it is like this state does not exist for the purposes of
// popState.
stateMachine.ephemeralState(...);

// momento is stored on popped state.
stateMachine.storeMomento(momento);

// goes back to the original state.
stateMachine.popState();
```

### How is an ephemeralState different from a non-savable State?
Ephemeral and non-savable states are similar but serve very different purposes. An ephemeral state *is not in any way* part of history. In contrast, a state marked as non-savable *is* temporarily at the head of history. This difference has major repercussions for popState. If the current state is marked as non-savable and popState is called, the previous state in history is called. If the current state is ephemeral and popState is called, in effect two states ago will be started.

#### Non-Savable State

```
// original state:
stateMachine.startState(...);

// non-savable state:
stateMachine.startState(false, ...);

// Go back to original state.
stateMachine.popState();
```

#### Ephemeral State
```
// original state:
stateMachine.startState(...);

// popped state:
stateMachine.startState(...);

// ephemeral state: not part of history in any way.
stateMachine.ephemeralState(...);

// Go back to original state.
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
