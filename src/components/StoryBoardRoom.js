import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import socketIOClient from "socket.io-client";
import { connect } from "react-redux";
import logo from '../logo.svg';
import '../App.css';
import * as actions from "../store/actions";
import { firebase } from '../firebase';
import { withSnackbar } from 'notistack';
import socket from './socket'

class StoryBoardRoom extends Component {
  constructor(props) {
    super(props);

    this.state = {
      authUser: null,
      userCards: [],
      client: socket(),
      //endpoint: "http://192.168.1.10:4001",
      endpoint: process.env.REACT_APP_HEROKU_URL || process.env.REACT_APP_CURRENT_IP,
      enpointPort: process.env.PORT || 4001
    };

    this.joinRoom = this.joinRoom.bind(this)
  }

  componentDidMount() {
    firebase.auth.onAuthStateChanged(authUser => {
      authUser
        ? this.setState({ authUser })
        : this.setState({ authUser: null });
    });

    this.state.client.socket.on('NEW_USER', (err) => {
      const message = `New User Joined`
      this.props.enqueueSnackbar(message, {
        variant: 'warning',
      });
    })

    this.state.client.socket.on('ADD_CARD', (card) => {
          this.addCard(card)
    })

    this.state.client.renderCards((err, cards) => {
        this.setState({ userCards: cards })
    })

  }

  addCard = (card) => {
    if(this.state.userCards.length > 0) {
        let match = ''
        let matchIndex = ''
        
        this.state.userCards.filter((obj, index) => {
            if(obj.userId === card.userId) {
                match = obj
                matchIndex = index
            }
        })

        if(match.userId === card.userId) {
            let stateCopy = Object.assign({}, this.state);
            stateCopy.userCards[matchIndex].card = card.card;
            this.setState(stateCopy);
         } else {
            this.setState({userCards: [...this.state.userCards, card]});
         }
         
      } else {
        this.setState({userCards: [...this.state.userCards, card]});
      }
  }

  clearCards = () => {
    const socket = socketIOClient(window.location.hostname + ':4001');
    socket.emit('CLEAR_CARDS')
    this.setState({
        userCards: []
    })
  }

  startTimer = () => {
      this.state.client.startTimer(5000);
  }

  joinRoom = () => {
      this.state.client.join(this.props.room.handle, (err, success) => {
         if(err){
            console.log(err);
         }

         this.props.history.push(`/story/${this.props.room.handle}/card`)
      })    
  }

  renderCards = () => {
    const cards =  this.state.userCards.map((number, index) => {
        if(!!number.card) {
          return <li key={index}>{number.card} - {number.user}</li>
        }
      }       
    );

    return cards
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>{this.props.room.name} Room</h2>

           <div>
           {this.state.userCards.length > 0
                ? <ul>{this.renderCards()}</ul>
                : "Waiting For Users"
           }
           </div>

           <div className="btn">
            <p onClick={() => this.clearCards()}>
                Clear Cards<br/>
            </p>
           </div>

           <div className="btn">
            <p onClick={() => this.startTimer()}>
                Start Timer<br/>
            </p>
          </div>

          <div className="btn">
            <button  onClick={() => this.joinRoom()}>
              Join Room
            </button>
          </div>
        </div>
      </div>
    );
  }
}

StoryBoardRoom.propTypes = {
  enqueueSnackbar: PropTypes.func.isRequired,
}

export default withRouter(connect(null, actions)(withSnackbar(StoryBoardRoom)));