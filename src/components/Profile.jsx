import { useEffect, useState } from "react";
import { Image } from "react-bootstrap";
import { userRef } from "./firebase";
import { get, child, } from "firebase/database";
import { useParams } from "react-router-dom";

function Profile() {
  // user can edit posts? if uid == auth.currentUser.uid
  const [profile, setProfile] = useState({})

  const {uid} = useParams();

  useEffect(()=>{
    if(uid){
      console.log(uid)
    }
  },[uid])

  useEffect(()=>{
    get(child(userRef, `/${uid}`))
    .then((snapshot) => {
      if (snapshot.exists()) {
        console.log(snapshot.val());
        setProfile(snapshot.val())
      } else {
        console.log("No data available");
      }
    })
    .catch((error) => {
      console.error(error);
    });
  },[uid])


  return (
    <div>
      <h1>Profile</h1>
      <h1>{profile.username}</h1> 
      <Image className="pfp-container" src={profile.displayPic} roundedCircle fluid/>
      <p>{profile.bio}</p>
    </div>
  );
}

export default Profile;
