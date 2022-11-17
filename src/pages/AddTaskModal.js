import './Modal.css';
import React, { useState } from 'react';

function AddTaskModal({ title }) {
  console.log(title);
  const [modal, setModal] = useState(false);
  const toggleModal = () => {
    setModal(!modal);
  };

  if (modal) {
    document.body.classList.add('active-modal');
  } else {
    document.body.classList.remove('active-modal');
  }
  return (
    <div className="modal">
      <div onClick={toggleModal} className="overlay"></div>
      <div className="modal-content">
        <form>
          <h2>Add task</h2>
          <div className="form-control">
            <input type="text" value={title} />
            <input type="text" placeholder="task title" />
            <button type="submit" className="submit-btn btn">
              Submit
            </button>
          </div>
          <button className="close-modal" onClick={toggleModal}>
            &times;
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddTaskModal;
