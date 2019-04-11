import React, { Component } from 'react';
import { connect } from "react-redux";
import { Link, withRouter } from 'react-router-dom'
import logo from '../logo.svg';
import '../App.css';
import { firebase, auth } from '../firebase';
import * as actions from "../store/actions";
//import PrivateRoute from "./PrivateRoute";

class DashBoard extends Component {
    constructor(props) {
        super(props);

        this.state = {
            user: null
        };
    }

    signOut() {
        auth.doSignOut();
        alert('signed out')
        this.props.history.push('/')
    }

    // componentDidMount() {
    //     firebase.auth.onAuthStateChanged(authUser => {
    //         if(!authUser) {
    //             this.setState({ authUser: null })
    //         } else {
    //             this.setState({ authUser })
    //             this.props.fetchUser(authUser.uid)
    //         }
    //     });
    // }

    render() {
        // const {loading, user } = this.props

        // if (loading) {
        //     return (
        //         <div className="App">
        //             <div className="App-header">
        //                 <h2>Loading...</h2>
        //             </div>
        //         </div>
        //     )
        // }

        console.log(this.props)
        
        return (
            
            <div className="App">
                <div className="App-header">
                    <img src={logo} className="App-logo" alt="logo" />
                    <h2>Dashboard</h2>
                        <p>
                        {this.props.user && 
                            this.props.user.username
                        }
                        </p>
                    <br/>
                    <div className="btn"><Link to="/"> Home </Link></div>
                    <div className="btn signout" type="button" onClick={this.signOut.bind(this)}>
                        Sign Out
                    </div>
                </div>
            </div>
    )}

}

const mapStateToProps = state => ({
    user: state.userData.user,
});

export default withRouter(connect(mapStateToProps, null)(DashBoard))