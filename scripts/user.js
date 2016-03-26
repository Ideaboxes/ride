'use strict';
require('dotenv').load();

let moment = require('moment');
let request = require('request');

let User = require('../app/models/user');
let Activity = require('../app/models/activity');

let listUser = () => {
  User.findAll()
    .then(users => users[0].getServices())
    .then(services =>
      new Promise((resolve, reject) => {
        if (services.length === 0) return;
        services.forEach(service => {
          let date = new Date();
          let beforeDate = moment(date).add(1, 'd').format('YYYY-MM-DD');

          request.get({
            url: 'https://api.fitbit.com/1/user/-/activities/list.json',
            headers: {
              Authorization: `Bearer ${service.accessToken}`,
            },
            qs: { beforeDate, offset: 0, limit: 20, sort: 'desc' },
            json: true,
          }, (error, result, body) => {
            if (error) return reject(error);
            return resolve(body);
          });
        });
      }))
    .then(body => {
      let activities = body.activities;
      let pagination = body.pagination;

      console.log(pagination);
      return Promise.all(activities.map(activity =>
        Activity.create({
          logID: activity.logId,
          loaded: false,
          distance: activity.distance,
          duration: activity.duration,
          startTime: activity.startTime,
        })));
    })
    .then(activities => {
      console.log(activities);
    });
};

listUser();
