import { useEffect } from "react";
import { Image } from "react-bootstrap";
import { db } from "./firebase";
import {ref, onValue} from 'firebase/database'

function Profile() {

  // user can edit posts? if uid == auth.currentUser.uid


  return ( 
  <div>
    <h1>Profile</h1>
    {/* <h1>{username}</h1>  */}
    {/* <Image src={}/> */}
    {/* <p>{bio}</p> */}
  </div>
  );
}

export default Profile;