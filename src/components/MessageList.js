import React, { Component } from 'react';


class MessageList extends Component {
  constructor(props){
    super(props);
    this.state = {
      messages: [],
      currentRoomMessages: [],
      content: '',
      newContent: '',
      currentMessageId: 0
    };
    this.messageRef = this.props.firebase.database().ref('messages');
  }

  componentDidMount() {
       this.messageRef.on('child_added', (snapshot) => {
       const message = snapshot.val();
       message.key = snapshot.key;
       this.setState({ messages: this.state.messages.concat( message ), currentMessageId: message.key });
     });

     this.messageRef.on('child_removed', (snapshot) => {
       const messageToDelete = snapshot.val();
       messageToDelete.key = snapshot.key;
       this.setState({ messages: this.state.messages.filter( function(e){
           return e.key !== messageToDelete.key;
         })
        });
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

handleNewMessage(e) {
 this.setState({ content: e.target.value }, () => this.updateMessages(this.props.currentRoomId));
}

handleEdit(e){
  this.setState({ newContent: e.target.value });
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

editMessage(e){
  e.preventDefault();
  const newMessage = this.state.newContent;
  const messageKey = this.state.currentMessageId;
  this.state.currentRoomMessages.forEach(function(message){
    if (message.key === messageKey){
      message["content"] = newMessage;
    }
  });
  var obj = { content: newMessage};
  this.messageRef.child(messageKey).update(obj);
  this.newContent.value = '';
  this.setState({newContent: ' '}, () => this.updateMessages(this.props.currentRoomId));
}

deleteMessage(messageId){
  const filteredMessages = this.state.currentRoomMessages.filter(function(e){
    return e.key !== messageId;
  });
  this.messageRef.child(messageId).remove();
  this.setState({ currentRoomMessages: filteredMessages });
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
         <ul className="messageList">
       {
        this.state.currentRoomMessages.map( (message, index) =>
          <li className="messageDetails" key={message.key}>
          {message.username}:
           {message.sentAt} {message.content}
          <form onSubmit={this.editMessage.bind(this)}>
           <input
           id={message.key}
           name="newContent"
           type="text"
           ref={input => this.newContent = input}
           placeholder="Edit message..."
           onChange={this.handleEdit.bind(this)}
           />
          <input type="submit"/>
          <button id="deleteMessageButton" onClick={(e) => this.deleteMessage(message.key)}>Delete</button>
          </form>
           </li>
        )
      }
          </ul>
       <form className="submitMessageForm" onSubmit={(e) => this.createNewMessage(e)}>
        <textarea
        placeholder="Type your message here..."
        value={this.state.content}
        onChange={(e) => this.handleNewMessage(e)}/>
        <button>Send</button>
      </form>
      </div>

     );
  }
}

export default MessageList;
