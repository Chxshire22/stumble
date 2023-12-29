import ModalCreatePost from "./ModalCreatePost";
import FeedPostCard from "./FeedPostCard";
import { useState, useEffect } from "react";
import { db } from "./firebase";
import { ref as databaseRef, onValue } from "firebase/database";
import Button from "react-bootstrap/Button";

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

  return (
    <div>
      <h1>home page</h1>
      <div className="button-container">
        {/* <Button className="open-modal-button" onClick={handleClickOpen}>
          What&apos;s on your mind?
        </Button>
        <ModalCreatePost openModal={openModal} handleClose={handleClose} /> */}
        <Button variant="primary" onClick={() => setModalShow(true)}>
          What&apos;s on your mind?
        </Button>

        <ModalCreatePost show={modalShow} onHide={() => setModalShow(false)} />
      </div>
      <div>
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
  );
}

export default Home;
