import React, { Component } from 'react'
import { connect } from 'react-redux'

import Navigation from './navigation'

function select(state) {
  return {
    user: state.user
  }
}

class Application extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    // Injected by connect() call:
    const { dispatch, user } = this.props

    return (
      <div className='container'>
        <Navigation user={user} />
        {this.props.children}
      </div>
      )
  }
}

export default connect(select)(Application)
