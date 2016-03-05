import React, { Component } from 'react';
import { connect } from 'react-redux';

class Profile extends Component {
  linkFitbitAccount() {
    open('/v1/fitbit/link.json', '_blank');
  }

  unlinkFitbitAccount() {
    console.log('unlink account');
  }

  render() {
    let userServices = this.props.user.services.map(item => item.name);
    let fitbitLink = userServices.includes('fitbit') ?
      <a onClick={this.unlinkFitbitAccount}>Unlink Fitbit account</a> :
      <a onClick={this.linkFitbitAccount}>Link Fitbit account</a>;

    return (<form className="profile" method="post" action="/v1/users/update.json">

      <div className="row">
        <div className="small-offset-4 small-4 columns">
          <label>
            Email
            <input name="email"
              form="registerForm"
              type="email"
              placeholder="Email"
              required
            ></input>
          </label>

          <label>
            Password
            <input name="password"
              form="registerForm"
              type="password"
              placeholder="Password"
              required
            ></input>
          </label>

          <hr />

          <ul>
            <li>{fitbitLink}</li>
            <li>Link Strava account</li>
          </ul>

          <button type="submit">Update</button>
        </div>
      </div>

    </form>);
  }
}

Profile.propTypes = {
  user: React.PropTypes.object,
};

export default connect(
  state => ({ user: state.user })
  )(Profile);
