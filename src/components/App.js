import React, { Component } from 'react'
import { connect } from "react-redux";
import { Route, BrowserRouter, Link, Redirect, Switch, withRouter } from 'react-router-dom'
import { firebase, auth } from '../firebase';
import * as actions from "../store/actions";

import { SnackbarProvider } from 'notistack';

import Home from "./Home";
import Login from "./Login";
import UserCard from "./Card";
import Register from "./Register";
import Dashboard from "./Dashboard";
import StoryBoardRoom from './StoryBoardRoom';

import SideBar from "./SideBar";
import socket from './socket'

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
        : <Redirect 
            to={{
                pathname: '/dashboard', 
                state: {from: props.location}
            }} 
        />}
    />
  )
}

class App extends Component {
   constructor(props) {
      super(props);

      this.state = {
          authed: false,
          loading: true,
          client: socket(),
          rooms: null
      };
      
      this.getRoomList = this.getRoomList.bind(this)

      this.getRoomList();
  }
    
  getRoomList = () => {
    this.state.client.getRooms((err, rooms) => {
      this.setState({ rooms: rooms })
    })
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

  renderStoryBoardRoom(room, props) {
      return (
          <StoryBoardRoom room={room}/>
      )
  }
   
  render() {
    return this.props.loading === true ? <h1>Loading</h1> : (
      <SnackbarProvider maxSnack={3} 
        anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
        }}>
          <BrowserRouter>
              <div>
                <SideBar/>
                {
                  !this.state.rooms
                    ? 'Loading..'
                    : (
                      <Switch>
                        <Route exact path="/" component={Home}></Route>
                        <PublicRoute authed={this.state.authed} path='/login' component={Login}/>
                        <PublicRoute authed={this.state.authed} path='/register' component={Register} />
                        <PrivateRoute authed={this.state.authed} path='/dashboard' component={Dashboard} />
                        <Route path='/story/:team/card' component={UserCard}/>
                        {
                          this.state.rooms.map(room => (
                            <Route
                              key={room.name}
                              exact
                              path={`/story/${room.name}`}
                              render={
                                props => this.renderStoryBoardRoom(room, props)
                              }
                            />
                          ))
                        }
                      </Switch>
                    )
                }
              </div>
          </BrowserRouter>
        </SnackbarProvider>
    );
  }
}

const mapStateToProps = state => ({
    user: state.userData.user,
    //loading: state.userData.loading
});

//export default App
export default connect(mapStateToProps, actions)(App)