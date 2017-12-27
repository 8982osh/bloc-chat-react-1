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

 handleChange(e) {
  this.setState({ name: e.target.value }, () => this.updateRooms(this.props.currentRoomId));
 }

 editName(e) {
  this.setState({ name: e.target.value });
 }

 createRoom(e){
   e.preventDefault();
   const newRoom = this.state.name;
   this.roomsRef.push({
     name: newRoom
   });
   this.setState({ name: ' '}, () => this.updateRooms(this.props.currentRoomId));
 }

// still need to work on this method
// name does not clear properly after assignment
// does update on screen and in firebase need to check for bugs...
renameRoom(e){
  e.preventDefault();
  const newName = this.state.name;
  const roomKey = this.props.currentRoomId;
  this.state.rooms.forEach(function(room){
    if (room.key === roomKey){
      room['name'] = newName;
    }
 });
 this.roomsRef.child(roomKey).update({ "name": newName });
 this.setState({ name: ' '});
}

updateRooms(currentRoomId){
   const filteredRooms = this.state.rooms.filter(function(e){
     return e.key !== currentRoomId;
   });
   this.setState({ rooms: filteredRooms });
   this.roomsRef.child(currentRoomId).remove();
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
         <form onSubmit={(e) => this.renameRoom(e)}>
          <input type="text"
          placeholder="Edit room name..."
          value={this.state.value}
          onChange={(e) => this.editName(e)}/>
          <input type="submit"/>
          <button id="deleteRoomButton" onClick={(e) => this.updateRooms(room.key)}>Delete</button>
          </form>
         </li>

       )}
      </ul>
      <form className="submitChatRoomForm" onSubmit={(e) => this.createRoom(e)}>
        <input type="text"
        placeholder="Add a room..."
        id="submitRoomInput"
        value={this.state.name}
        onChange={(e) => this.handleChange(e)}/>
        <button id="submitRoomButton">Submit</button>
      </form>
      </div>
   );
  }
}

export default RoomList;
