import { RouterProvider, createBrowserRouter } from "react-router-dom";
import LoginSignout from "./components/LoginSignout";
import Home from "./components/Home";
import CreatePost from "./components/CreatePost";
import FullPost from "./components/FullPost";
import CurrentUserProfile from "./components/CurrentUserProfile";
import Playground from "./components/Playground";
import SetProfile from "./components/SetProfile";
import "./App.css";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import {auth} from './components/firebase'


function App() {
  const [user, setUser] = useState({});
  const [currentUid, setCurrentUid] = useState("");

  useEffect(() =>{
    const unmount = onAuthStateChanged(auth,(currentUser)=>{
      if(currentUser){
        setCurrentUid(currentUser.uid);
        console.log(currentUser)
      }
    }) 
    return () => 
      unmount()
  },[])

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
      path: "/post",
      //will need the unique ID of post
      element: <FullPost />,
    },
    {
      path: "/profile",
      //will need the unique ID of profile
      element: <CurrentUserProfile currentUid={currentUid}/>,
    },
    {
      path: "/set-profile",
      //purely for building and debugging
      element: <SetProfile/>,
    },
    {
      path: "/playground",
      //purely for building and debugging
      element: <Playground />,
    },
  ]);
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
