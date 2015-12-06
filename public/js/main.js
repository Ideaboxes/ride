'use strict'

import React from 'react'
import { render } from 'react-dom'
import { Router, Route, IndexRoute } from 'react-router'

import Application from './components/application'
import Map from './components/map'

render((
  <Router>
    <Route path='/' component={Application}>
      <IndexRoute component={Map} />
    </Route>
  </Router>
  ), document.getElementById("application"))
