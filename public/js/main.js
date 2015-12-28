'use strict'

import React from 'react'
import { render } from 'react-dom'
import { Router, Route, IndexRoute } from 'react-router'
import { createStore } from 'redux'
import { Provider } from 'react-redux'

import Application from './components/application'
import Map from './components/map'
import Login from './components/login'
import Register from './components/register'
import Profile from './components/profile'

import Main from './reducers/application'
import * as Actions from './actions'

let store = createStore(Main)

// TODO: Initial this on server side
fetch('/v1/users/me.json', { credentials: 'include' })
  .then(data => data.json())
  .then(json => {
    if (json.user) {
      store.dispatch(Actions.setUser(json.user))
    }

    render((
      <Provider store={store}>
        <Router>
          <Route path='/' component={Application}>
            <IndexRoute component={Map} />
            <Route path='login' component={Login} />
            <Route path='register' component={Register} />

            <Route path='profile' component={Profile} />
          </Route>
        </Router>
      </Provider>
      ), document.getElementById('application'))
  })
