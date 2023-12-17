import { Container, Row, Col } from "react-bootstrap";

function Playground() {
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
      <div className="post-details comments">
        <p className="comment-username">@chxshire22</p>
        <p className="comment-content">
          wow can't wait to go there end of this month!
        </p>
      </div>
    </article>
  );
}

export default Playground;