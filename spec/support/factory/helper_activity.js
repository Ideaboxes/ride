'use strict';

let Activity = require('../../../app/models/activity');

global.createActivity = () =>
  Activity.create({
    logId: 1,
    loaded: false,
    distance: 10.23,
  });
