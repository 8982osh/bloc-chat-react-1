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
     this.roomsRef.on('child_added', (snapshot) => this.loadRoomList(snapshot));
  }

 loadRoomList(snapshot){
   const room = snapshot.val();
   room.key = snapshot.key;
   this.setState({ rooms: this.state.rooms.concat( room ) });
 }

 handleChange(e) {
  this.setState({ name: e.target.value });
 }

 createRoom(e){
   e.preventDefault();
   const newRoom = this.state.name;
   this.roomsRef.push({
     name: newRoom
   });
   this.setState({ name: ' '});
 }

 componentWillUnmount(){
   this.roomsRef.off(this.loadRoomList);
 }

  render(){
   return(
     <div className="chatRoomDiv">
     <ul className="chatRooms">
       {
        this.state.rooms.map ( ( room, index ) =>
         <li className="roomNames" key={room.key} onClick={()=> this.props.handleRoomSelect(room.key)}>
         {room.name}
         </li>
       )}
      </ul>
      <form className="submitChatRoomForm" onSubmit={(e) => this.createRoom(e)}>
        <input type="text" placeholder="Add a chat room..." id="submitRoomInput" value={this.state.name} onChange={(e) => this.handleChange(e)}/>
        <button id="submitRoomButton">Submit</button>
      </form>
      </div>
   );
  }
}

export default RoomList;
