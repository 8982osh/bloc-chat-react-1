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
       this.messageRef.on('child_added', (snapshot) => {
       const message = snapshot.val();
       message.key = snapshot.key;
       this.setState({ messages: this.state.messages.concat( message ) });
     });
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

createNewMessage(e){
  e.preventDefault();
  var timestamp = new Date().toLocaleTimeString('en-US', { hour: 'numeric', hour12: true, minute: 'numeric' });
  const newMessage = this.state.content;
  this.messageRef.push({
    content: newMessage,
    username: this.props.currentUsername,
    roomId: this.props.currentRoomId,
    sentAt: timestamp
  });
 this.setState({ content: ' '}, () => this.updateMessages(this.props.currentRoomId));
}

handleNewMessage(e) {
 this.setState({ content: e.target.value }, () => this.updateMessages(this.props.currentRoomId));
}

deleteMessage(messageId){
  const filteredMessages = this.state.currentRoomMessages.filter(function(e){
    return e.key !== messageId;
  });
  this.setState({ currentRoomMessages: filteredMessages });
  this.messageRef.child(messageId).remove();
}

componentWillUnmount(){
  this.messageRef.off('child_added', (snapshot) => {
  const message = snapshot.val();
  message.key = snapshot.key;
  this.setState({ messages: this.state.messages.concat( message ) });
});
}

  render(){

     return(
       <div className="messageListDiv">
         <div className="messageList">
       {
        this.state.currentRoomMessages.map( (message, index) =>
          <p className="messageDetails" key={message.key}>{message.username}:
           {message.sentAt} {message.content}
           <button id="deleteMessageButton" onClick={(e) => this.deleteMessage(message.key)}>Delete</button>
           </p>
        )
      }
          </div>
       <form className="submitMessageForm" onSubmit={(e) => this.createNewMessage(e)}>
        <textarea placeholder="Type your message here..." value={this.state.content} onChange={(e) => this.handleNewMessage(e)}/>
        <button>Send</button>
      </form>
      </div>
     );
  }
}

export default MessageList;
