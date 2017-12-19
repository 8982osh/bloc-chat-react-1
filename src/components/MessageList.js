import React, { Component } from 'react';


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
     this.messageRef.on('child_added', (snapshot) => this.loadMessageList(snapshot));
  }

  loadMessageList(snapshot){
    const message = snapshot.val();
    message.key = snapshot.key;
    this.setState({ messages: this.state.messages.concat( message ) });
  }

 componentWillReceiveProps(nextProps){
   this.updateMessages(nextProps.currentRoomId);
 }

updateMessages(currentRoomId){
  const currentMessages = this.state.messages.filter(function(e){
    return e.roomId === currentRoomId;
  });
  this.setState({ currentRoomMessages: currentMessages });
}

componentWillUnmount(){
  this.messageRef.off(this.loadMessageList);
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
