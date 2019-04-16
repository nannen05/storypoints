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
      endpoint: "http://192.168.1.10:4001",
    };
  }

  componentDidMount() {
    firebase.auth.onAuthStateChanged(authUser => {
      authUser
        ? this.setState({ authUser })
        : this.setState({ authUser: null });
    });

    const socket = socketIOClient(this.state.endpoint);
    // socket.on('ADD_CARD', (card) => {
    //       this.addCard(card)
    // })

    socket.on('RENDER_CARDS', (cards) => {
        console.log(cards)
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
    const socket = socketIOClient(this.state.endpoint);
    socket.emit('CLEAR_CARDS')
    this.setState({
        userCards: []
    })
  }

  startTimer = () => {

  }

  renderCards = () => {
    return this.state.userCards.map((number, index) =>
        <li key={index}>{number.card} - {number.user}</li>
    );
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
