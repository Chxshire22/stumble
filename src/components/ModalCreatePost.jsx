import { useEffect, useState } from "react";
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
import PlacesAutocomplete, {
	geocodeByAddress,
	getLatLng,
} from "react-places-autocomplete";

const IMAGES_FOLDER_NAME = "post-img";
const POSTS_FOLDER_NAME = "posts";
const auth = getAuth();

function ModalCreatePost(props) {
	const [textInput, setTextInput] = useState("");
	// const [location, setLocation] = useState("");
	const [fileInput, setFileInput] = useState(null);
	const [address, setAddress] = useState("");
	const [coordinates, setCoordinates] = useState({
		lat: null,
		lng: null,
	});

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
					latlng: coordinates,
				});
				setFileInput(null);
				setTextInput("");
				setAddress("");
			});
		});
	};



	//TODO: implementations for autocomplete. 1. save country as post property 2. save address as post property 3. create country in filter if country is valid country && if country is not included in list of countries 
	// AUTOCOMPLETE PLAYGROUND
	const handleSelect = async (value) => {
		const results = await geocodeByAddress(value);
		const ll = await getLatLng(results[0]);
		console.log(ll);
		setAddress(value);
		setCoordinates(ll);
	};

	useEffect(() =>
			{
				console.log(address)
				if(address){
					console.log(address.split(",").slice(-1)[0].trim())
				}
				},[address]);

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
