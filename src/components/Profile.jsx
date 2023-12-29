import { useEffect, useState } from "react";
import { Image, Dropdown } from "react-bootstrap";
import { auth, userRef } from "./firebase";
import { signOut } from "firebase/auth";
import { get, child } from "firebase/database";
import { useNavigate, useParams } from "react-router-dom";
import FeedPostCard from "./FeedPostCard";

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

  const navigate = useNavigate()


  return (
    <div className="block">
      <header className="profile-page-header">
        {/* decided to upload the image to firebase */}
        <img
          src="https://firebasestorage.googleapis.com/v0/b/stumble-a6ed0.appspot.com/o/assets%2Fstumble-logo.webp?alt=media&token=72a22d6a-4de1-4a2c-b0bc-08fe0f660c8f"
          className="stumble-logo"
          alt=""
          onClick={() =>navigate("/")}
        />
        <Image
          className="pfp pfp-profile-page"
          src={profile.displayPic}
          roundedCircle
          fluid
        />
        <h1 className="profile-page-user blue">{profile.username}</h1>
        <p className="bio profile-page-bio blue">{profile.bio}</p>
      </header>
    </div>
  );
}

export default Profile;
