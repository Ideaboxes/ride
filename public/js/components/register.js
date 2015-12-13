import React from 'react'

export default () => (
  <form className="register" action="/users/register" method="post">

    <div className="row">
      <div className="small-offset-4 small-4 columns">
        <label>
          Username
          <input name="username" type="text" placeholder="Username"></input>
        </label>

        <label>
          Password
          <input name="password" type="Password" placeholder="Password"></input>
        </label>

        <button>Register</button>
      </div>
    </div>

  </form>)
