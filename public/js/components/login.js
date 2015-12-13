import React from 'react'
import { Link } from 'react-router'

class Login extends React.Component {

  constructor(props) {
    super(props)

    this.state = {}
  }

  render() {
    return (
      <div className="login">

        <div className="row">
          <div className="small-offset-4 small-4 columns">
            <label>
              Username
              <input type="text" placeholder="Username"></input>
            </label>

            <label>
              Password
              <input type="Password" placeholder="Password"></input>
            </label>

            <button>Login</button>
            <Link to='/register'>Register</Link>
          </div>
        </div>

      </div>
      )
  }

}

export default Login
