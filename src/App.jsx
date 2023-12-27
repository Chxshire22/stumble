import { RouterProvider, createBrowserRouter } from "react-router-dom";
import LoginSignout from "./components/LoginSignout";
import Home from "./components/Home";
import CreatePost from "./components/CreatePost";
import FullPost from "./components/FullPost";
import Profile from "./components/Profile";
import Playground from "./components/Playground";
import SetProfile from "./components/SetProfile";
import "./App.css";
import { useEffect, useState } from "react";
// import { onAuthStateChanged } from "firebase/auth";
// import {auth} from './components/firebase'

function App() {
  const [user, setUser] = useState({});
  const [profileUid, setProfileUid] = useState("");

  // set preview of selected pfp
  const [selectedImage, setSelectedImage] = useState(null);
  //user profile addition
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");

  useEffect(() => {
    if (profileUid) {
      console.log(profileUid);
    }
  }, [profileUid]);

  // useEffect(() => {
  //   onAuthStateChanged(auth, (currentUser) => {
  //     if (currentUser) {
  //       setProfileUid(currentUser.uid);
  //       console.log(currentUser.uid);
  //       console.log(profileUid);
  //     }
  //   });
  // }, [profileUid]);

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Home />,
    },
    {
      path: "/welcome",
      element: <LoginSignout setUser={setUser} user={user} />,
    },
    {
      path: "/create-post",
      element: <CreatePost />,
    },
    {
      path: "/post/:postUid",
      //will need the unique ID of post
      element: <FullPost />,
    },
    {
      path: `/profile/`,
      //will need the unique ID of profile
      children: [
        {
          path: ":uid",
          element: (
            <Profile
              profileUid={profileUid}
              displayPic={selectedImage}
              username={username}
              bio={bio}
            />
          ),
        },
      ],
    },
    {
      path: "/set-profile",
      //purely for building and debugging
      element: (
        <SetProfile
          SetProfileUid={setProfileUid}
          selectedImage={selectedImage}
          setSelectedImage={setSelectedImage}
          username={username}
          setUsername={setUsername}
          bio={bio}
          setBio={setBio}
        />
      ),
    },
    {
      path: "/playground",
      //purely for building and debugging
      element: (
        <Playground setProfileUid={setProfileUid} profileUid={profileUid} />
      ),
    },
  ]);
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
