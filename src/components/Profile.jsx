import { useEffect } from "react";
import { Image } from "react-bootstrap";
import { db } from "./firebase";
import { ref, onValue } from "firebase/database";
import { useParams } from "react-router-dom";

function Profile(props) {
  let { profileUid } = props;
  // user can edit posts? if uid == auth.currentUser.uid

  const {uid} = useParams();

  useEffect(()=>{
    if(uid){
      console.log(uid)
    }
  },[uid])

  // const profileRef = ref(db, profileUid);
  // onValue(profileRef, (snapshot) => {
  //   const data = snapshot.val();
  //   console.log(data);
  // });

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
