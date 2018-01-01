import React, { Component } from 'react';

class RoomList extends Component {
 constructor(props){
   super(props);
   this.state = {
     rooms: [],
     name: '',
     rename: ''
   };
   this.roomsRef = this.props.firebase.database().ref('rooms');
 }

  componentDidMount() {
     this.roomsRef.on('child_added', (snapshot) => {
       const room = snapshot.val();
       room.key = snapshot.key;
       this.setState({ rooms: this.state.rooms.concat( room ) });
     });
  }

handleChange(e) {
 this.setState({ name: e.target.value });
}

handleRename(e) {
 this.setState({ rename: e.target.value });
}

createRoom(e){
   e.preventDefault();
   const newRoom = this.state.name;
   this.roomsRef.push({
     name: newRoom
   });
   this.name.value = '';
   this.setState({ name: ' '}, () => this.updateRooms(this.props.currentRoomId));
}

renameRoom(e){
  e.preventDefault();
  const newName = this.state.rename;
  const roomKey = this.props.currentRoomId;
  this.state.rooms.forEach(function(room){
    if (room.key === roomKey){
      room['name'] = newName;
    }
 });
 this.roomsRef.child(roomKey).update({ "name": newName });
 this.rename.value = '';
 this.setState({ rename: ' '});
}

deleteRoom(currentRoomId){
  const filteredRooms = this.state.rooms.filter(function(e){
    return e.key !== currentRoomId;
  });
   this.setState({ rooms: filteredRooms });
   this.roomsRef.child(currentRoomId).remove();
 }

 updateRooms(currentRoomId){
   this.setState({ rooms: this.state.rooms, name: ''});
 }

 componentWillUnmount(){
   this.roomsRef.off('child_added', (snapshot) => {
     const room = snapshot.val();
     room.key = snapshot.key;
     this.setState({ rooms: this.state.rooms.concat( room ) });
   });
 }

  render(){
   return(
     <div className="chatRoomDiv">
     <ul className="chatRooms">
       {
        this.state.rooms.map ( ( room, index ) =>
         <li className="roomNames" key={room.key} onClick={()=> this.props.handleRoomSelect(room.key)}>
         {room.name}
         <form onSubmit={this.renameRoom.bind(this)}>
          <input
          id="renameRoomForm"
          name="rename"
          type="text"
          placeholder="Edit room name.."
          ref={input => this.rename = input}
          onChange={this.handleRename.bind(this)}
          />
          <input type="submit"/>
          <button id="deleteRoomButton" onClick={(e) => this.deleteRoom(room.key)}>Delete</button>
          </form>
         </li>
       )}
      </ul>
      <form className="submitChatRoomForm" onSubmit={this.createRoom.bind(this)}>
        <input
        id="submitRoomForm"
        type="text"
        name="name"
        placeholder="Add a room..."
        ref={nroom => this.name = nroom}
        onChange={this.handleChange.bind(this)}/>
        <button id="submitRoomButton">Submit</button>
      </form>
      </div>
   );
  }
}

export default RoomList;
