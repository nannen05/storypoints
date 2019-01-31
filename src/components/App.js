import React, { Component } from 'react'
import { connect } from "react-redux";
import { Route, BrowserRouter, Link, Redirect, Switch, withRouter } from 'react-router-dom'
import { firebase, auth } from '../firebase';
import * as actions from "../store/actions";

import Home from "./Home";
import Login from "./Login";
import Register from "./Register";
import Dashboard from "./Dashboard";


function PrivateRoute ({component: Component, authed, ...rest}) {
  return (
    <Route
      {...rest}
      render={(props) => authed === true
        ? <Component {...props} {...rest} />
        : <Redirect 
            to={{
                pathname: '/login', 
                state: {from: props.location}
            }} 
        />}
    />
  )
}

function PublicRoute ({component: Component, authed, ...rest}) {
  return (
    <Route
      {...rest}
      render={(props) => authed === false
        ? <Component {...props} {...rest} />
        : <Redirect to={{pathname: '/dashboard', state: {from: props.location}}} />}
    />
  )
}

class App extends Component {
   constructor(props) {
        super(props);

        this.state = {
            authed: false,
            loading: true,
        };
  }

  componentDidMount () {
    firebase.auth.onAuthStateChanged((user) => {
      if (user) {
        this.props.fetchUser(user.uid)

        this.setState({
          authed: true,
          loading: false,
        })

      } else {
        this.setState({
          authed: false,
          loading: false
        })
      }
    })
  }

  componentWillUnmount () {
    //this.removeListener()
  }
  
  render() {
    return this.props.loading === true ? <h1>Loading</h1> : (
        <BrowserRouter>
            <Switch>
                <Route exact path="/" component={Home}></Route>
                <PublicRoute authed={this.state.authed} path='/login' component={Login}/>
                <PublicRoute authed={this.state.authed} path='/register' component={Register} />>
                <PrivateRoute authed={this.state.authed} path='/dashboard' component={Dashboard} />
            </Switch>
        </BrowserRouter>
    );
  }
}

const mapStateToProps = state => ({
    user: state.userData.user,
    //loading: state.userData.loading
});

//export default App
export default connect(mapStateToProps, actions)(App)