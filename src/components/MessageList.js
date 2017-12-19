import React, { Component } from 'react';
//import * as firebase from 'firebase';
//import RoomList from './RoomList';

class MessageList extends Component {
  constructor(props){
    super(props);
    this.state = {
      messages: [],
      currentRoomMessages: []
    };
    this.messageRef = this.props.firebase.database().ref('messages');
  }

  componentDidMount() {
     this.messageRef.on('child_added', snapshot => {
     const message = snapshot.val();
     message.key = snapshot.key;
     this.setState({ messages: this.state.messages.concat( message ) });
   });
  }

 componentWillReceiveProps(nextProps){
   // compare this.props to nextProps and
   // use this.setState()

   //console.log(nextProps.currentRoomId);
   this.updateMessages(nextProps.currentRoomId);
   //call updateMessages

 }

updateMessages(currentRoomId){
  //this is where the .filter() goes

  const currentMessages = this.state.messages.filter(function(e){
    return e.roomId === currentRoomId;
  });
  this.setState({ currentRoomMessages: currentMessages });
}

  render(){
     return(
       <ul>{
        this.state.currentRoomMessages.map( (message, index) =>
         <li key={index}>{message.content}</li>
        )
      }</ul>
     );
  }
}

export default MessageList;
