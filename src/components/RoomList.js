import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import styled from 'styled-components'
import socket from './socket'

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

const componentLink = ({ className, link }) => (
    <Link className={className} to={link}></Link>

)

const CardLink = styled(componentLink)`
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  position: absolute;
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

const Image = ({ className, img }) => (
  <img className={className} src={img}/>
);

const CardImage = styled(Image)`
  border-radius: 100%;
  height: 50px;
  object-fit: contain;
  width: 50px;
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

class RoomList extends Component {
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

  buildRoomList = () => {
    return <CardList>
            {this.state.rooms.map((room, index) => (
                <Card key={index}>
                    <CardLink className="link" link={`/story/${room.handle}`}></CardLink>
                    <CardNumber>
                      <CardImage className="image" img={room.image}></CardImage>
                    </CardNumber>
                    <CardContent>
                        <CardEyebrow>Room</CardEyebrow>
                        <CardTitle>{room.name}</CardTitle>
                    </CardContent>
                    <CardStatus>Last Updated: Now</CardStatus>
                </Card>
            ))}
        </CardList>
  }

  render() {
      return (
        <div className="App">
        {
            !this.state.rooms
              ? 'Loading...'
              : this.buildRoomList()
        }
        </div>
      )
  }
}

export default withRouter(RoomList);
