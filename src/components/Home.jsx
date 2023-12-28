
import ModalCreatePost from "./ModalCreatePost";
import FeedPostCard from "./FeedPostCard";
import { useState } from "react";
import Button from "react-bootstrap/Button";

function Home() {
  const [modalShow, setModalShow] = useState(false);

  // const handleClickOpen = () => {
  //   setOpenModal(true);
  // };

  // const handleClose = () => {
  //   setOpenModal(false);
  // };

  return (
    <div>
      <h1>home page</h1>
      <div className="button-container">
        {/* <Button className="open-modal-button" onClick={handleClickOpen}>
          What&apos;s on your mind?
        </Button>
        <ModalCreatePost openModal={openModal} handleClose={handleClose} /> */}
        <Button variant="primary" onClick={() => setModalShow(true)}>
          What&apos;s on your mind?
        </Button>

        <ModalCreatePost show={modalShow} onHide={() => setModalShow(false)} />
      </div>

      <FeedPostCard />

    </div>
  );
}

export default Home;
