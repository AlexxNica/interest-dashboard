"use strict";

const {storage} = require("sdk/simple-storage");
const {createNode} = require("streams/core");
const {DateUtils} = require("DateUtils");

let dailyInterestsSpout = createNode({
  identifier: "dailyInterestSpout",
  listenType: "interest",
  emitType: "dailyInterests",

  _storeInterest: function _DIS__storeInterest(host, visitDate, visitCount, namespace, type, interest) {
    if (!storage.dayBufferInterests) {
      storage.dayBufferInterests = {};
    }
    if (!storage.dayBufferInterests[visitDate]) {
      storage.dayBufferInterests[visitDate] = {};
    }
    if (!storage.dayBufferInterests[visitDate][type]) {
      storage.dayBufferInterests[visitDate][type] = {};
    }
    if (!storage.dayBufferInterests[visitDate][type][namespace]) {
      storage.dayBufferInterests[visitDate][type][namespace] = {};
    }
    if (!storage.dayBufferInterests[visitDate][type][namespace][interest]) {
      storage.dayBufferInterests[visitDate][type][namespace][interest] = {};
    }
    if (!storage.dayBufferInterests[visitDate][type][namespace][interest][host]) {
      storage.dayBufferInterests[visitDate][type][namespace][interest][host] = 0;
    }
    storage.dayBufferInterests[visitDate][type][namespace][interest][host] += visitCount;
  },

  ingest: function _DIS_ingest(message) {
    if (!message) {
      return
    }
    let {details, dateVisits} = message;
    let {host, visitDate, visitCount, namespace, results} = details;
    results.forEach(item => {
      let {type, interests} = item;
      interests.forEach(interest => {
        Object.keys(dateVisits).forEach(date => {
          this._storeInterest(host, date, dateVisits[date], namespace, type, interest);
        });
      });
    });
  },

  emitReady: function _DIS_emitReady() {
    let dates = Object.keys(storage.dayBufferInterests);

    // check that we have more than one. having only one may mean that we're
    // still adding interests for visits
    if (dates.length < 2) {
      return false;
    }

    // sort by dates, latest-first
    // return everything except latest day
    dates = dates.sort(function (a,b) {
      return parseInt(b) - parseInt(a);
    });
    let pushDays = dates.slice(1, dates.length);
    let pushData = {};
    for (let i=0; i < pushDays.length; i++) {
      let day = pushDays[i];
      pushData[day] = storage.dayBufferInterests[day];
      delete storage.dayBufferInterests[day];
    }
    this.results = pushData;

    if (this._emitCb) {
      this._emitCb(DateUtils.today() - dates[0]);
    }
    return true;
  },

  flush: function _DIS_flush() {
    let deferred = this.emitDeferred;
    if (this.results) {
      // invoked when emitReady
      deferred.resolve(this.results);
    }
    else {
      // invoked directly
      deferred.resolve(storage.dayBufferInterests);
    }
    this.clear();
    return deferred.promise;
  },

  clearStorage: function _DIS_clearStorage() {
    delete storage.dayBufferInterests;
  },

  setEmitCallback: function(cb) {
    this._emitCb = cb;
  }
});

exports.dailyInterestsSpout = dailyInterestsSpout;