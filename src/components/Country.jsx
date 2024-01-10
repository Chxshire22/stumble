import ModalCreatePost from "./ModalCreatePost";
import FeedPostCard from "./FeedPostCard";
import React, { useState, useEffect } from "react";
import { auth, db } from "./firebase";
import {
	ref as databaseRef,
	equalTo,
	onValue,
	orderByChild,
	query,
} from "firebase/database";
import { signOut } from "firebase/auth";
import { Dropdown, Form } from "react-bootstrap";
import { redirect, useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

export default function Country(props) {
	const POSTS_FOLDER_NAME = "posts";

	//useParams to grab the country
	const { changedCountry, toastConfig} = useParams();

	let { modalShow, setModalShow } = props;
	const navigate = useNavigate();
	const [posts, setPosts] = useState([]);
	const [countriesList, setCountriesList] = useState([]);
	const [currCountry, setCurrCountry] = useState("");
	const [postsFilter, setPostsFilter] = useState("");
	const [newPostCreated, setNewPostCreated] = useState(false);

	useEffect(() => {
		if (!auth.currentUser) {
			redirect("/welcome");
		}
	}, []);

	useEffect(() => {
		if (newPostCreated) {
			setModalShow(false);
			toast.success("New post created!", toastConfig);
		}
	}, [newPostCreated]);

	//list of registered countries
	const countryRef = databaseRef(db, "country-list/");
	useEffect(() => {
		onValue(countryRef, (snapshot) => {
			const countriesObj = snapshot.val();
			const countriesArr = Object.keys(countriesObj);
			setCountriesList(countriesArr);
		});
	}, [posts]);

	const postsRef = databaseRef(db, POSTS_FOLDER_NAME);
	//render feed based on country
	useEffect(() => {
		if (changedCountry) {
			const currCountryRef = query(
				postsRef,
				orderByChild("country"),
				equalTo(changedCountry)
			);
			onValue(currCountryRef, (snapshot) => {
				if (snapshot.exists()) {
					const countryPost = snapshot.val();
					const countryPostsArr = Object.values(countryPost);
					if (postsFilter) {
						setPosts(
							countryPostsArr.filter((post) => post.filter == postsFilter)
						);
					} else {
						setPosts(countryPostsArr);
					}
				} else {
					setPosts([]);
				}
			});
		}
	}, [changedCountry, postsFilter]);

	const logout = async () => {
		try {
			await signOut(auth);
			navigate("/welcome");
		} catch (err) {
			console.log(err);
		}
	};

	//custom dropdown with search
	const NavigateToggle = React.forwardRef(({ children, onClick }, ref) => (
		<button
			className="btn-base feed-btn"
			ref={ref}
			onClick={(e) => {
				e.preventDefault();
				onClick(e);
			}}
		>
			{children}
		</button>
	));

	const CustomMenu = React.forwardRef(
		({ children, style, className, "aria-labelledby": labeledBy }, ref) => {
			const [value, setValue] = useState("");

			return (
				<div
					ref={ref}
					style={style}
					className={className}
					aria-labelledby={labeledBy}
				>
					<Form.Control
						autoFocus
						className="mx-3 my-2 w-auto"
						placeholder="Search country..."
						onChange={(e) => setValue(e.target.value)}
						value={value}
					/>
					<ul className="list-unstyled">
						{React.Children.toArray(children).filter(
							(child) =>
								!value || child.props.children.toLowerCase().startsWith(value)
						)}
					</ul>
				</div>
			);
		}
	);

	const changeCurrCountry = (country) => {
		setCurrCountry(country);
		navigate(`/country/${country}`);
	};

	const resetCurrCountry = () => {
		setCurrCountry(null);
		navigate("/");
	};

	const handleOpenModal = () => {
		setModalShow(true);
		setNewPostCreated(false);
	};

	return (
		<div className="block flex-center-col">
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

			<div className="profile-body app-body">
				<div className="feed-btns-col">
					<img
						src="https://firebasestorage.googleapis.com/v0/b/stumble-a6ed0.appspot.com/o/assets%2Fstumble-logo.webp?alt=media&token=72a22d6a-4de1-4a2c-b0bc-08fe0f660c8f"
						className="stumble-logo"
						alt=""
						onClick={resetCurrCountry}
					/>
					<Dropdown>
						<Dropdown.Toggle as={NavigateToggle} id="dropdown-basic">
							Countries
						</Dropdown.Toggle>

						<Dropdown.Menu as={CustomMenu}>
							{countriesList.map((country) => (
								<Dropdown.Item onClick={() => changeCurrCountry(country)}>
									{country}
								</Dropdown.Item>
							))}
						</Dropdown.Menu>
					</Dropdown>
					<Dropdown>
						<Dropdown.Toggle
							className="btn-base btn-create-post-filter"
							id="dropdown-basic"
						>
							Filter
						</Dropdown.Toggle>

						<Dropdown.Menu>
							<Dropdown.Item onClick={() => setPostsFilter("Tips")}>
								Tips
							</Dropdown.Item>
							<Dropdown.Item onClick={() => setPostsFilter("Event")}>
								Event
							</Dropdown.Item>
							<Dropdown.Item onClick={() => setPostsFilter("Scam Alert")}>
								Scam Alert
							</Dropdown.Item>
							<Dropdown.Item
								onClick={() => setPostsFilter("Hostel Recommendation")}
							>
								Hostel Recommendation
							</Dropdown.Item>
							<Dropdown.Item
								onClick={() => setPostsFilter("Tour Recommendation")}
							>
								Tour Recommendation
							</Dropdown.Item>
							<Dropdown.Item
								onClick={() => setPostsFilter("Food Recommendation")}
							>
								Food Recommendation
							</Dropdown.Item>
							<Dropdown.Item onClick={() => setPostsFilter("")}>
								None
							</Dropdown.Item>
						</Dropdown.Menu>
					</Dropdown>

					<Dropdown>
						<Dropdown.Toggle className="btn-base feed-btn" id="dropdown-basic">
							Settings
						</Dropdown.Toggle>

						<Dropdown.Menu>
							<Dropdown.Item onClick={logout}>Sign Out</Dropdown.Item>
							<Dropdown.Item onClick={() => navigate("/set-profile")}>
								Edit Profile
							</Dropdown.Item>
							<Dropdown.Item href="#/action-3">Toggle Theme</Dropdown.Item>
						</Dropdown.Menu>
					</Dropdown>
				</div>
				<div className="home-content">
					<h1 className="home-feed-header">
						{changedCountry ? changedCountry : `Home`}
					</h1>
					<button
						className="btn-base btn-create-post"
						onClick={handleOpenModal}
					>
						<img
							className="pfp-badge badge-left"
							src={auth.currentUser?.photoURL}
						/>
						<p>What&apos;s on your mind?</p>
					</button>
					<ModalCreatePost
						show={modalShow}
						onHide={() => setModalShow(false)}
						newPostCreated={newPostCreated}
						setNewPostCreated={setNewPostCreated}
					/>
					<div className="profile-feed feed flex-center-col">
						{posts
							.slice()
							.reverse()
							.map((post, index) => (
								<FeedPostCard
									key={index}
									username={post.username}
									location={post.location}
									text={post.text}
									date={post.date}
									image={post.imageLink}
									uid={post.uid}
									postId={post.postId}
								/>
							))}
					</div>
				</div>
				<div className="profile-container">
					<button
						className="btn-base btn-profile"
						onClick={() => navigate(`/profile/${auth.currentUser?.uid}`)}
					>
						<p>Profile</p>
						<img
							className="pfp-badge badge-right"
							src={auth.currentUser?.photoURL}
						/>
					</button>
					<img
						className="feed-image-deco"
						src="https://firebasestorage.googleapis.com/v0/b/stumble-a6ed0.appspot.com/o/assets%2Fflamenco-excited-for-a-flight.webp?alt=media&token=56ea81fb-9bf9-48bd-bfd5-ea3413d800bb"
					/>
				</div>
			</div>
		</div>
	);
}
