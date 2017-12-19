import React, { Component } from 'react';
import * as firebase from 'firebase';
import RoomList from './components/RoomList';

MessageList extends Component {

  constructor(props){
    super(props);
    this.state = {
      messages: []
    };
    this.messageRef = firebase.database().ref('messages');
  }

  componentDidMount() {
     this.messageRef.on('child_added', snapshot => {
     const message = snapshot.val();
     message.key = snapshot.key;
     this.setState({ rooms: this.state.messages.concat( message ) });
   });
  }

 componentWillReceiveProps(nextProps){
   // compare this.props to nextProps and
   // use this.setState()
 }

updateMessages(){
// to be added
}


  render(){
   return(
    // a list of messages
    <li>
   // {
   //   this.state.messages.filter()
   // }
    </li>
   );
  }
}

export default MessageList;
