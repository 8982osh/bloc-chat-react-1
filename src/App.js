import React, { Component } from 'react';
import './App.css';
import * as firebase from 'firebase';
import RoomList from './components/RoomList';

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

  // had also tried without (props) argument
  constructor(props){
    super(props);
    this.state = {
      currentRoomId: 0
    };
    this.handleRoomSelect = this.handleRoomSelect.bind(this);
  }

  handleRoomSelect(e){
    //just trying to get it to do something...
    console.log('clicked');
    const currentRoom = this.state.currentRoomId === e;
    this.setState({ currentRoomId: currentRoom });
  }

  render() {
    return (
      <div className="App">
       <h1>Bloc Chat</h1>
       <RoomList/>
      </div>
    );
  }
}


export default App;
