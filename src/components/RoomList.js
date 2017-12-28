import React, { Component } from 'react';

class RoomList extends Component {
 constructor(props){
   super(props);
   this.state = {
     rooms: [],
     name: ''
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

 handleChange(event) {
  this.setState({ [event.target.name]: event.target.value });
 }

 createRoom(e){
   e.preventDefault();
   const newRoom = this.state.name;
   this.roomsRef.push({
     name: newRoom
   });
   this.setState({ name: ' '}, () => this.updateRooms(this.props.currentRoomId));
 }

renameRoom(event){
  event.preventDefault();
  const newName = this.state.name;
  const roomKey = this.props.currentRoomId;
  this.state.rooms.forEach(function(room){
    if (room.key === roomKey){
      room['name'] = newName;
    }
 });
 this.roomsRef.child(roomKey).update({ "name": newName });
 this.setState({ name: ''});
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
          type="text"
          name="name"
          placeholder="Edit room name..."
          value={this.state.name}
          onChange={this.handleChange.bind(this)}/>
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
        value={this.state.name}
        onChange={this.handleChange.bind(this)}/>
        <button id="submitRoomButton">Submit</button>
      </form>
      </div>
   );
  }
}

export default RoomList;
