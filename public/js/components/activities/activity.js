import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
// import Chart from 'chart.js';

import { Link } from 'react-router';

import AwesomeIcon from '../awesome-icon';
import { MAP_ID } from '../../config';

class Activity extends Component {
  componentDidMount() {
    let mapElement = this.refs.map;
    this.map = L.mapbox.map(mapElement, MAP_ID);
  }

  toggleMore() {
    let expand = !this.state.expand;
    this.setState({ expand });
  }

  activityGraph() {
    if (!this.state.expand) return null;

    return (
      <div className="row">
        <canvas ref="chart" className="small-12 columns chart"></canvas>
      </div>);
  }

  render() {
    let activityStyle = {
      flex: 1,
      display: 'flex',
      alignItems: 'stretch',
      flexDirection: 'column',
    };
    let mapStyle = { flex: 1 };
    let metaStyle = {};
    let activityNameStyle = { marginLeft: '6px' };

    let activity = this.props.activity;
    let distanceText = `${(activity.distance / 1000).toFixed(2)} km`;
    let durationText = `${moment.duration(activity.duration, 'seconds').humanize()}`;
    let maxSpeed = `${activity && activity.max_speed.toFixed(2)} kph`;
    let avgSpeed = `${activity && activity.average_speed.toFixed(2)} kph`;

    let expandLink = (<a onClick={this.toggleMore}>more</a>);
    if (this.state.expand) {
      expandLink = (<a onClick={this.toggleMore}>hide</a>);
    }

    return (<div className="activity" style={activityStyle}>

        <div ref="map" style={mapStyle}></div>
        <div style={metaStyle}>
          <div className="row">
            <div className="small-12 columns">
              <h3>
                <Link to="/">
                  <AwesomeIcon icon="angle-double-left" />
                </Link>
                <span className="activity-name" style={activityNameStyle}>
                  {activity.type}
                </span>
              </h3>
            </div>
          </div>

          <div className="row">
            <div className="small-4 columns">
              <label>Distance</label> {distanceText}
            </div>
            <div className="small-4 columns">
              <label>Duration</label> {durationText}
            </div>
            <div className="small-4 columns">
              <label>When</label> {moment(activity.start_time).calendar()}
            </div>
          </div>

          <div className="row">
            <div className="small-4 columns">
              <label>Max Speed</label> {maxSpeed}
            </div>

            <div className="small-4 columns">
              <label>Average Speed</label> {avgSpeed}
            </div>

            <div className="small-4 columns">
              <label>Actions</label>

              {expandLink}
            </div>
          </div>

          {this.activityGraph()}

        </div>
      </div>);
  }
}

Activity.propTypes = {
  activity: React.PropTypes.object,
};

export default connect(
  state => ({ activity: state.activity }))(Activity);
