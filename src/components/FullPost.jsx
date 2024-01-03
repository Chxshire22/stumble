import { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { db } from "./firebase";
import { getAuth } from "firebase/auth";
import { onChildAdded, push, ref as databaseRef, set } from "firebase/database";
import { useParams } from "react-router-dom";

function FullPost() {
  let { postId } = useParams();
  const auth = getAuth();
  const [commentInput, setCommentInput] = useState("");
  const [comments, setComments] = useState([]);

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
    // return () => {
    //   commentRef.off("child_added");
    // };
  }, [db, postId]);

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
            <p className="username">@mariotey</p>
          </Col>
          <Col>
            <Row>
              <p className="feed-post__date">12 Dec 2023</p>
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
                Cappadocia, Turkey
              </p>
            </Row>
          </Col>
          <Row>
            <p className="feed-post__content">
              XYZ Restaurant in Hakone is a hidden gem. The Sushi Platter and
              Black Cod Miso are culinary masterpieces, and the minimalist
              ambiance overlooking gardens adds a touch of tranquility. The Hot
              Springs Sake is a must-try, making XYZ an unforgettable dining
              experience in the heart of Hakone.
            </p>
          </Row>
        </Row>
      </Container>
      <div className="post-img-container">
        <img
          className="post-img"
          src="https://images.unsplash.com/photo-1631152282084-b8f1b380ccab?q=80&w=2573&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="hot air balloons"
        />
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
