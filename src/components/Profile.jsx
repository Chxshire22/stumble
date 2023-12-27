import { useEffect } from "react";
import { Image } from "react-bootstrap";
import { db } from "./firebase";
import {ref, onValue} from 'firebase/database'

function Profile(props) {

  let {profileUid} =props;
  // user can edit posts? if uid == auth.currentUser.uid

  useEffect(() =>{
    console.log(profileUid)
  },[profileUid])

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