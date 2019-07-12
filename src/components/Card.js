import React, { Component, useState } from 'react';
import styled from 'styled-components'
import PropTypes from 'prop-types';
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

const Header = styled.div`
  display: flex;
  flex-direction: column;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  width: calc(100vw - 260px);
  flex-direction: row;
  position: relative;
  max-width: 820px;
  font-family: "Roboto","Helvetica","Arial",sans-serif!important;
  font-weight: 500;
  padding: 0px 20px;
  background: #FFF;
  box-shadow: 0 1px 4px 0 rgba(0,0,0,0.14);
  margin-bottom: 20px;
  margin-top: 40px;
  border-radius: 6px;
`

const Logo = styled.div`
  padding: 20px 30px 20px;
  border-radius: 3px;
  background: linear-gradient(60deg, #ab47bc, #8e24aa);
  box-shadow: 0 4px 20px 0 rgba(0, 0, 0,.14), 0 7px 10px -5px rgba(156, 39, 176,.4);
  font-size: 1.4em;
  font-weight: 300;
  color: #fff;
  transform: translateY(-20px);
`

const HeaderList = styled.div`
  width: 70%;
  display: flex;
  height: 66px;
  align-items: center;
`

const HeaderButton = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(60deg, #ab47bc, #8e24aa);
  box-shadow: 0 4px 20px 0 rgba(0, 0, 0,.14), 0 7px 10px -5px rgba(156, 39, 176,.4);
  color: #fff;
  padding: 5px 20px;
  border-radius: 3px;
  margin: 0 10px;
  cursor: pointer;
  font-weight: 300;
  text-transform: uppercase;
  font-size: 14px;
  letter-spacing: 0.25px;
`

const Footer = styled.div`
  display: flex;
  flex-direction: column;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  width: calc(100vw - 260px);
  flex-direction: row;
  position: relative;
  max-width: 820px;
  font-family: "Roboto","Helvetica","Arial",sans-serif!important;
  font-weight: 500;
  padding: 0px 20px;
  background: #FFF;
  box-shadow: 0 1px 4px 0 rgba(0,0,0,0.14);
  margin-top: 20px;
  border-radius: 6px;
`

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
    };

    this.selectCard = this.selectCard.bind(this)
  }

  componentDidMount() {
    firebase.auth.onAuthStateChanged(authUser => {
      authUser
        ? this.setState({ authUser })
        : this.setState({ authUser: null });
    });

    this.state.client.socket.on('connect', () => { 
      console.log('connected to socket server'); 
    });

    this.state.client.socket.on('CLEAR_USER_CARD', () => {
        this.setState({selectedCard: null });
        const message = `Please Select a new Card`
        this.props.enqueueSnackbar(message, {
          variant: 'warning',
        });
    })

    this.state.client.socket.on('ALERT_TIMER', (time) => {
      const message = `Please Select a Card in ${time}ms`
      this.props.enqueueSnackbar(message, {
        variant: 'warning',
      });
    })

    setTimeout(() => {
        this.state.client.queryCard({
          card:this.state.selectedCard, 
          room: this.props.room.handle,
          user: firebase.auth.currentUser.email, 
          userId: firebase.auth.currentUser.uid,
          update: new Date().toTimeString()
        })

        // this.state.client.socket.on('ADD_CARD', (card) => {
        //     this.setState({selectedCard: card.card})
        // })

        console.log(this.state.selectedCard)
    }, 1000);

    console.log(this.props)
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

    console.log('room', this.props.room.handle)

    this.state.client.updateCard({ 
      card:this.state.selectedCard, 
      room: this.props.room.handle,
      user: firebase.auth.currentUser.email, 
      userId: firebase.auth.currentUser.uid,
      update: new Date()
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
    return <HeaderButton onClick={() => this.updateCard()}>
              Send Card
           </HeaderButton>
  }

  createSendCardBtn = () => {
    return <HeaderButton onClick={() => this.updateCard()}>
            Send Card
           </HeaderButton>
  }

  backToRooom = () => {
     this.props.history.push(`/story/${this.props.room.handle}`)
  }

  render() {
    return (
      <div className="App">

        <Header>
          <Logo>
            {this.props.room.name} Card For {!this.state.authUser ? '' : this.state.authUser.email}
          </Logo>
        </Header>

        <div className="card">
          <ul className="card__list">{this.createCards()}</ul>
        </div>

        <Footer>
          <HeaderList>
              {this.state.updateCard
                ? this.createUpdateCardBtn()
                : this.createSendCardBtn()
            }

            <HeaderButton onClick={() => this.clearCard()}> 
              Clear Card
            </HeaderButton>

            <HeaderButton onClick={() => this.backToRooom()}> 
              Back To Room
            </HeaderButton>
          </HeaderList>
        </Footer>

      </div>
    );
  }
}

UserCard.propTypes = {
  enqueueSnackbar: PropTypes.func.isRequired,
}

export default withRouter(connect(null, actions)(withSnackbar(UserCard)));
