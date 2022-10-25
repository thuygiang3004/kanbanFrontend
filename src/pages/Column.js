import React, { useEffect, useState } from "react";
import AddTaskModal from "./AddTaskModal";
import Cards from "./Cards";
import "./Modal.css";
import { Droppable } from "react-beautiful-dnd";

const urlPostNewProject = "http://localhost:3002/api/cards/";

const addTaskToDB = ({ taskData }) => {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      title: taskData.title,
      columnId: taskData.columnId,
      cardId: new Date().toString(), //Todo: get dynamically
    }),
  };
  fetch(urlPostNewProject, requestOptions).then((response) => response.json());
  // .then(setLoading(false));
};

const Column = ({ columnId, key, title, cards, index }) => {
  const [modal, setModal] = useState(false);
  const [taskTitle, setTaskTitle] = useState("");
  const [column, setColumn] = useState(columnId);
  const [reload, setReload] = useState(false);

  const toggleModal = () => {
    setModal(!modal);
  };

  if (modal) {
    document.body.classList.add("active-modal");
  } else {
    document.body.classList.remove("active-modal");
  }

  const handleSubmit = (e, columnId) => {
    e.preventDefault();
    const taskData = { title: taskTitle, columnId: column };
    console.log(taskData);
    addTaskToDB({ taskData });
    toggleModal();
    setReload(!reload);
  };

  return (
    <Droppable droppableId={columnId}>
      {(provided) => (
        <section
          {...provided.droppableProps}
          ref={provided.innerRef}
          key={columnId}
          style={{ border: "1px solid black", margin: "10px" }}
        >
          <h3>{title}</h3>
          <div>
            <Cards data={columnId} reloadCard={reload} />
          </div>
          <button style={{ backgroundColor: "cyan" }} onClick={toggleModal}>
            Add task
          </button>
          {modal && (
            <div className="modal">
              <div onClick={toggleModal} className="overlay"></div>
              <div className="modal-content">
                <form onSubmit={handleSubmit}>
                  <h2>Add task</h2>
                  <div className="form-control">
                    <div>
                      <label>Status</label>
                      <input type="text" value={title} disabled />
                    </div>
                    <div>
                      <label>Task Title</label>
                      <input
                        type="text"
                        placeholder="task title"
                        value={taskTitle}
                        onChange={(e) => setTaskTitle(e.target.value)}
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
          {provided.placeholder}
        </section>
      )}
    </Droppable>
  );
};

export default Column;
