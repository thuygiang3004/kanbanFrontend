import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import AddProjectModal from "./AddProjectModal";
import "./Modal.css";
import DatePicker from "react-date-picker";

const urlGetBoards = "http://localhost:3002/api/boards/all";
const urlPostNewProject = "http://localhost:3002/api/boards/";

const addProjectToDB = ({ projectData }) => {
  console.log(projectData);
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      title: projectData.title,
      dueDate: projectData.dueDate,
    }),
  };
  fetch(urlPostNewProject, requestOptions).then((response) => response.json());
  // .then(setLoading(false));
};

const Boards = () => {
  const [loading, setLoading] = useState(true);
  const [boards, setBoards] = useState([]);
  // const [value, setValue] = useState(0);

  const [value, onChange] = useState(new Date());
  const [projectTitle, setProjectTitle] = useState("");
  const [dueDate, setDueDate] = useState(new Date());
  const [modal, setModal] = useState(false);
  //   const [activeColumn, setActiveColumn] = useState();
  const toggleModal = () => {
    setModal(!modal);
  };

  if (modal) {
    document.body.classList.add("active-modal");
  } else {
    document.body.classList.remove("active-modal");
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const projectData = { title: projectTitle, dueDate: value };
    addProjectToDB({ projectData });
    toggleModal();
  };

  const fetchBoards = async () => {
    const reponse = await fetch(urlGetBoards);
    const newBoards = await reponse.json();
    setBoards(newBoards.boards);
    setLoading(false);
  };
  useEffect(() => {
    fetchBoards();
  }, [handleSubmit]);

  if (loading) {
    return (
      <section>
        <h1>Loading...</h1>
      </section>
    );
  }

  return (
    <section>
      <h2>Boards List</h2>
      {boards.map((board) => {
        const { _id, title, dueDate } = board;

        return (
          <article key={_id} style={{ border: "1px solid black" }}>
            <div>
              <h4>ID: {_id}</h4>
              <Link
                key={_id}
                to={`/board/${_id}`}
                state={{ boardTitle: { title } }}
              >
                {board.title}
              </Link>
              <div>
                <p>Due Date: </p>
                <p>{dueDate}</p>
              </div>
            </div>
          </article>
        );
      })}
      <button style={{ backgroundColor: "cyan" }} onClick={toggleModal}>
        Create new project
      </button>
      {modal && (
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
                    onChange={onChange}
                    value={value}
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
      )}
    </section>
  );
};

export default Boards;
