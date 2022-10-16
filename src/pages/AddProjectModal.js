import "./Modal.css";
import React, { useState } from "react";
import DatePicker from "react-date-picker";

const addProjectToDB = ({ projectData }) => {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title: projectData.title }),
  };
  fetch("http://localhost:3002/api/boards/", requestOptions).then((response) =>
    response.json()
  );
  // .then(setLoading(false));
};

function AddProjectModal() {
  const [modal, setModal] = useState(false);
  const [value, onChange] = useState(new Date());
  const [projectTitle, setProjectTitle] = useState("");
  const [dueDate, setDueDate] = useState(new Date());

  const toggleModal = () => {
    setModal(!modal);
    console.log(modal);
  };

  if (modal) {
    document.body.classList.add("active-modal");
  } else {
    document.body.classList.remove("active-modal");
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const projectData = { title: projectTitle };
    addProjectToDB({ projectData });
  };

  return (
    <div className="modal">
      <div onClick={toggleModal} className="overlay"></div>
      <div className="modal-content">
        <form onSubmit={handleSubmit}>
          <h2>Create new project</h2>
          <div className="form-control">
            <div>
              <label htmlFor="projectTitle">Project title</label>
              <input
                name="projectTitle"
                type="text"
                placeholder="Project title"
                value={projectTitle}
                onChange={(e) => setProjectTitle(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="dueDate">Due Date</label>
              <DatePicker
                name="dueDate"
                onChange={(e) => setDueDate(e.target.value)}
                value={dueDate}
              />
            </div>
            <button type="submit" className="submit-btn">
              Submit
            </button>
          </div>
          <button className="close-modal" onClick={toggleModal}>
            CLOSE
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddProjectModal;
