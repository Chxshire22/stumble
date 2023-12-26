import { useEffect, useState } from "react";
import { Form, Image } from "react-bootstrap";
import { auth, storage, db } from "./firebase";
import { onAuthStateChanged, updateProfile } from "firebase/auth";
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import { ref, set, onValue } from "firebase/database";

export default function SetProfile() {
  const DB_STORAGE_KEY = "profile-img/";
  const DB_USER_KEY = "users/";


  // set preview of selected pfp
  const [selectedImage, setSelectedImage] = useState(null);
  const [preview, setPreview] = useState(null);
  //user profile addition
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");

  // change image container when selected image is changed
  useEffect(() => {
    if (!selectedImage) {
      setPreview(undefined);
      return;
    }
    const localUrl = URL.createObjectURL(selectedImage);
    setPreview(localUrl);
  }, [selectedImage]);

  const handleImageChange = (e) => {
    console.log(e.target.files);
    if (!e.target.files || e.target.files.length === 0) {
      setSelectedImage(null);
      return;
    }
    setSelectedImage(e.target.files[0]);
  };




	//display user info
  useEffect(() => {
    onAuthStateChanged(auth, async(user) => {
      if (user) {
        setPreview(user.photoURL);
        setUsername(user.displayName);
        console.log(user);
				//retrieve bio
				const bioRef = ref(db, DB_USER_KEY+auth.currentUser.uid);
				onValue(bioRef, (snapshot) => {
					setBio(snapshot.val().bio)
					console.log(snapshot.val().bio)
				})
      } else {
        console.log("loading user");
      }
    });
  }, []);

  const saveProfile = (e) => {
    e.preventDefault();
    if (selectedImage) {
      //comment only for my learning btw
      // this function is to make a reference/link to the image in storage. takes in 2 args, storage from firebase and the key+image.name to make it unique
      const storageRefInstance = storageRef(
        storage,
        DB_STORAGE_KEY + auth.currentUser.uid
      );
      //this uploads the image with the reference
      uploadBytes(storageRefInstance, selectedImage).then(() => {
        getDownloadURL(storageRefInstance).then((url) => {
          //updates the FIREBASE profile with username, pfp
          updateProfile(auth.currentUser, {
            photoURL: url,
            displayName: username,
          });
					// update my own user DB
          set(ref(db, DB_USER_KEY + auth.currentUser.uid), {
            bio,
            username,
            displayPic: url,
            email: auth.currentUser.email,
          });
        });
      });
    } else {
      set(ref(db, DB_USER_KEY + auth.currentUser.uid), {
				displayPic: auth.currentUser.photoURL,
				username,
        bio,
				email:auth.currentUser.email
      });
      updateProfile(auth.currentUser, {
        displayName: username,
      });
    }
  };

  return (
    <div className="flex-center-col container set-profile-page">
      <Image
        className="pfp-container"
        src={preview ? preview : "src/assets/images/default-pfp.png"}
        id="pfp-preview"
        roundedCircle
        fluid
      />
      <Form className="flex-center-col" action="">
        <Form.Group
          controlId="formFile"
          className="mb-3 flex-center-row pfp-upload"
        >
          <label>Set your profile picture</label>
          <input
            className="form-input"
            onChange={handleImageChange}
            accept="image/*"
            type="file"
          />
        </Form.Group>
        <Form.Group className="mb-3 flex-center-row">
          <label>Username</label>

          <input
            type="text"
            required
            size="10"
            minLength={4}
            className="form-input"
            maxLength={15}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
						spellCheck={false}
          />
        </Form.Group>
        <Form.Group className="mb-3 flex-center-row">
          <label>Bio</label>
          <textarea
						spellCheck={false}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="form-input"
            rows={3}
            cols={50}
            maxLength={140}
          />
        </Form.Group>
      </Form>
      <button onClick={saveProfile} className="btn-base">
        Next
      </button>
    </div>
  );
}

// TODO: change so that createUserWithEmailAndPassword is executed upon the submission of this page
