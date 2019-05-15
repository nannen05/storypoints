import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { auth } from '../firebase';

const Navigation = ({ authUser }) =>
  
  <div>
    { authUser
        ? <NavigationAuth id={authUser.uid} />
        : <NavigationNonAuth />
    }
  </div>

class NavigationAuth extends Component {

  signOut() {
    auth.doSignOut();
    this.props.history.push('/login')
  }

  render() {
    return(
        <div className="App-login">
          <div className="btn"><Link to="/rooms"> Rooms </Link></div>
          <div className="btn"><Link to="/dashboard"> Dashboard </Link></div>
          <div className="btn signout" type="button" onClick={this.signOut.bind(this)}>
            Sign Out
        </div>
        </div>
    )
  }
}


const NavigationNonAuth = () =>
  <div className="App-login">
    <p className="App-intro">
       <br/><br/>
    </p>
    <div className="btn"><Link to="/login"> Login </Link></div>
    <div className="btn"><Link to="/register"> Register </Link></div>
  </div>

export default withRouter(Navigation);