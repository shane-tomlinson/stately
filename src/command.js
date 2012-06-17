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

