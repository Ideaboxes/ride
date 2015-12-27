import React, { Component } from 'react'
import { Link } from 'react-router'

class Navigation extends Component {

  constructor(props) {
    super(props)

    this.state = { loading: true, user: null }

    fetch('/users/me', { credentials: 'include' })
      .then(data => data.json())
      .then(json => {
        let user = null
        if (json.user) {
          user = json.user
        }
        this.setState({ loading: false, user: user })
      })
  }

  render() {
    let userMenu = null
    if (!this.state.loading) {
      userMenu = (
        <ul className='menu'>
          <li className='menu-text'><Link to='/login'>Login</Link></li>
        </ul>
        )
      if (this.state.user) {
        userMenu = (
          <ul className='menu'>
            <li className='menu-text'><Link to='/profile'>Profile</Link></li>
            <li className='menu-text'><a href='/users/logout'>Logout</a></li>
          </ul>
          )
      }
    }

    return (
      <div className='top-bar navigation'>
        <div className='top-bar-left'>
          <ul className='menu'>
            <li className='menu-text'>Flame</li>
          </ul>
        </div>
        <div className='top-bar-right'>
          {userMenu}
        </div>
      </div>)
  }

}


export default Navigation
