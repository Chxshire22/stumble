import { useState } from "react";
import { db, storage } from "./firebase";
import { push, ref as databaseRef, set } from "firebase/database";
import {
  getDownloadURL,
  ref as storageRef,
  uploadBytes,
} from "firebase/storage";
const IMAGES_FOLDER_NAME = "images";
const POSTS_FOLDER_NAME = "posts";

function Modal(props) {
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
        const newPostRef = push(postListRef);
        set(newPostRef, {
          imageLink: url,
          text: textInput,
          location: location,
        });
        setFileInputFile(null);
        setTextInput("");
        setLocation("");
      });
    });
  };

  return (
    <div>
      <dialog className="modal">
        <h3>Create a Post</h3>
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
          />
          <button
            type="submit"
            disabled={!textInputValue}
            onClick={() => props.setOpenModal(false)}
          >
            Post
          </button>
        </form>
      </dialog>
    </div>
  );
}

export default Modal;
