import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import socket from './socket'

import logo from '../logo.svg';

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import Drawer from "@material-ui/core/Drawer";
import Hidden from "@material-ui/core/Hidden";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Icon from "@material-ui/core/Icon";
// core components


class Sidebar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      client: socket(),
      rooms: null,
    };

    this.getRoomList = this.getRoomList.bind(this)

    this.getRoomList();
  }

  getRoomList = () => {
    this.state.client.getRooms((err, rooms) => {
      this.setState({ rooms: rooms })
    })
  }

  buildBrand = () => {
      return (
        <div className="header">
        <Link to={`/`}>
            <div className="logo">
              <img src={logo} className="App-logo" alt="logo" />
            </div>
            StoryPoints
          </Link>
        </div>
      )
  }

  render() {
      return (
        <div className="sidebar">
        {this.buildBrand()}
        {
          !this.state.rooms
            ? 'Loading'
            : (
              <ul className="sidebar__list">
                {
                  this.state.rooms.map(room => (
                    <li 
                      key={room.name}
                    >
                      <Link to={`/story/${room.handle}`}></Link>
                      <img src={room.image}/>
                      <span>{room.name}</span>
                    </li>
                  ))
                }
              </ul>
            )
        }
        <div className="sidebar__bg"></div>
      </div>
      )
  }
}

export default withRouter(Sidebar);
