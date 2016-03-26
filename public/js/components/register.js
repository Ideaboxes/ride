import React from 'react';

export default () => (
  <form className="register" method="post" action="/v1/users/register.json">
    <div className="row">
      <div className="small-offset-4 small-4 columns">
        <label>
          Email
          <input name="email"
            type="email"
            placeholder="Email"
            required
          ></input>
        </label>

        <label>
          Password
          <input name="password"
            type="password"
            placeholder="Password"
            required
          ></input>
        </label>

        <button>Register</button>
      </div>
    </div>
  </form>);
