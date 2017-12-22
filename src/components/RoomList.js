import React, { Component } from 'react';

class RoomList extends Component {
 constructor(props){
   super(props);
   this.state = {
     rooms: [],
     currentRooms: [],
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
  this.setState({ name: e.target.value }, ()=> this.updateRooms(this.props.currentRoomId));
 }

 createRoom(e){
   e.preventDefault();
   const newRoom = this.state.name;
   this.roomsRef.push({
     name: newRoom
   });
   this.setState({ name: ' '}, () => this.updateRooms(this.props.currentRoomId));
 }

updateRooms(currentRoomId){
   const filteredRooms = this.state.rooms.filter(function(e){
     return e.key !== currentRoomId;
   });
   this.setState({ rooms: filteredRooms });
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
         <button id="deleteRoomButton" onClick={(e) => this.updateRooms(room.key)}>Delete</button>
         </li>
       )}
      </ul>
      <form className="submitChatRoomForm" onSubmit={(e) => this.createRoom(e)}>
        <input type="text" placeholder="Add a room..." id="submitRoomInput" value={this.state.name} onChange={(e) => this.handleChange(e)}/>
        <button id="submitRoomButton">Submit</button>
      </form>
      </div>
   );
  }
}

export default RoomList;
