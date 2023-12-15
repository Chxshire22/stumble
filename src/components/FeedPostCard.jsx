function FeedPostCard() {
  return (
    <div>
      <div className="card post-in-feed">
        <header>
          <h3>user.user</h3>
          <p>post content</p>
        </header>
        <div className="image-container"></div>
        <div className="post-details"></div>
      </div>
    </div>
  );
}

export default FeedPostCard;
