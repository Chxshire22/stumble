import { useEffect, useState } from "react";
import { db, storage } from "./firebase";
import { push, ref as databaseRef, set } from "firebase/database";
import {
	getDownloadURL,
	ref as storageRef,
	uploadBytes,
} from "firebase/storage";
import Modal from "react-bootstrap/Modal";
import { getAuth } from "firebase/auth";
import PlacesAutocomplete, {
	geocodeByAddress,
	getLatLng,
} from "react-places-autocomplete";
import { Dropdown } from "react-bootstrap";

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
	const [filter, setFilter] = useState("");

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
					filter: filter,
				});
				setFileInput(null);
				setTextInput("");
				setAddress("");
			});
		});
	};


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
				<form>
					<Dropdown>
						<Dropdown.Toggle className="btn-base btn-create-post-filter" id="dropdown-basic">
							Filter
						</Dropdown.Toggle>

						<Dropdown.Menu>
							<Dropdown.Item
								onClick={() => setFilter("Tips")}
							>Tips</Dropdown.Item>
							<Dropdown.Item
								onClick={() => setFilter("Event")}
							>Event</Dropdown.Item>
							<Dropdown.Item onClick={()=>setFilter("Scam Alert")}>Scam Alert</Dropdown.Item>
							<Dropdown.Item
								onClick={() => setFilter("Hostel Recommendation")}
							>Hostel Recommendation</Dropdown.Item>
							<Dropdown.Item
								onClick={() => setFilter("Tour Recommendation")}
							>Tour Recommendation</Dropdown.Item>
							<Dropdown.Item onClick={()=>setFilter("Food Recommendation")}>
								Food Recommendation
							</Dropdown.Item>
							<Dropdown.Item onClick={()=>setFilter("")}>
								None
							</Dropdown.Item>
						</Dropdown.Menu>
<span>{filter}</span>
					</Dropdown>
					<textarea
						// type="text"
						value={textInput}
						placeholder="What's new?"
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
				</form>
			</Modal.Body>
			<Modal.Footer>
				<button type="submit" onClick={writeData} disabled={!textInput}>
					Post
				</button>
			</Modal.Footer>
		</Modal>
	);
}

export default ModalCreatePost;
