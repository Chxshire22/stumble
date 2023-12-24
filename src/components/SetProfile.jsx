import {useEffect, useState} from "react";
import { Form, Image } from "react-bootstrap";

export default function SetProfile() {

	const [selectedImage, setSelectedImage] = useState(null)
	const [preview, setPreview] = useState(null)

	// const handleImageChange = (e) =>{
	// 	const [file] = e.files;
	// 	if (file) {
	// 		setSelectedImage(URL.createObjectURL(file))
	// 	}
	// }
	//
	
		useEffect(() => {
			if (!selectedImage){
				setPreview(undefined)
				return
			}
			const localUrl = URL.createObjectURL(selectedImage)
			setPreview(localUrl)
		}, [selectedImage])
	
		const handleImageChange = (e) => {
			console.log(e.target.files)
			if (!e.target.files || e.target.files.length ===0) {
				setSelectedImage(null)
				return
			}
			setSelectedImage(e.target.files[0])
		}

	return (
		<div className="flex-center-col container set-profile-page">
		<Image className="pfp-container" src={preview} id="pfp-preview" roundedCircle fluid />
			<Form className="flex-center-col" action="">
				<Form.Group controlId="formFile" className="mb-3 flex-center-row pfp-upload">
					<Form.Label>Upload your profile picture</Form.Label>
					<Form.Control onChange={handleImageChange} type="file"></Form.Control>
				</Form.Group>
				<Form.Group className="mb-3 flex-center-row">
					<Form.Label>Username</Form.Label>
					<Form.Control type="text" required size="10" minLength={4} maxLength={8} />
				</Form.Group>
				<Form.Group className="mb-3 flex-center-row">
					<Form.Label>Bio</Form.Label>
					<Form.Control as="textarea" rows={3} cols={50} />
				</Form.Group>
			</Form>
			<button className="btn-base">Next</button>
		</div>
);
}
