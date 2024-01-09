import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import {
	ref,
	onValue,
	query,
	limitToFirst,
	runTransaction,
	remove,
} from "firebase/database";
import React, { useEffect, useState } from "react";
import { Container, Row, Col, Dropdown } from "react-bootstrap";
import { auth, DB_USER_KEY, db, storage } from "./firebase";
import { useNavigate } from "react-router-dom";
import { ref as storageRef, deleteObject } from "firebase/storage";

function FeedPostCard({
	username,
	location,
	text,
	date,
	image,
	uid,
	postId,
	likes,
}) {
	const navigate = useNavigate();
	const [postRelativeTime, setPostRelativeTime] = useState("");
	const [pfp, setPfp] = useState(null);
	const [firstComment, setFirstComment] = useState(null);

	//using day.js to update the time
	const updateRelativeTime = () => {
		dayjs.extend(relativeTime);
		setPostRelativeTime(dayjs(date).fromNow());
	};
	useEffect(() => {
		updateRelativeTime();
	}, [date]);

	setInterval(() => {
		updateRelativeTime();
	}, 1000 * 61);

	//write number of likes in database, don't increase the number if user has liked the same post
	const currentUser = auth.currentUser?.uid;
	const [hasLiked, setHasLiked] = useState(false);
	const writeData = (e) => {
		e.preventDefault();
		const postRef = ref(db, `posts/${postId}`);
		runTransaction(postRef, (post) => {
			if (!post.userWhoLiked) {
				post.userWhoLiked = {};
			}
			if (!post.userWhoLiked[currentUser]) {
				post.userWhoLiked[currentUser] = true;
				post.likes = (post.likes || 0) + 1;
				setHasLiked(true);
			} else if (post.userWhoLiked[currentUser]) {
				delete post.userWhoLiked[currentUser];
				post.likes = (post.likes || 0) - 1;
				setHasLiked(false);
			}
			return post;
		}).catch((error) => {
			console.error("Error writing comment: ", error);
		});
	};

	useEffect(() => {
		try {
			onValue(ref(db, DB_USER_KEY + uid), (snapshot) => {
				setPfp(snapshot.val().displayPic);
			});
		} catch (err) {
			console.error(err);
		}
	}, [uid]);

	//to fetch the first comment of the post
	useEffect(() => {
		const commentRef = ref(db, `posts/${postId}/comments`);
		const firstCommentQuery = query(commentRef, limitToFirst(1));

		onValue(firstCommentQuery, (snapshot) => {
			const commentSnapshot = snapshot.val();
			if (commentSnapshot) {
				const firstCommentKey = Object.keys(commentSnapshot)[0];
				const firstCommentData = commentSnapshot[firstCommentKey];
				setFirstComment(firstCommentData);
			}
		});
	}, [postId]);

	const deletePost = () => {
		remove(ref(db, `posts/${postId}`));
		const imageRef = storageRef(storage, image);
		deleteObject(imageRef);
	};

	// const TextDisplay = () => {
	// 	let textDisplay =text.split(" ").slice(0, 10).join(" ");
	// 	textDisplay = textDisplay.toString()
	// 	return { textDisplay };
	// };

	useEffect(() => {
		console.log(text.split(" ").slice(0, 8).join(" "));
	}, [text]);

	const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
		<a
			href=""
			ref={ref}
			onClick={(e) => {
				e.preventDefault();
				onClick(e);
			}}
		>
			{children}
		</a>
	));

	return (
		<article className="card feed-post">
			<Container className="card-header">
				<Row>
					<Col>
						<div
							onClick={() => {
								navigate(`/profile/${uid}`);
							}}
							className="original-poster-badge"
						>
							<img className="pfp-badge pfp-badge-card" src={pfp} />
							<span className="username">{username}</span>
						</div>
					</Col>
					<Col xs={6}>
						<p
							onClick={() => navigate(`/post/${postId}`)}
							className="feed-post__content"
						>
							{text.split(" ").length >= 8
								? text.split(" ").slice(0, 5).join(" ") + ", read full post..."
								: text}
						</p>
					</Col>
					<Col>
						<Row>
							<p className="feed-post__date">
								{postRelativeTime}
								<Dropdown>
									<Dropdown.Toggle
										as={CustomToggle}
										className="feed-post-dropdown"
										id="dropdown-custom-components"
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											width="16"
											height="16"
											fill="currentColor"
											className="bi bi-three-dots-vertical feed-post-options"
											viewBox="0 0 16 16"
										>
											<path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0" />
										</svg>
									</Dropdown.Toggle>

									<Dropdown.Menu>
										<Dropdown.Item onClick={deletePost}>Delete</Dropdown.Item>
									</Dropdown.Menu>
								</Dropdown>
							</p>
						</Row>
					</Col>
				</Row>
				<Row>
					<p className="feed-post__location">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="16"
							height="16"
							fill="currentColor"
							className="bi bi-geo-alt-fill map-pin"
							viewBox="0 0 16 16"
						>
							<path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10m0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6" />
						</svg>
						{location}
					</p>
				</Row>
			</Container>
			<div className="post-img-container">
				<img
					className="post-img"
					src={image}
					alt={image}
					onClick={() => navigate(`/post/${postId}`)}
				/>
			</div>
			<Container className="post-interactions">
				<Row>
					<Col>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="16"
							height="16"
							fill="currentColor"
							className="bi bi-chat-fill chat-icon"
							viewBox="0 0 16 16"
						>
							<path d="M8 15c4.418 0 8-3.134 8-7s-3.582-7-8-7-8 3.134-8 7c0 1.76.743 3.37 1.97 4.6-.097 1.016-.417 2.13-.771 2.966-.079.186.074.394.273.362 2.256-.37 3.597-.938 4.18-1.234A9.06 9.06 0 0 0 8 15" />
						</svg>
					</Col>
					{firstComment ? (
						<Col xs={7} className="post-details comments">
							<p className="comment-username">@{firstComment.username}</p>
							<p className="comment-content">{firstComment.text}</p>
						</Col>
					) : (
						<Col xs={7} className="no-comments">
							<p>--Be the first one to comment--</p>
						</Col>
					)}
					<Col>
						<div className="likes">
							<button className="btn-like" onClick={writeData}>
								{hasLiked ? (
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="16"
										height="16"
										fill="currentColor"
										className="bi bi-heart-fill heart-like"
										viewBox="0 0 16 16"
									>
										<path
											fillRule="evenodd"
											d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314"
										/>
									</svg>
								) : (
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="16"
										height="16"
										fill="currentColor"
										className="bi bi-heart heart-empty"
										viewBox="0 0 16 16"
									>
										<path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143q.09.083.176.171a3 3 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15" />
									</svg>
								)}
							</button>
							{likes ? (
								<p className="likes-count">{likes} likes</p>
							) : (
								<p className="likes-count">0 likes</p>
							)}
						</div>
					</Col>
				</Row>
			</Container>
		</article>
	);
}

export default FeedPostCard;
