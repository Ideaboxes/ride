import React, { Component } from 'react';
import { Link } from 'react-router';

class Navigation extends Component {
  userMenu() {
    let menu = (
    <ul className="menu">
      <li className="menu-text"><Link to="/login">Login</Link></li>
    </ul>
    );

    if (this.props.user) {
      menu = (
        <ul className="menu">
          <li className="menu-text"><Link to="/profile">Profile</Link></li>
          <li className="menu-text"><a href="/v1/users/logout.json">Logout</a></li>
        </ul>
        );
    }
    return menu;
  }

  render() {
    return (
      <div className="top-bar navigation">
        <div className="top-bar-left">
          <ul className="menu">
            <li className="menu-text"><Link to="/">Flame</Link></li>
          </ul>
        </div>
        <div className="top-bar-right">
          {this.userMenu()}
        </div>
      </div>);
  }
}

Navigation.propTypes = {
  user: React.PropTypes.object,
};


export default Navigation;
