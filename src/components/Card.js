import React, { Component } from 'react';
import socketIOClient from "socket.io-client";
import { connect } from "react-redux";
import logo from '../logo.svg';
import '../App.css';
import * as actions from "../store/actions";
import { withRouter } from 'react-router-dom'
import { firebase } from '../firebase';

import Navigation from './Navigation'

class Card extends Component {
  constructor(props) {
    super(props);

    this.state = {
      authUser: null,
      cards: ["0", "1/2", "1", "2", "3", "5", "8", "13", "20", "?"],
      userCards: [],
      selectedCard: null,
      currentSockets: null,
      endpoint: "http://192.168.1.10:4001",
    };

    this.selectCard = this.selectCard.bind(this)
  }

  componentDidMount() {
    firebase.auth.onAuthStateChanged(authUser => {
      authUser
        ? this.setState({ authUser })
        : this.setState({ authUser: null });
    });

    const socket = socketIOClient(this.state.endpoint);
    socket.on('ADD_CARD', (card) => {
        this.setState({userCards: [...this.state.userCards, {user: firebase.auth.email, card}] });
    })
  }

  clearCard = () => {
      this.setState({
          selectedCard: null
      })
  }

  selectCard = (number) => {
     this.setState({
         selectedCard: number
     })
  }

  sendCard = () => {
    const socket = socketIOClient(this.state.endpoint);
    socket.emit('SEND_CARD', 
      {
        card:this.state.selectedCard, 
        user: firebase.auth.currentUser.email, 
        userId: firebase.auth.currentUser.uid
      }
    )
  }

  createCards = () => {
      return this.state.cards.map((number, index) =>
      <li key={index} onClick={() => this.selectCard(number)}>{number}</li>
        );
  }

  renderCards = () => {
    return this.state.userCards.map((number, index) =>
        <li key={index}>{number}</li>
    );
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Cards</h2>
          <ul>{this.createCards()}</ul>
          {this.state.selectedCard
            ? <p>You Selected {this.state.selectedCard}</p>
            : <p>Select A Card</p>
          }

          <div className="btn">
            <p onClick={() => this.clearCard()}>
                Clear Card
            </p>
          </div>

          <div className="btn">
            <p onClick={() => this.sendCard()}>
                Send Card
            </p>
           </div>
        </div>
        <Navigation authUser={this.state.authUser} />
      </div>
    );
  }
}

export default withRouter(connect(null, actions)(Card));
