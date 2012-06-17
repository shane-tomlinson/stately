/*jshint browsers:true, forin: true, laxbreak: true */
/*global test: true, start: true, module: true, ok: true, equal: true, BrowserID: true */
/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
(function() {
  "use strict";

  var bid = Stately,
      Command = bid.Command;

  module("shared/command", {
    setup: function() {
    },

    teardown: function() {
    }
  });

  asyncTest("run - options passed to callback", function() {
    var cmd = Command.create({
      callback: function(options) {
        equal(options.item, "value", "correct options sent");
        start();
      },
      options: {
        item: "value"
      }
    });

    cmd.run();
  });

  asyncTest("storeMomento, run - options extended, passed to callback", function() {
    var cmd = Command.create({
      callback: function(options, momento) {
        equal(momento.item, "value", "correct options sent");
        start();
      }
    });

    cmd.storeMomento({ item: "value" });
    cmd.run();
  });
}());
