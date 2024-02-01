import { RouterProvider, createBrowserRouter } from "react-router-dom";
import LoginSignout from "./components/LoginSignout";
import Home from "./components/Home";
import ModalCreatePost from "./components/ModalCreatePost";
import FullPost from "./components/FullPost";
import Profile from "./components/Profile";
import SetProfile from "./components/SetProfile";
import Country from "./components/Country";
import "./App.css";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
	//for popup
	const [modalShow, setModalShow] = useState(false);
	const [user, setUser] = useState({});
	const [profileUid, setProfileUid] = useState("");

	// set preview of selected pfp
	const [selectedImage, setSelectedImage] = useState(null);
	//user profile addition
	const [username, setUsername] = useState("");
	const [bio, setBio] = useState("");

	const toastConfig = {
		position: "top-right",
		autoClose: 2500,
		hideProgressBar: false,
		closeOnClick: true,
		pauseOnHover: true,
		draggable: true,
		progress: undefined,
		theme: "colored",
	};

	const referrer = document.referrer;
	const currentUrl = window.location.href;

	const welcomeRegex = /\/welcome$/;
	const setProfileRegex = /\/set-profile$/;

	useEffect(() => {
		console.log(currentUrl);
		console.log(referrer);
	}, []);

	useEffect(() => {
		if (welcomeRegex.test(referrer) && setProfileRegex.test(currentUrl)) {
			toast.success("Successfully signed up", toastConfig);
		}
		if (welcomeRegex.test(referrer)) {
			toast.success("Successfully logged in", toastConfig);
		}
	}, [referrer, currentUrl]);

	const router = createBrowserRouter([
		{
			path: "/",
			element: (
				<Home
					modalShow={modalShow}
					setModalShow={setModalShow}
					toastConfig={toastConfig}
				/>
			),
		},
		{
			path: "/welcome",
			element: (
				<LoginSignout setUser={setUser} user={user} toastConfig={toastConfig} />
			),
		},
		{
			path: "/create-post",
			element: <ModalCreatePost />,
		},
		{
			path: "/post/",
			//will need the unique ID of post
			children: [
				{
					path: ":postId",
					element: <FullPost />,
				},
			],
		},
		{
			path: `/profile/`,
			//will need the unique ID of profile
			children: [
				{
					path: ":uid",
					element: (
						<Profile
							toastConfig={toastConfig}
							modalShow={modalShow}
							setModalShow={setModalShow}
							username={username}
							bio={bio}
						/>
					),
				},
			],
		},
		{
			path: "/set-profile",
			element: (
				<SetProfile
					setProfileUid={setProfileUid}
					username={username}
					setUsername={setUsername}
					bio={bio}
					setBio={setBio}
					selectedImage={selectedImage}
					setSelectedImage={setSelectedImage}
					toastConfig={toastConfig}
				/>
			),
		},
		{
			path: `/country/`,
			children: [
				{
					path: `:changedCountry`,
					element: (
						<Country
							toastConfig={toastConfig}
							modalShow={modalShow}
							setModalShow={setModalShow}
						/>
					),
				},
			],
		},
	]);
	return (
		<>
			<ToastContainer
				position="top-right"
				autoClose={2500}
				hideProgressBar={false}
				newestOnTop={false}
				closeOnClick
				rtl={false}
				pauseOnFocusLoss
				draggable
				pauseOnHover
				theme="colored"
			/>
			<RouterProvider router={router} />
		</>
	);
}

export default App;


//TODO: REMOVE DUPLICATE CODE
