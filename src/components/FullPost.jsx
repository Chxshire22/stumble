import { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { db } from "./firebase";
import { push, ref as databaseRef, set } from "firebase/database";

const COMMENTS_FOLDER_NAME = "comments";

function FullPost() {
  const [commentInput, setCommentInput] = useState("");
  const [comments, setComments] = useState("");

  useEffect(() => {
    const commentRef = databaseRef(db, COMMENTS_FOLDER_NAME);
    onChildAdded(commentRef, (data) => {
      setComments((prevState) => [
        ...prevState,
        { username: data.username, val: data.val() },
      ]);
    });
  });

  const writeData = (e) => {
    e.preventDefault();
    const commentListRef = databaseRef(db, COMMENTS_FOLDER_NAME);
    const newCommentRef = push(commentListRef);
    set(newCommentRef, commentInput);
    setCommentInput("");
  };

  let commentListItems = comments.map((comment) => (
    <div>
      <Row>{comment.username}</Row>
      <Row>{comment.val}</Row>
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
          <button type="submit" disabled={!commentInput}></button>
        </form>
      </div>
      <p className="username">@mariotey</p>
      <div>
        <commentListItems />
      </div>
    </div>
  );
}

export default FullPost;
