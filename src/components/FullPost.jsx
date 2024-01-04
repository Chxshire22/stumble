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
import { useParams } from "react-router-dom";

function FullPost() {
  let { postId } = useParams();
  const auth = getAuth();
  const [commentInput, setCommentInput] = useState("");
  const [comments, setComments] = useState([]);
  const [post, setPost] = useState({});

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

  //render list of comments
  let commentListItems = comments.map((comment) => (
    <div key={comment.key}>
      <strong>{comment.username}</strong>: {comment.text}
    </div>
  ));


  return (
    <div>
      <Container className="post-header">
        <Row>
          <Col>
            <p className="username">{post?.username}</p>
          </Col>
          <Col>
            <Row>
              <p className="feed-post__date">{post.date}</p>
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
        <img className="full-post-img" src={post.imageLink} alt={post.imageLink} />
      </div>
      <div className="comment-container">
        <form onSubmit={writeData}>
          <input
            type="text"
            value={commentInput}
            placeholder="Leave a Commment..."
            onChange={(e) => setCommentInput(e.target.value)}
          />
          <button type="submit" disabled={!commentInput}>
            Submit
          </button>
        </form>
      </div>
      <div>{commentListItems}</div>
    </div>
  );
}

export default FullPost;
