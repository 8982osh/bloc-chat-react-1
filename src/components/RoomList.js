import React, { Component } from 'react';
import * as firebase from 'firebase';

class RoomList extends Component {

// set up the initial state using the constructor method
 constructor(props){
   super(props);
   this.state = {
     rooms: []
   };
   this.roomsRef = firebase.database().ref('rooms');
 }

  // set up real-time event listeners for the database
  componentDidMount() {
     this.roomsRef.on('child_added', snapshot => {
     const room = snapshot.val();
     room.key = snapshot.key;
     console.log(room.name,room.key);
     this.setState({ rooms: this.state.rooms.concat( room ) });
   });
  }


// put this in for now to make the format a little prettier, but might
// revise later
formatName(str) {
  var len = str.length;
  var root = str.slice(0, len-1);
  var end = str.slice(-1);
  return root.charAt(0).toUpperCase() + root.slice(1) + " " + end;
}

  render(){
   return(
     <div>
       {
        this.state.rooms.map ( ( room, key ) =>
         <p>{this.formatName(room.name)}</p>
        )}
      </div>
   );
  }
}

export default RoomList;
