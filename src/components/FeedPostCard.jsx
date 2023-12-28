import { Container, Row, Col } from "react-bootstrap";

function FeedPostCard() {
  return (
    <article className="card feed-post">
      <Container className="card-header">
        <Row>
          <Col>
            <p className="username">@mariotey</p>
          </Col>
          <Col xs={6}>
            <p className="feed-post__content">Cappadocia was AMAZING</p>
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
        </Row>
      </Container>
      <div className="post-img-container">
        <img
          className="post-img"
          src="https://images.unsplash.com/photo-1631152282084-b8f1b380ccab?q=80&w=2573&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="hot air balloons"
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
          <Col xs={7} className="post-details comments">
            <p className="comment-username">@chxshire22</p>
            <p className="comment-content">
              wow can&apos;t wait to go there end of this month!
            </p>
          </Col>
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
