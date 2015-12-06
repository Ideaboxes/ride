import React from 'react'

import Navigation from './navigation'

export default ({ children }) => (
  <div className="container">
    <Navigation />
    {children}
  </div>
  )
