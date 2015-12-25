import React from 'react'
import { Link } from 'react-router'

class Login extends React.Component {

  constructor(props) {
    super(props)

    this.state = {}
  }

  login(event) {
    event.preventDefault()

    fetch('/users/login', {
      method: 'post',
      body: this.refs.form,
      credential: 'include'
    }).then(res => res.json())
      .then(json => {
        console.log (json)
      })
      .catch(err => {
        console.error (err)
      })
  }

  render() {
    return (
      <form className="login" onSubmit={this.login.bind(this)}>

        <div className="row">
          <div className="small-offset-4 small-4 columns">
            <label>
              Email
              <input type="email" placeholder="Email" name="email"></input>
            </label>

            <label>
              Password
              <input type="password" placeholder="Password" name="password"></input>
            </label>

            <button type="submit">Login</button>
            <Link to='/register'>Register</Link>
          </div>
        </div>

      </form>
      )
  }

}

export default Login
