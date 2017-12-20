import React, { Component } from 'react';
import './App.css';
import * as firebase from 'firebase';
import RoomList from './components/RoomList';
import MessageList from './components/MessageList';
import User from './components/User';


  var config = {
    apiKey: "AIzaSyBkV6QU5l9fqc29-EWU6JOA2iMdls_BI-k",
    authDomain: "bloc-chat-react-firebase.firebaseapp.com",
    databaseURL: "https://bloc-chat-react-firebase.firebaseio.com",
    projectId: "bloc-chat-react-firebase",
    storageBucket: "bloc-chat-react-firebase.appspot.com",
    messagingSenderId: "785446908511"
  };
  firebase.initializeApp(config);

  const auth = firebase.auth();

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      currentRoomId: 0,
      user: null,
    };
  }

  handleRoomSelect(roomId){
    this.setState({currentRoomId: roomId});
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
      <div className="App">
       <h1>Bloc Chat</h1>
       <RoomList
       handleRoomSelect={(e) => this.handleRoomSelect(e) }
       firebase={firebase}
       />
       <MessageList
       firebase={firebase}
       currentRoomId={this.state.currentRoomId}
       />
       <User
        firebase={firebase}
        auth={auth}
        currentUsername={this.state.user}
        setUser={(e) => this.setUser(e)}
       />
      </div>
    );
  }
}


export default App;
