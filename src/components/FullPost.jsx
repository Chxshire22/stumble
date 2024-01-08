import { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { db } from "./firebase";
import { getAuth } from "firebase/auth";
import {
  onChildAdded,
  push,
  ref as databaseRef,
  set,
  get,
  child,
} from "firebase/database";
import { useNavigate, useParams } from "react-router-dom";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

function FullPost() {
  let { postId } = useParams();
  const auth = getAuth();
  const [commentInput, setCommentInput] = useState("");
  const [comments, setComments] = useState([]);
  const [post, setPost] = useState({});
  const [postRelativeTime, setPostRelativeTime] = useState(null);
  const navigate = useNavigate();

  //Fetch post data to pass in props
  useEffect(() => {
    console.log(postId);
    const postRef = databaseRef(db, `posts`);
    get(child(postRef, `/${postId}`))
      .then((snapshot) => {
        if (snapshot.exists()) {
          console.log(snapshot.val());
          setPost(snapshot.val());
        } else {
          console.log("No data available");
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, [postId]);

  // Fetch comments when component mounts and postId changes
  useEffect(() => {
    const commentRef = databaseRef(db, `posts/${postId}/comments`);
    onChildAdded(commentRef, (data) => {
      const commentData = data.val();
      setComments((prevState) => [
        ...prevState,
        {
          username: commentData.username,
          text: commentData.text,
          date: commentData.date,
          key: data.key,
        },
      ]);
    });
  }, [postId]);

  // Function to submit a new comment
  const writeData = (e) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (!user) {
      console.error("No user signed in!");
      return;
    }

    const commentListRef = databaseRef(db, `posts/${postId}/comments`);
    const newCommentRef = push(commentListRef);
    set(newCommentRef, {
      username: user.displayName,
      text: commentInput,
      date: new Date().toISOString(),
    })
      .then(() => {
        setCommentInput("");
      })
      .catch((error) => {
        console.error("Error writing comment: ", error);
      });
  };

  const updateRelativeTime = () => {
    dayjs.extend(relativeTime);
    setPostRelativeTime(dayjs(post.date).fromNow());
  };
  useEffect(() => {
    updateRelativeTime();
  }, [post.date]);

  setInterval(() => {
    updateRelativeTime();
  }, 1000 * 61);

  //for google map
  useEffect(() => {
    async function initMap() {
      const position = { lat: -25.344, lng: 131.031 };
      const { Map } = await google.maps.importLibrary("maps");
      const { AdvancedMarkerElement } = await google.maps.importLibrary(
        "marker"
      );

      const map = new Map(document.getElementById("map"), {
        zoom: 4,
        center: position,
      });

      const marker = new AdvancedMarkerElement({
        map: map,
        position: position,
        title: "Uluru",
      });
    }
    initMap();
  }, []);

  //render list of comments
  let commentListItems = comments.map((comment) => {
    return (
      <div key={comment.key} className="comment-item">
        <strong>{comment.username}</strong>: <span>{comment.text}</span>
        <p>
          <small>{dayjs(comment.date).fromNow()}</small>
        </p>
      </div>
    );
  });

  return (
    <div>
      <div className="feed-btns-col">
        <img
          src="https://firebasestorage.googleapis.com/v0/b/stumble-a6ed0.appspot.com/o/assets%2Fstumble-logo.webp?alt=media&token=72a22d6a-4de1-4a2c-b0bc-08fe0f660c8f"
          className="stumble-logo"
          alt=""
          onClick={() => navigate("/")}
        />
      </div>
      <Container className="post-header">
        <Row>
          <Col>
            <p className="username">{post.username}</p>
          </Col>
          <Col>
            <Row>
              <p className="feed-post__date">{postRelativeTime}</p>
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
                {post.location}
              </p>
            </Row>
          </Col>
          <Row>
            <p className="feed-post__content">{post.text}</p>
          </Row>
        </Row>
      </Container>
      <div className="full-post-img-container">
        <img
          className="full-post-img"
          src={post.imageLink}
          alt={post.imageLink}
        />
      </div>
      <div className="google-map-container">
        <div id="map" style={{ height: "400px", width: "100%" }}></div>
      </div>
      <div className="comment-container">
        <form onSubmit={writeData}>
          <input
            type="text"
            value={commentInput}
            placeholder="Leave a Comment..."
            onChange={(e) => setCommentInput(e.target.value)}
            className="comment-input"
          />
          <button type="submit" disabled={!commentInput} className="btn-base">
            Submit
          </button>
        </form>
      </div>
      <div>{commentListItems}</div>
    </div>
  );
}

export default FullPost;
