import React, { Component } from 'react';
import * as firebase from 'firebase';
import RoomList from './components/RoomList';
import MessageList from './components/MessageList';
import User from './components/User';
import './components/styles.css';

  var config = {
    apiKey: "AIzaSyBkV6QU5l9fqc29-EWU6JOA2iMdls_BI-k",
    authDomain: "bloc-chat-react-firebase.firebaseapp.com",
    databaseURL: "https://bloc-chat-react-firebase.firebaseio.com",
    projectId: "bloc-chat-react-firebase",
    storageBucket: "bloc-chat-react-firebase.appspot.com",
    messagingSenderId: "785446908511"
  };
  firebase.initializeApp(config);


class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      currentRoomId: 0,
      user: null,
      currentMessageId: 0
    };
  }

  handleRoomSelect(roomId,messageId=0){
    this.setState({ currentRoomId: roomId, currentMessageId: messageId });
  }

  setUser(user){
    if (user) {
      this.setState({ user: user.displayName });
    } else {
      this.setState({ user: "Guest" });
    }
  }

  render() {
    return (
      <div className="container">
       <h1>Bloc Chat</h1>
       <RoomList
       handleRoomSelect={(e) => this.handleRoomSelect(e) }
       currentRoomId={this.state.currentRoomId}
       firebase={firebase}
       />
       <MessageList
       firebase={firebase}
       handleRoomSelect={(room,message) => this.handleRoomSelect(room,message) }
       currentRoomId={this.state.currentRoomId}
       currentMessageId={this.state.currentMessageId}
       currentUsername={this.state.user}
       />
       <User
        firebase={firebase}
        currentUsername={this.state.user}
        setUser={(e) => this.setUser(e)}
       />
      </div>
    );
  }
}


export default App;
