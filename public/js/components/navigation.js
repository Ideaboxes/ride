import React, { Component } from 'react'
import { Link } from 'react-router'

class Navigation extends Component {

  constructor(props) {
    super(props)
  }

  render() {
    let userMenu = (
    <ul className='menu'>
      <li className='menu-text'><Link to='/login'>Login</Link></li>
    </ul>
    )
    if (this.props.user) {
      userMenu = (
        <ul className='menu'>
          <li className='menu-text'><Link to='/profile'>Profile</Link></li>
          <li className='menu-text'><a href='/v1/users/logout.json'>Logout</a></li>
        </ul>
        )
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
