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
      selectedCard: localStorage.getItem('selectedCard'),
      updateCard: null,
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

    socket.on('CLEAR_USER_CARD', () => {
        this.setState({selectedCard: null });
    })

    setTimeout(() => {
        socket.emit('QUERY_CARD', 
          {
            card:this.state.selectedCard, 
            user: firebase.auth.currentUser.email, 
            userId: firebase.auth.currentUser.uid
          }
        )
        socket.on('ADD_CARD', (card) => {
            this.setState({selectedCard: card.card})
        })

        console.log(this.state.selectedCard)
    }, 1000);
  }

  clearCard = () => {
      this.setState({
          selectedCard: null
      })
  }

  selectCard = (number) => {
     this.setState({
         selectedCard: number,
     })
  }

  updateCard = () => {

    this.setState({
      updateCard: true
    })

    localStorage.setItem('selectedCard', this.state.selectedCard);

    const socket = socketIOClient(this.state.endpoint);
    socket.emit('UPDATE_CARD', 
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

  createUpdateCardBtn = () => {
    return <div className="btn">
              <p onClick={() => this.updateCard()}>
                  Update Card
              </p>
            </div>
  }

  createSendCardBtn = () => {
    return <div className="btn">
            <p onClick={() => this.updateCard()}>
                Send Card
            </p>
          </div>
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

          <br/>

          {this.state.updateCard
              ? this.createUpdateCardBtn()
              : this.createSendCardBtn()
          }

          <br/>

          <div className="btn">
            <p onClick={() => this.clearCard()}>
                Clear Card
            </p>
          </div>

        </div>
        <Navigation authUser={this.state.authUser} />
      </div>
    );
  }
}

export default withRouter(connect(null, actions)(Card));
