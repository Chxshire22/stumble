import { useEffect, useState } from "react";
import { Form, Image } from "react-bootstrap";
import { auth, storage, db, DB_STORAGE_PFP_KEY,DB_USER_KEY } from "./firebase";
import { onAuthStateChanged, updateProfile } from "firebase/auth";
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import { ref, set, onValue } from "firebase/database";
import { useNavigate } from "react-router-dom";

export default function SetProfile(props) {
  let {
    SetProfileUid,
    username,
    setUsername,
    bio,
    setBio,
    selectedImage,
    setSelectedImage,
  } = props;

  const [preview, setPreview] = useState(null);

  const navigate = useNavigate();

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
    console.log(e.target.files[0]);
    if (!e.target.files || e.target.files.length === 0) {
      setSelectedImage(null);
      return;
    }
    setSelectedImage(e.target.files[0]);
  };

  //display user info
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setPreview(user.photoURL);
        setUsername(user.displayName);
        console.log(user);
        //retrieve bio
        const bioRef = ref(db, DB_USER_KEY + auth.currentUser.uid);
        onValue(bioRef, (snapshot) => {
          setBio(snapshot.val().bio);
          console.log(snapshot.val().bio);
        });
      } else {
        console.log("loading user");
      }
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const saveProfile = (e) => {
    e.preventDefault();
    //why doesnt input validation required={true} not work?
    if (username && username.length >= 4) {
      if (selectedImage) {
        //comment only for my learning btw
        // this function is to make a reference/link to the image in storage. takes in 2 args, storage from firebase and the key+image.name to make it unique
        const storageRefInstance = storageRef(
          storage,
          DB_STORAGE_PFP_KEY + auth.currentUser.uid
        );
        //this uploads the image with the reference
        uploadBytes(storageRefInstance, selectedImage).then(() => {
          getDownloadURL(storageRefInstance)
            .then((url) => {
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
                uid: auth.currentUser.uid,
                posts: [],
                savedPosts: [],
              });
            })
            .then(() => SetProfileUid(auth.currentUser.uid))
            .then(() => navigate(`/profile/${auth.currentUser.uid}`));
        });
      } else {
        updateProfile(auth.currentUser, {
          //if pfp exists, select that. if not, use default pfp url
          photoURL: auth.currentUser.photoURL
            ? auth.currentUser.photoURL
            : "https://firebasestorage.googleapis.com/v0/b/stumble-a6ed0.appspot.com/o/profile-img%2Fdefault-pfp.png?alt=media&token=bdbbf587-5f3e-43a5-a4c6-e7bf44d983a7",
          displayName: username,
        })
          .then(() => {
            set(ref(db, DB_USER_KEY + auth.currentUser.uid), {
              displayPic: auth.currentUser.photoURL,
              username,
              bio,
              email: auth.currentUser.email,
              uid: auth.currentUser.uid,
              posts: [],
              savedPosts: [],
            });
          })
          .then(() => SetProfileUid(auth.currentUser.uid))
          .then(() => navigate(`/profile/${auth.currentUser.uid}`));
      }
    }
  };

  return (
    <div className="flex-center-col block set-profile-page">
      <div className="logo-container">
        <Image
          className="stumble-logo"
          src="src/assets/images/stumble-logo.png"
          // onClick={() => navigate("/")}
        />
      </div>
      <Image
        className="pfp pfp-container"
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
            required={true}
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
        <button type="submit" onClick={saveProfile} className="btn-base">
          Save & Exit
        </button>
      </Form>
    </div>
  );
}

// TODO: change so that createUserWithEmailAndPassword is executed upon the submission of this page
