import React, { Component } from 'react';
import * as firebase from 'firebase';
import './roomlist.css';

class RoomList extends Component {

// set up the initial state using the constructor method
 constructor(props){
   super(props);
   this.state = {
     rooms: [],
     name: ''
   };
   this.roomsRef = firebase.database().ref('rooms');
 }

  // set up real-time event listeners for the database
  componentDidMount() {
     this.roomsRef.on('child_added', snapshot => {
     const room = snapshot.val();
     room.key = snapshot.key;
     this.setState({ rooms: this.state.rooms.concat( room ) });
   });
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
   this.roomsRef.off();
 }

  render(){
   return(
     <div>
       {
        this.state.rooms.map ( ( room, key ) =>
         <p>{room.name}</p>
        )}
      <form onSubmit={(e) => this.createRoom(e)}>
        <input type="text" value={this.name} onChange={(e) => this.handleChange(e)}/>
        <input type="submit"/>
      </form>
      </div>
   );
  }
}

export default RoomList;
