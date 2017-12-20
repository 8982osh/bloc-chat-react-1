import React, { Component } from 'react';


class MessageList extends Component {
  constructor(props){
    super(props);
    this.state = {
      messages: [],
      currentRoomMessages: [],
      content: ''
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

// push new message to messageList & assoc. message with user
createNewMessage(e){
  e.preventDefault();
  const newMessage = this.state.content;
  this.messageRef.push({
    content: newMessage,
    username: this.props.currentUsername,
    roomId: this.props.currentRoomId
  });
  this.setState({ content: ' '});
}

// get the contents of the message
handleNewMessage(e) {
 this.setState({ content: e.target.value });
}

componentWillUnmount(){
  this.messageRef.off(this.loadMessageList);
}


  render(){
     return(
       <div className="messageListDiv">
       <ul className="messageList">
       {
        this.state.currentRoomMessages.map( (message, index) =>
         <li className="messages" key={index}>{message.content}</li>
        )
      }
      </ul>
      <form className="submitMessageForm" onSubmit={(e) => this.createNewMessage(e)}>
        <textarea placeholder="Type your message here..." value={this.state.content} onChange={(e) => this.handleNewMessage(e)}/>
        <button id="messageButton">Send</button>
      </form>
      </div>
     );
  }
}

export default MessageList;
