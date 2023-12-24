import { useEffect, useState } from "react";
import { Form, Image } from "react-bootstrap";

export default function SetProfile() {
	// set preview of selected pfp
	const [selectedImage, setSelectedImage] = useState(null);
	const [preview, setPreview] = useState(null);

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

	

	return (
    <div className="flex-center-col container set-profile-page">
      <Image
        className="pfp-container"
        src={preview ? preview : "src/assets/images/default-pfp.png"}
        // src="src/assets/images/default-pfp.png"
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
            maxLength={8}
          />
        </Form.Group>
        <Form.Group className="mb-3 flex-center-row">
          <label>Bio</label>
          <textarea className="form-input" rows={3} cols={50} maxLength={140} />
        </Form.Group>
      </Form>
      <button className="btn-base">Next</button>
    </div>
  );
}

// TODO: change so that createUserWithEmailAndPassword is executed upon the submission of this page
