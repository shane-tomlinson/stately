# Stately - A W3C History API inspired state machine micro-library

## Simple Example Usage
```
// Create a state machine
var stateMachine = Stately.StateMachine.create();

// Start a state with a set of options.
stateMachine.gotoState(function(options, momento) { /* callback code */, origOptions);

// save a momento for when the first state is restored due to a popState.
stateMachine.storeMomento(momento);

// Start a second state with a set of options.
stateMachine.gotoState(function(options, momento) { /* callback code */, otherOptions);

// go back to first state. first state callback will be called with origOptions
// and momento.
stateMachine.popState();

// replace the state on the state machine.
stateMachine.replaceState(function(options, momento) { /* callback code */, replacementOptions);
stateMachine.storeMomento(replacementMomento);

stateMachine.gotoState(....);

// call the replacement state with replacementOptions and replacementMomento
stateMachine.popState();

stateMachine.gotoState(function(options, momento) { /* callback code */,

// continue the current state - it is like this state does not exist for the
// purposes of popState.
stateMachine.continueState(function(options, momento) { /* callback code */, continueOptions);

// go back to the replacementState
stateMachine.popState();
```

## Building a version
1. If not already installed, install uglifyjs (https://github.com/mishoo/UglifyJS)
2. Run ./build.sh

## Inspiration
I wrote the original version of this for the BrowserID [https://github.com/mozilla/browserid/] project.

## License
Mozilla Public License (MPL) 2.0

## Author
* Shane Tomlinson
* @shane_tomlinson
* shane@shanetomlinson.com
* set117@yahoo.com
* stomlinson@mozilla.com
* http://shanetomlinson.com
