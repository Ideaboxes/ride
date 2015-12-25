import React, { Component } from 'react'

class Register extends Component {

  constructor(props) {
    super(props)
  }

  register(event) {
    event.preventDefault()

    console.log (new FormData(this.refs.form))

    fetch('/users/register', {
      method: 'post',
      body: new FormData(this.refs.form),
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
    return (<form ref='form' id='registerForm' className='register' action="/users/register">

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
