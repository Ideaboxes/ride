import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchUserActivities } from '../../actions';

import ActivityRow from './activity-row';
import NoActivityRow from './no-activities-row';
// import LoadingRow from './loading-row';

class Activities extends Component {

  componentWillMount() {
    this.props.onFetchUserActivities();
  }

  getActivities() {
    return this.props.activities.length > 0 ?
      this.props.activities.map(activity => (<li><ActivityRow activity={activity} /></li>)) :
        [<li key="-1"><NoActivityRow /></li>];
  }

  render() {
    return (
      <div className="activities">
        <div className="row">
          <div className="medium-offset-7 medium-4 columns list-box">
            <ul>{this.getActivities()}</ul>
          </div>
        </div>
      </div>
    );
  }
}

Activities.propTypes = {
  activities: React.PropTypes.array,
  onFetchUserActivities: React.PropTypes.func,
};

export default connect(
  state => ({ activities: state.activities }),
  (dispatch) => ({
    onFetchUserActivities: () => dispatch(fetchUserActivities()),
  })
  )(Activities);
