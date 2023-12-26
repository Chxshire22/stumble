import { useEffect } from "react";

function CurrentUserProfile(props) {

  let {currentUid} = props;

  useEffect(()=>{
    console.log(currentUid)
  },[currentUid])


  return ( 
  <div>
    <h1>your profile page</h1>
  </div> 
  );
}

export default CurrentUserProfile;