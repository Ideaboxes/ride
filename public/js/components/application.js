import React, { Component } from 'react';
import { connect } from 'react-redux';

import Navigation from './navigation';

function select(state) {
  return { user: state.user };
}

class Application extends Component {
  render() {
    // Injected by connect() call:
    const { children, user } = this.props;

    return (
      <div className="container">
        <Navigation user={user} />
        {children}
      </div>
      );
  }
}

Application.propTypes = {
  children: React.PropTypes.object,
  user: React.PropTypes.object,
};

export default connect(select)(Application);
