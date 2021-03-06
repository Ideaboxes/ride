'use strict';
require('dotenv').load();

let moment = require('moment');
let request = require('request');
let parse = require('xml-parser');
let log = require('../app/log');

let User = require('../app/models/user');
let Activity = require('../app/models/activity');

let listUser = () => {
  let fitbit;
  let user;
  User.findAll()
    .then(users => {
      user = users[0];
      return user.getServices();
    })
    .then(services =>
      new Promise((resolve, reject) => {
        if (services.length === 0) return;
        services.forEach(service => {
          fitbit = service;

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

      log.log('pagination data', pagination);
      return Promise.all(activities.map(activity =>
        Activity.create({
          logId: activity.logId,
          loaded: false,
          distance: activity.distance,
          duration: activity.duration,
          startTime: activity.startTime,
        })));
    })
    .then(activities =>
      Promise.all(activities.map(activity =>
        new Promise((resolve, reject) => {
          log.info('requesting', activity.logId);
          request.get({
            url: `https://api.fitbit.com/1/user/-/activities/${activity.logId}.tcx`,
            headers: {
              Authorization: `Bearer ${fitbit.accessToken}`,
            },
          }, (error, result, body) => {
            if (error) return reject(error);
            return resolve(body);
          });
        })))
      .then(tcxs => {
        log.info('loading tcxs');
        return new Promise(resolve => {
          let loadActivity = index => {
            log.info(`Load ${index}`);
            if (index < tcxs.length) {
              activities[index].load(Activity.hashFromXml(parse(tcxs[index])))
                .then(() => {
                  log.info(`Add activity ${index}`);
                  return user.addActivity(activities[index]);
                })
                .then(() => {
                  log.info(`Next activity ${index + 1}`);
                  loadActivity(index + 1);
                })
                .catch(error => {
                  log.info(`Error, Next activity ${index + 1}`, error);
                  loadActivity(index + 1);
                });
              return;
            }
            resolve();
            return;
          };

          loadActivity(0);
        });
      }))
    .then(() => user.getActivities())
    .then(activities => {
      log.log('User activities length', activities.length);
    })
    .catch(error => {
      log.error(error);
    });
};

listUser();
