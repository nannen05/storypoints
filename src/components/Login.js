import React, { Component } from 'react';
import { connect } from "react-redux";
import logo from '../logo.svg';
import '../App.css';
import * as actions from "../store/actions";
import { Link, withRouter } from 'react-router-dom'
import { auth, db } from '../firebase';

const byPropKey = (propertyName, value) => () => ({
  [propertyName]: value,
});

const INITIAL_STATE = {
  email: '',
  password: '',
  error: null,
};

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  componentDidMount() {
      
  }

  onSubmit = (e) => {
      const {
        email,
        password,
      } = this.state;

      const {
        history,
      } = this.props;

      auth.doSignInWithEmailAndPassword(email, password)
        .then(() => {
          this.setState({ ...INITIAL_STATE });
          history.push("/dashboard");
        })
        .catch(error => {
          this.setState(byPropKey('error', error));
        });

      e.preventDefault();
  }

  render() {

    const {
      email,
      password,
      error,
    } = this.state;

    const isInvalid =
      password === '' ||
      email === '';

    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Login</h2>
        </div>
        <p className="App-intro">
          To get started, login in using GMAIL.
        </p>
        <div className="App-login">
            <form onSubmit={this.onSubmit}>
              <input
                value={email}
                onChange={event => this.setState(byPropKey('email', event.target.value))}
                type="text"
                placeholder="Email Address"
              />
              <input
                value={password}
                onChange={event => this.setState(byPropKey('password', event.target.value))}
                type="password"
                placeholder="Password"
              />
              <button disabled={isInvalid} type="submit">
                Sign In
              </button>

              { error && <p>{error.message}</p> }
            </form>
            <div className="App-login">
              <div className="btn"><Link to="/register"> Register </Link></div>
              <div className="btn"><Link to="/"> Home </Link></div>
            </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  console.log(state)
  return {
    //DATA
  };
};

export default withRouter(connect(mapStateToProps, actions)(Login));
