import { useEffect, useState } from "react";
import { db, storage, countryRef } from "./firebase";
import { push, ref as databaseRef, set, child, get } from "firebase/database";
import {
  getDownloadURL,
  ref as storageRef,
  uploadBytes,
} from "firebase/storage";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { getAuth } from "firebase/auth";
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from "react-places-autocomplete";

const IMAGES_FOLDER_NAME = "post-img";
const POSTS_FOLDER_NAME = "posts";
const auth = getAuth();

function ModalCreatePost(props) {
  const [textInput, setTextInput] = useState("");
  const [fileInput, setFileInput] = useState(null);
  const [address, setAddress] = useState("");
  const [coordinates, setCoordinates] = useState({
    lat: null,
    lng: null,
  });
  const [country, setCountry] = useState("");

  const writeData = (e) => {
    e.preventDefault();

    set(databaseRef(db, `country-list/` + country), {
      placeholder: "basically nothing",
    });

    const imageRef = storageRef(
      storage,
      `${IMAGES_FOLDER_NAME}/${auth.currentUser.displayName}/${fileInput.name}`
    );
    uploadBytes(imageRef, fileInput).then(() => {
      getDownloadURL(imageRef).then((url) => {
        const postListRef = databaseRef(db, POSTS_FOLDER_NAME);
        const newPostRef = push(postListRef);
        console.log(newPostRef._path.pieces_[1]);
        const pathToPostId = newPostRef._path.pieces_[1];
        set(newPostRef, {
          imageLink: url,
          text: textInput,
          uid: auth.currentUser.uid,
          username: auth.currentUser.displayName,
          date: new Date().toISOString(),
          postId: pathToPostId,
          location: address,
          country: country,
          latlng: coordinates,
        });
        setFileInput(null);
        setTextInput("");
        setAddress("");
      });
    });
  };

  //TODO: implementations for autocomplete. 1. save country as post property 2. save address as post property 3. create country in filter if country is valid country && if country is not included in list of countries
  const handleSelect = async (value) => {
    const results = await geocodeByAddress(value);
    const ll = await getLatLng(results[0]);
    console.log(ll);
    setAddress(value);
    setCoordinates(ll);
    setCountry(value.split(",").slice(-1)[0].trim());
  };

  useEffect(() => {
    console.log(address);
    if (address) {
      console.log(address.split(",").slice(-1)[0].trim());
    }
  }, [address]);

  return (
    <Modal
      {...props}
      size="md"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter" className="modal-title">
          Create a Post
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form onSubmit={writeData}>
          <input
            type="text"
            value={textInput}
            className="modal-text"
            placeholder="Share what's new in your life"
            onChange={(e) => setTextInput(e.target.value)}
          />
          <div className="input-place-and-file-row">
            <PlacesAutocomplete
              value={address}
              onChange={setAddress}
              onSelect={handleSelect}
            >
              {({
                getInputProps,
                suggestions,
                getSuggestionItemProps,
                loading,
              }) => (
                <div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="17"
                    height="17"
                    fill="currentColor"
                    className="bi bi-geo-alt-fill map-pin"
                    viewBox="0 0 16 16"
                  >
                    <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10m0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6" />
                  </svg>
                  <input
                    {...getInputProps({
                      placeholder: "Search Places ...",
                      className: "location-search-input",
                    })}
                  />
                  <div className="autocomplete-dropdown-container">
                    {loading && <div>Loading...</div>}
                    {suggestions.map((suggestion) => {
                      const className = suggestion.active
                        ? "suggestion-item--active"
                        : "suggestion-item";
                      // inline style for demonstration purpose
                      const style = suggestion.active
                        ? { backgroundColor: "#fafafa", cursor: "pointer" }
                        : { backgroundColor: "#ffffff", cursor: "pointer" };
                      return (
                        <div
                          {...getSuggestionItemProps(suggestion, {
                            className,
                            style,
                          })}
                        >
                          <span>{suggestion.description}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </PlacesAutocomplete>
            <label htmlFor="file-input" className="custom-file-input">
              <img
                src="https://firebasestorage.googleapis.com/v0/b/stumble-a6ed0.appspot.com/o/assets%2Finsert-picture-icon.png?alt=media&token=2b80813d-7207-42dd-9eef-4df82a7c29c3"
                alt="Icon"
                className="input-icon"
              />
            </label>
            <input
              type="file"
              id="file-input"
              onChange={(e) => setFileInput(e.target.files[0])}
              accept="image/*"
              style={{ display: "none" }}
            />
          </div>

          <button type="submit" disabled={!textInput} className="post-btn">
            Post
          </button>
        </form>
      </Modal.Body>
    </Modal>
  );
}

export default ModalCreatePost;
