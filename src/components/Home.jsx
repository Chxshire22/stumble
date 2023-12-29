import ModalCreatePost from "./ModalCreatePost";
import FeedPostCard from "./FeedPostCard";
import { useState, useEffect } from "react";
import { auth, db } from "./firebase";
import { ref as databaseRef, onValue } from "firebase/database";
import { signOut } from "firebase/auth";
// import Button from "react-bootstrap/Button";
import { Image, Dropdown } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const POSTS_FOLDER_NAME = "posts";

function Home() {
  const [modalShow, setModalShow] = useState(false);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const postsRef = databaseRef(db, POSTS_FOLDER_NAME);
    onValue(postsRef, (snapshot) => {
      const post = snapshot.val();
      const postsArray = Object.values(post);
      setPosts(postsArray);
    });
  }, []);

  const logout = async () => {
    try {
      await signOut(auth);
      navigate("/welcome");
    } catch (err) {
      console.log(err);
    }
  };

  const navigate = useNavigate()

  return (
    <div className="block flex-center-col">
      <header className="flex-center-row">
        {/* decided to upload the image to firebase */}
        <img
          src="https://firebasestorage.googleapis.com/v0/b/stumble-a6ed0.appspot.com/o/assets%2Fstumble-logo.webp?alt=media&token=72a22d6a-4de1-4a2c-b0bc-08fe0f660c8f"
          className="stumble-logo"
          alt=""
          onClick={() => navigate("/")}
        />
        <Image
          className="pfp pfp-profile-page"
          src={auth.currentUser.photoURL}
          roundedCircle
          fluid
        />
      </header>
      <div className="dropdown-container"></div>
      <hr />
      <div className="profile-body app-body">
        <div className="feed-btns-col">
          <button className="btn-base feed-btn">Filters</button>
          <Dropdown>
            <Dropdown.Toggle className="btn-base feed-btn" id="dropdown-basic">
              Settings
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item onClick={logout}>Sign Out</Dropdown.Item>
              <Dropdown.Item onClick={() => navigate("/set-profile")}>
                Edit Profile
              </Dropdown.Item>
              <Dropdown.Item href="#/action-3">
                Toggle Theme (dark mode maybe?)
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
        <div className="home-content">
          <button className="btn-base btn-create-post" onClick={() => setModalShow(true)}>
              <img className="pfp-badge" src={auth.currentUser.photoURL}  />
            <p>What&apos;s on your mind?</p>
          </button>
          <ModalCreatePost
            show={modalShow}
            onHide={() => setModalShow(false)}
          />
          <div className="profile-feed feed flex-center-col">
            {posts.map((post, index) => (
              <FeedPostCard
                key={index}
                username={post.username}
                location={post.location}
                text={post.text}
                date={post.date}
                image={post.imageLink}
              />
            ))}
          </div>
        </div>
        <img
          className="feed-image-deco"
          src="https://firebasestorage.googleapis.com/v0/b/stumble-a6ed0.appspot.com/o/assets%2Fflamenco-excited-for-a-flight.webp?alt=media&token=56ea81fb-9bf9-48bd-bfd5-ea3413d800bb"
        />
      </div>
    </div>
  );}

export default Home;

