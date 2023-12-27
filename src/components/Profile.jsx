import { useEffect, useState } from "react";
import { Image } from "react-bootstrap";
import { userRef } from "./firebase";
import { ref, get, child, } from "firebase/database";
import { useParams } from "react-router-dom";

function Profile(props) {
  // user can edit posts? if uid == auth.currentUser.uid

  const {uid} = useParams();

  useEffect(()=>{
    if(uid){
      console.log(uid)
    }
  },[uid])

  get(child(userRef, `/${uid}`))
  .then((snapshot) => {
    if (snapshot.exists()) {
      console.log(snapshot.val());
    } else {
      console.log("No data available");
    }
  })
  .catch((error) => {
    console.error(error);
  });
  


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
