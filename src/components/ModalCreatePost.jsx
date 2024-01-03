import { useState } from "react";
import { db, storage } from "./firebase";
import { push, ref as databaseRef, set } from "firebase/database";
import {
  getDownloadURL,
  ref as storageRef,
  uploadBytes,
} from "firebase/storage";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { getAuth } from "firebase/auth";

const IMAGES_FOLDER_NAME = "post-img";
const POSTS_FOLDER_NAME = "posts";
const auth = getAuth();

function ModalCreatePost(props) {
  const [textInput, setTextInput] = useState("");
  const [location, setLocation] = useState("");
  const [fileInput, setFileInput] = useState(null);

  const writeData = (e) => {
    e.preventDefault();
    const imageRef = storageRef(
      storage,
      `${IMAGES_FOLDER_NAME}/${fileInput.name}`
    );
    uploadBytes(imageRef, fileInput).then(() => {
      getDownloadURL(imageRef).then((url) => {
        const postListRef = databaseRef(db, POSTS_FOLDER_NAME);
        // const postListRef = databaseRef(database, POSTS_FOLDER_NAME);
        const newPostRef = push(postListRef);
        console.log(newPostRef._path.pieces_[1]);
        const pathToPostId = newPostRef._path.pieces_[1];
        set(newPostRef, {
          imageLink: url,
          text: textInput,
          location: location,
          uid: auth.currentUser.uid,
          username: auth.currentUser.displayName,
          date: new Date().toISOString(),
          postId: pathToPostId,
        });
        setFileInput(null);
        setTextInput("");
        setLocation("");
      });
    });
  };

  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Create a Post
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form onSubmit={writeData}>
          <input
            type="text"
            value={textInput}
            placeholder="share what's new in your life"
            onChange={(e) => setTextInput(e.target.value)}
          />
          <input
            type="text"
            value={location}
            placeholder="Your Location"
            onChange={(e) => setLocation(e.target.value)}
          />
          <input
            type="file"
            onChange={(e) => setFileInput(e.target.files[0])}
						accept="image/*"
          />
          <button type="submit" disabled={!textInput}>
            Post
          </button>
        </form>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={props.onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ModalCreatePost;
