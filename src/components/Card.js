import React, { Component, useState } from 'react';
import PropTypes from 'prop-types';
import socketIOClient from "socket.io-client";
import { connect } from "react-redux";
import bvaLogo from '../bva.svg';
import '../App.css';
import * as actions from "../store/actions";
import { withRouter } from 'react-router-dom'
import { firebase } from '../firebase';
import { withSnackbar } from 'notistack';

import socket from './socket'

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

class UserCard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      authUser: null,
      cards: ["0", "1/2", "1", "2", "3", "5", "8", "13", "20", "?"],
      userCards: [],
      selectedCard: localStorage.getItem('selectedCard'),
      client: socket(),
      updateCard: null,
      currentSockets: null,
      //endpoint: "http://192.168.1.10:4001",
      //endpoint: "172.20.10.6:4001",
      endpoint: process.env.REACT_APP_HEROKU_URL || process.env.REACT_APP_CURRENT_IP,
      enpointPort: process.env.PORT || 3001
    };

    this.selectCard = this.selectCard.bind(this)
  }

  componentDidMount() {
    firebase.auth.onAuthStateChanged(authUser => {
      authUser
        ? this.setState({ authUser })
        : this.setState({ authUser: null });
    });

    //const socket = socketIOClient(window.location.hostname + ':' + (process.env.PORT || 4001));
    //const socket = socketIOClient('https://protected-bastion-46350.herokuapp.com', {
    //const url = this.state.endpoint + ':' + this.state.enpointPort
    const url = 'http://127.0.0.1:3001'
    const socket = socketIOClient(url, {
      forceNew: true,
      transports: ['websocket'], 
      jsonp: false 
    }); 

    socket.connect()

    socket.on('connect', () => { 
      console.log('connected to socket server'); 
    });

    socket.on('CLEAR_USER_CARD', () => {
        this.setState({selectedCard: null });
    })

    socket.on('ALERT_TIMER', (time) => {
      const message = `Please Select a Card in ${time}ms`
      this.props.enqueueSnackbar(message, {
        variant: 'warning',
      });
    })

    setTimeout(() => {
        this.state.client.queryCard({
          card:this.state.selectedCard, 
          user: firebase.auth.currentUser.email, 
          userId: firebase.auth.currentUser.uid
        })

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

      const message = 'Cleared Card'
      this.props.enqueueSnackbar(message, {
         variant: 'warning',
       });
  }

  selectCard = (number) => {
     this.setState({
         selectedCard: number,
     })
     const message = 'Selected ' + number
     this.props.enqueueSnackbar(message, {
        variant: 'info',
      });
  }

  updateCard = () => {

    this.setState({
      updateCard: true
    })

    const message = 'Sent ' + this.state.selectedCard
    this.props.enqueueSnackbar(message, {
       variant: 'success',
     });

    localStorage.setItem('selectedCard', this.state.selectedCard);

    this.state.client.updateCard({ 
      card:this.state.selectedCard, 
      user: firebase.auth.currentUser.email, 
      userId: firebase.auth.currentUser.uid
    })
  }

  simpleCard = (number, index) => {
      return (
        <Card 
          className={this.state.currentCard ? "card__item active" : "card__item"} 
          key={index}
          data-card={index}
          onClick={() => this.selectCard(number)}>
          <CardContent className="card__content">
            <Typography variant="h5" component="h1" className="card__item--top">
              {number}
            </Typography>
            <CardMedia
              className="card__logo"
              image={bvaLogo}
              title="Card Logo"
            />
            <Typography variant="h5" component="h1" className="card__item--bottom">
              {number}
            </Typography>
          </CardContent>
        </Card>
      )
  }

  createCards = () => {
      return this.state.cards.map((number, index) =>
          this.simpleCard(number, index)
      );
  }

  createUpdateCardBtn = () => {
    return <div className="btn">
              <Button size="large" onClick={() => this.updateCard()}>
                  Update Card
              </Button>
            </div>
  }

  createSendCardBtn = () => {
    return <div className="btn">
              <Button size="large" onClick={() => this.updateCard()}>
                Send Card
              </Button>
          </div>
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <h2>{this.props.room.name} Card <br/> For {!this.state.authUser ? '' : this.state.authUser.email}</h2>
        </div>

        <div className="card">
          <ul className="card__list">{this.createCards()}</ul>

          <div className="card__buttons">
          {this.state.updateCard
                ? this.createUpdateCardBtn()
                : this.createSendCardBtn()
            }

            <div className="btn">
              <Button size="large" onClick={() => this.clearCard()}>
              Clear Card
              </Button>
            </div>    
          </div>
        </div>
      </div>
    );
  }
}

UserCard.propTypes = {
  enqueueSnackbar: PropTypes.func.isRequired,
}

export default withRouter(connect(null, actions)(withSnackbar(UserCard)));
