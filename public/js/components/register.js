import React, { Component } from 'react'

class Register extends Component {

  constructor(props) {
    super(props)
  }

  render() {
    return (<form className='register' method='post' action='/users/register'>

      <div className='row'>
        <div className='small-offset-4 small-4 columns'>
          <label>
            Email
            <input name='email' form='registerForm' type='email' placeholder='Email' required></input>
          </label>

          <label>
            Password
            <input name='password' form='registerForm' type='password' placeholder='Password' required></input>
          </label>

          <button>Register</button>
        </div>
      </div>

    </form>)
  }

}

export default Register
