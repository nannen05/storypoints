import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import styled from 'styled-components'
import PropTypes from 'prop-types';
import { connect } from "react-redux";
import logo from '../logo.svg';
import '../App.css';
import * as actions from "../store/actions";
import { firebase } from '../firebase';
import { withSnackbar } from 'notistack';
import socket from './socket'

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
  margin-bottom: 60px;
  margin-top: 60px;
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
  justify-content: flex-end;
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

const CardList = styled.div`
  display: flex;
  flex-direction: column;
  display: flex;
  flex-wrap: wrap;
  width: calc(100vw - 260px);
  flex-direction: row;
  position: relative;
  justify-content: space-evenly;
  max-width: 900px;
  font-family: "Roboto", "Helvetica", "Arial", sans-serif!important;
  font-weight: 500;
`

const Card = styled.div`
  flex-grow: 0;
  max-width: calc(50% - 80px);
  flex-basis: 50%;
  color: rgba(0, 0, 0, 0.87);
  width: 100%;
  border: 0;
  display: flex;
  justify-content: space-between;
  position: relative;
  min-width: 0;
  word-wrap: break-word;
  font-size: .875rem;
  margin-top: 30px;
  background: #FFF;
  box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.14);
  margin-bottom: 30px;
  border-radius: 6px;
  flex-direction: row;
  padding: 0 20px 55px;
  margin: 20px 20px 40px;
`

const CardNumber = styled.div`
  width: 85px;
  padding: 20px 0;
  margin-top: -20px;
  margin-right: 15px;
  border-radius: 3px;
  background: linear-gradient(60deg, #ffa726, #fb8c00);
  box-shadow: 0 4px 20px 0 rgba(0, 0, 0,.14), 0 7px 10px -5px rgba(255, 152, 0,.4);
  font-weight: bold;
  font-size: 30px;
  color: #fff;
`

const CardContent = styled.div`
    text-align: right;
`

const CardTitle = styled.div`
  color: #3C4858;
  margin-top: 0px;
  min-height: auto;
  font-weight: 300;
  font-size: 1.4em;
  font-family: 'Roboto', 'Helvetica', 'Arial', sans-serif;
  margin-bottom: 3px;
  text-decoration: none;
`

const CardEyebrow = styled.div`
  color: #999;
  margin: 0;
  font-size: 14px;
  font-weight: 400;
  margin-top: 0;
  padding-top: 10px;
  margin-bottom: 5px;
`
const CardStatus = styled.div`
  position: absolute;
  bottom: 10px;
  width: calc(100% - 40px);
  left: 20px;
  text-align: left;
  border-top: 1px solid #d8d8d8;
  padding-top: 10px;
`

const Footer = styled.div`
  display: flex;
  flex-direction: column;
  display: flex;
  justify-content: flex-end;
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

class StoryBoardRoom extends Component {
  constructor(props) {
    super(props);

    this.state = {
      authUser: null,
      userCards: [],
      client: socket(),
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

          const message = `${card.user} Changed Cards`
          this.props.enqueueSnackbar(message, {
            variant: 'success',
          });

          console.log(card)
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
    this.state.client.socket.emit('CLEAR_CARDS')
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
          return <Card key={index}>
                    <CardNumber>{number.card}</CardNumber>
                    <CardContent>
                      <CardEyebrow>Team Member</CardEyebrow>
                      <CardTitle>{number.user}</CardTitle>
                    </CardContent>
                    <CardStatus>Last Updated: Now</CardStatus>
                  </Card>
        }
      }       
    );

    return cards
  }

  render() {
    return (
      <div className="App">

        <Header>
          <Logo>
            {this.props.room.name} Room
          </Logo>
          <HeaderList>
            <HeaderButton onClick={() => this.clearCards()}> 
              Clear Cards
            </HeaderButton>

            <HeaderButton onClick={() => this.startTimer()}> 
              Start Timer
            </HeaderButton>

            <HeaderButton onClick={() => this.joinRoom()}> 
              Join Room
            </HeaderButton>
          </HeaderList>

        </Header>

        <div>
        {this.state.userCards.length > 0
             ? <CardList>{this.renderCards()}</CardList>
             : "Waiting For Users"
        }
        </div>

        <Footer>
          <HeaderList>
            <HeaderButton> 
              <Link to={`/rooms`}>
                Back To Rooms
              </Link>
            </HeaderButton>
          </HeaderList>
        </Footer>

      </div>
    );
  }
}

StoryBoardRoom.propTypes = {
  enqueueSnackbar: PropTypes.func.isRequired,
}

export default withRouter(connect(null, actions)(withSnackbar(StoryBoardRoom)));