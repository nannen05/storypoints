import React, { Component } from 'react';
import socketIOClient from "socket.io-client";
import { connect } from "react-redux";
import logo from '../logo.svg';
import '../App.css';
import * as actions from "../store/actions";
import { withRouter } from 'react-router-dom'
import { firebase } from '../firebase';

class StoryBoardRoom extends Component {
  constructor(props) {
    super(props);

    this.state = {
      authUser: null,
      userCards: [],
      //endpoint: "http://192.168.1.10:4001",
      endpoint: process.env.REACT_APP_HEROKU_URL || process.env.REACT_APP_CURRENT_IP
    };
  }

  componentDidMount() {
    firebase.auth.onAuthStateChanged(authUser => {
      authUser
        ? this.setState({ authUser })
        : this.setState({ authUser: null });
    });

    //const socket = socketIOClient();
    //const socket = socketIOClient.connect(window.location.host + ':' + (process.env.PORT || 4001))
    //const socket = socketIOClient('https://protected-bastion-46350.herokuapp.com', {
    const url = this.state.endpoint + ':4001'
    const socket = socketIOClient(url, {
        transports: ['websocket'], 
        jsonp: false 
      }); 

    socket.connect()

    socket.on('connect', () => { 
      console.log('connected to socket server'); 
    });

    // socket.on('ADD_CARD', (card) => {
    //       this.addCard(card)
    // })

    console.log(window.location.hostname + ':' + (process.env.PORT || 4001))

    socket.on('RENDER_CARDS', (cards) => {
        this.setState({userCards: cards})
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
          <h2>Story Board Room</h2>

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
        </div>
      </div>
    );
  }
}

export default withRouter(connect(null, actions)(StoryBoardRoom));
