'use strict';

let Activity = require('../../../app/models/activity');

global.createActivity = () =>
  Activity.create({
    logId: new Date().getTime(),
    loaded: false,
    distance: 10.23,
  });
