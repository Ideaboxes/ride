import React, { Component } from 'react'

class Register extends Component {

  constructor(props) {
    super(props)
  }

  register(event) {
    event.preventDefault()

    fetch('/users/register', {
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
    return (<form ref='form' className='register' onSubmit={this.register.bind(this)}>

      <div className='row'>
        <div className='small-offset-4 small-4 columns'>
          <label>
            Username
            <input name='username' type='text' placeholder='Username' required></input>
          </label>

          <label>
            Password
            <input name='password' type='Password' placeholder='Password' required></input>
          </label>

          <button>Register</button>
        </div>
      </div>

    </form>)
  }

}

export default Register