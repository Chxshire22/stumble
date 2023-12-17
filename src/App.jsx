import { RouterProvider,createBrowserRouter } from 'react-router-dom'
import './App.css'
import LoginSignout from './components/LoginSignout'
import Home from './components/Home'
import CreatePost from './components/CreatePost'
import FullPost from './components/FullPost'
import Profile from './components/Profile'
import Playground from './components/Playground'

function App() {

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/welcome",
    element: <LoginSignout />,
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
    element: <Profile />,
  },
  {
    path: "/playground",
    //will need the unique ID of profile
    element: <Playground />,
  },
]);
  return (
    <>
    <RouterProvider router={router}/>
    </>
  )
}

export default App
