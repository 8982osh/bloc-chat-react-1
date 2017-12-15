import React, { Component } from 'react';
import './App.css';
import * as firebase from 'firebase';
import RoomList from './components/RoomList';

  // Initialize Firebase
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

  render() {
    return (
      <div className="App">
       <h1>Bloc Chat</h1>
       <RoomList name={this.props.name}/>
      </div>
    );
  }
}


export default App;
