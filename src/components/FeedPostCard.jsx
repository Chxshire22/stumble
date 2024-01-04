import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { ref, onValue, query, limitToFirst } from "firebase/database";
import { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { DB_USER_KEY, db } from "./firebase";
import { useNavigate } from "react-router-dom";

function FeedPostCard({ username, location, text, date, image, uid, postId }) {
  const navigate = useNavigate();
  const [postRelativeTime, setPostRelativeTime] = useState("");
  const [pfp, setPfp] = useState(null);
  const [firstComment, setFirstComment] = useState(null);

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

  useEffect(() => {
    try {
      onValue(ref(db, DB_USER_KEY + uid), (snapshot) => {
        setPfp(snapshot.val().displayPic);
        console.log(snapshot.val().displayPic);
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
  }, [postId, db]);

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
            <p className="feed-post__content">{text}</p>
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
                {location}
              </p>
            </Row>
          </Col>
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
              <p className="likes-count">102 likes</p>
            </div>
          </Col>
        </Row>
      </Container>
    </article>
  );
}

export default FeedPostCard;
