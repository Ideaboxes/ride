import React, { Component } from 'react';

class Profile extends Component {

  constructor(props) {
    super(props);
  }

  linkFitbitAccount() {
    open('/v1/fitbit/link.json', '_blank');
  }

  render() {
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

          <hr/>

          <ul>
            <li><a onClick={this.linkFitbitAccount}>Link Fitbit account</a></li>
            <li>Link Strava account</li>
          </ul>

          <button type="submit">Update</button>
        </div>
      </div>

    </form>);
  }

}

export default Profile;
