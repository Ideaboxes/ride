'use strict';

global.mockPointData = (params) => {
  let value = Object.assign({}, params, {
    time: '2016-01-25T08:52:55.000+08:00',
    latitude: '1.282346487045288',
    longitude: '103.84925305843353',
    distance: '9033.10418104543',
  });

  let hash = {
    name: 'Trackpoint',
    attributes: {},
    children: [
      { name: 'Time',
        attributes: {},
        children: [],
        content: value.time,
      },
      { name: 'Position',
        attributes: {},
        children:
        [{
          name: 'LatitudeDegrees',
          attributes: {},
          children: [],
          content: value.latitude },
        { name: 'LongitudeDegrees',
          attributes: {},
          children: [],
          content: value.longitude,
        }],
        content: '',
      },
      { name: 'AltitudeMeters',
        attributes: {},
        children: [],
        content: value.altitude },
    ],
    content: '' };

  if (value.distance) {
    hash.children.push({ name: 'DistanceMeters',
      attributes: {},
      children: [],
      content: value.distance });
  }

  if (value.heartrate) {
    hash.children.push({ name: 'HeartRateBpm',
      attributes: {},
      children: [
        { name: 'Value', attributes: {}, children: [], content: value.heartrate },
      ],
      content: '' });
  }
  return hash;
};
