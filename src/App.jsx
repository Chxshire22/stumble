import { RouterProvider, createBrowserRouter } from "react-router-dom";
import LoginSignout from "./components/LoginSignout";
import Home from "./components/Home";
import ModalCreatePost from "./components/ModalCreatePost";
import FullPost from "./components/FullPost";
import Profile from "./components/Profile";
import Playground from "./components/Playground";
import SetProfile from "./components/SetProfile";
import "./App.css";
import { useEffect, useState } from "react";

function App() {
  //for popup
  const [modalShow, setModalShow] = useState(false);
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

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Home modalShow={modalShow} setModalShow={setModalShow} />,
    },
    {
      path: "/welcome",
      element: <LoginSignout setUser={setUser} user={user} />,
    },
    {
      path: "/create-post",
      element: <ModalCreatePost />,
    },
    {
      path: "/post/",
      //will need the unique ID of post
      children: [
        {
          path: ":postId",
          element: <FullPost />,
        },
      ],
    },
    {
      path: `/profile/`,
      //will need the unique ID of profile
      children: [
        {
          path: ":uid",
          element: (
            <Profile
              modalShow={modalShow}
              setModalShow={setModalShow}
              username={username}
              bio={bio}
            />
          ),
        },
      ],
    },
    {
      path: "/set-profile",
      element: (
        <SetProfile
          setProfileUid={setProfileUid}
          username={username}
          setUsername={setUsername}
          bio={bio}
          setBio={setBio}
          selectedImage={selectedImage}
          setSelectedImage={setSelectedImage}
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
