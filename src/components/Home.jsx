import Modal from "./Modal";
import { useState } from "react";

function Home() {
  const [openModal, setOpenModal] = useState(false);
  return (
    <div>
      <h1>home page</h1>
      <div className="button-container">
        <button
          className="open-modal-button"
          onClick={() => setOpenModal(true)}
        >
          What's on your mind?
        </button>
        {openModal && (
          <Modal openModal={openModal} setOpenModal={setOpenModal} />
        )}
      </div>
    </div>
  );
}

export default Home;
