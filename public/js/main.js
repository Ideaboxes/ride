'use strict'

import React from 'react'
import { render } from 'react-dom'
import { Router, Route, IndexRoute } from 'react-router'

import Application from './components/application'
import Map from './components/map'
import Login from './components/login'
import Register from './components/register'

render((
  <Router>
    <Route path='/' component={Application}>
      <IndexRoute component={Map} />
      <Route path='login' component={Login} />
      <Route path='register' component={Register} />
    </Route>
  </Router>
  ), document.getElementById("application"))
