import React, { useState, useEffect, useReducer, useContext } from "react";
import { Link } from "react-router-dom";
import "./Modal.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "../api/axios";
import AuthContext from "../context/AuthProvider";

const urlGetBoards = "http://localhost:3002/api/boards/all";
const urlPostNewProject = "http://localhost:3002/api/boards/";

const Boards = () => {
  const [loading, setLoading] = useState(true);
  const [boards, setBoards] = useState([]);

  // const [value, onChange] = useState(new Date());
  const [projectTitle, setProjectTitle] = useState("");
  // const [dueDate, setDueDate] = useState(new Date());
  const [modal, setModal] = useState(false);
  const [reducerValue, forceUpdate] = useReducer((x) => x + 1, 0);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const { auth } = useContext(AuthContext);

  const toggleModal = () => {
    setModal(!modal);
  };

  if (modal) {
    document.body.classList.add("active-modal");
  } else {
    document.body.classList.remove("active-modal");
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const addProjectToDB = async ({ projectData }) => {
      const addedResult = await axios.post(
        urlPostNewProject,
        JSON.stringify({
          title: projectData.title,
          dueDate: projectData.dueDate,
        }),
        {
          headers: {
            "Content-Type": "application/json",
            authorization: "Bearer " + auth.accessToken,
          },
        }
      );
      const newBoard = await addedResult.data.result;
      setBoards((oldBoards) => [...oldBoards, newBoard]);
    };

    const projectData = { title: projectTitle, dueDate: selectedDate };
    addProjectToDB({ projectData });

    toggleModal();
  };

  const fetchBoards = async () => {
    const response = await axios.get(urlGetBoards, {
      headers: {
        authorization: "Bearer " + auth.accessToken,
      },
    });
    const newBoards = await response.data.boards;
    setBoards(newBoards);
    setLoading(false);
  };
  useEffect(() => {
    fetchBoards();
  }, [boards]);

  if (loading) {
    return (
      <section>
        <h1>Loading...</h1>
      </section>
    );
  }

  if (!auth.accessToken) {
    return (
      <>
        <div className="boards-centered">
          <h2>
            Please{" "}
            <Link to={"/login"} className="boards-login">
              sign in
            </Link>{" "}
            to view your boards
          </h2>
        </div>
      </>
    );
  }
  return (
    <section>
      <div className="boards-section">
        <h2>Boards List</h2>
        <button className="new-project-btn btn" onClick={toggleModal}>
          Create new project
        </button>

        {boards.map((board) => {
          const { _id, title, dueDate } = board;
          return (
            <article key={_id} style={{ border: "1px solid white" }}>
              <div>
                <h4 style={{ display: "none" }}>ID: {_id}</h4>
                <h3>
                  {" "}
                  Project Title :{" "}
                  <Link
                    key={_id}
                    to={`/board/${_id}`}
                    state={{ boardTitle: { title } }}
                  >
                    {board.title}
                  </Link>
                </h3>
                <div>
                  <p> Due Date: {dueDate}</p>
                </div>
              </div>
            </article>
          );
        })}

        {modal && (
          <div className="modal modal-new-project">
            <div onClick={toggleModal} className="overlay"></div>
            <div className="modal-content">
              <form onSubmit={handleSubmit}>
                <h2>Create new project</h2>
                <div className="form-control">
                  <div className="form-group">
                    <label htmlFor="projectTitle">Project title</label>
                    <input
                      name="projectTitle"
                      type="text"
                      placeholder="Project title"
                      value={projectTitle}
                      onChange={(e) => setProjectTitle(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="dueDate">Due Date</label>
                    <DatePicker
                      name="dueDate"
                      onChange={(date) => setSelectedDate(date)}
                      selected={selectedDate}
                      isClearable
                    />
                  </div>
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
        )}
      </div>
    </section>
  );
};

export default Boards;
