import React from 'react';
import moment from 'moment';

function ActivityRow({ activity }) {
  return (<div className="row activity-row">
    <div className="large-12 columns clearfix">
      <div className="time right" title={activity.startTime}>
        {moment(activity.startTime).fromNow()}
      </div>
      <div className="title">{activity.type ? activity.type : 'Untitled'}</div>
      <div className="meta">
        <span className="distance">{`${(activity.distance / 1000).toFixed(2)} km`}</span>
        <span className="duration">
          {`${moment.duration(activity.duration, 'seconds').humanize()}`}
        </span>
      </div>
    </div>
  </div>);
}

ActivityRow.propTypes = {
  activity: React.PropTypes.object,
};

export default ActivityRow;
