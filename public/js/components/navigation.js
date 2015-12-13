import React from 'react'
import { Link } from 'react-router'

export default () => (
  <div className="top-bar navigation">
    <div className="top-bar-left">
      <ul className="menu">
        <li className="menu-text">Flame</li>
      </ul>
    </div>
    <div className="top-bar-right">
      <ul className="menu">
        <li className="menu-text"><Link to="/login">Login</Link></li>
      </ul>
    </div>
  </div>
  )
