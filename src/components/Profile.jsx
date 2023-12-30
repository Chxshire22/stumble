import { useEffect, useState } from "react";
import { Image, Dropdown } from "react-bootstrap";
import { auth, db, userRef } from "./firebase";
import { signOut } from "firebase/auth";
import { get, child, onValue, ref, query, orderByChild, equalTo } from "firebase/database";
import { useNavigate, useParams } from "react-router-dom";
import FeedPostCard from "./FeedPostCard";
import ModalCreatePost from "./ModalCreatePost";

function Profile(props) {


	let {modalShow, setModalShow} =props;

	// user can edit posts? if uid == auth.currentUser.uid
	const [profile, setProfile] = useState({});

	const { uid } = useParams();

	useEffect(() => {
		if (uid) {
			console.log(uid);
		}
	}, [uid]);

	useEffect(() => {
		get(child(userRef, `/${uid}`))
			.then((snapshot) => {
				if (snapshot.exists()) {
					console.log(snapshot.val());
					setProfile(snapshot.val());
				} else {
					console.log("No data available");
				}
			})
			.catch((error) => {
				console.error(error);
			});
	}, [uid]);

	const POSTS_FOLDER_NAME = "posts";
	const [posts, setPosts] = useState([]);

	useEffect(() => {
		const postsRef = query(ref(db, POSTS_FOLDER_NAME), orderByChild(`uid`), equalTo(uid));
		onValue(postsRef, (snapshot) => {
			const post = snapshot.val();
			const postsArray = Object.values(post);
			setPosts(postsArray);
		});
	}, []);


	const navigate = useNavigate();

	const logout = async() =>{
		try{
			await signOut(auth);
			navigate("/welcome")
		}catch(err){
			console.log(err)
		}
	}

	return (
    <div className="block flex-center-col">
      <header className="profile-page-header">
        {/* decided to upload the image to firebase */}
        <img
          src="https://firebasestorage.googleapis.com/v0/b/stumble-a6ed0.appspot.com/o/assets%2Fstumble-logo.webp?alt=media&token=72a22d6a-4de1-4a2c-b0bc-08fe0f660c8f"
          className="stumble-logo"
          alt=""
          onClick={() => navigate("/")}
        />
        <Image
          className="pfp pfp-profile-page"
          src={profile.displayPic}
          roundedCircle
          fluid
        />
        <h1 className="profile-page-user blue">{profile.username}</h1>
        <p className="bio profile-page-bio blue">{profile.bio}</p>
      </header>
      <div className="dropdown-container"></div>
      <hr />
      <div className="profile-body app-body">
        <div className="feed-btns-col">
          <button className="btn-base feed-btn">Saved Posts</button>
          <button className="btn-base feed-btn">Filters</button>
          <Dropdown>
            <Dropdown.Toggle className="btn-base feed-btn" id="dropdown-basic">
              Settings
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item onClick={logout}>Sign Out</Dropdown.Item>
              <Dropdown.Item onClick={() => navigate("/set-profile")}>
                Edit Profile
              </Dropdown.Item>
              <Dropdown.Item href="#/action-3">
                Toggle Theme (dark mode maybe?)
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
        <div className="profile-feed feed flex-center-col">
          <button
            className="btn-base btn-create-post"
            onClick={() => setModalShow(true)}
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
          />
          {/*placeholder posts. will map posts here soon*/}
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
              />
            ))}
        </div>
        <img
          className="feed-image-deco"
          src="https://firebasestorage.googleapis.com/v0/b/stumble-a6ed0.appspot.com/o/assets%2Fbermuda-79.png?alt=media&token=e4cc1f34-a389-4e38-9232-0f4b53c0d8f0"
        />
      </div>
    </div>
  );
}

export default Profile;
