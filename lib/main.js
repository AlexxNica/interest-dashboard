/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const {Controller} = require("Controller");
const {StudyApp} = require("Application");
const {InterestSignal} = require("InterestSignal");

exports.main = function(options, callbacks) {
  let controller = new Controller(options);
  StudyApp.init(controller);
  StudyApp.start(options);
};

exports.onUnload = function (reason) {
  StudyApp.unload(reason);
};
