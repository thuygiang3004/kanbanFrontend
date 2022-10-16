import React, { useEffect, useState } from "react";
import AddTaskModal from "./AddTaskModal";
import Cards from "./Cards";
import "./Modal.css";

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

const Columns = ({ data }) => {
  //   console.log(cardsData);
  const [modal, setModal] = useState(false);
  const [taskTitle, setTaskTitle] = useState("");
  const [column, setColumn] = useState(data[2].columnId); //Todo: get dynamically
  const [reload, setReload] = useState(false);

  //   const [activeColumn, setActiveColumn] = useState();
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
    addTaskToDB({ taskData });
    toggleModal();
    setReload(!reload);
  };

  //   const columnIds = data.map((column) => {
  //     return column.columnId;
  //   });
  //   console.log(columnIds);
  return (
    <>
      {data.map((column) => {
        const { cardIds, columnId, title, _id } = column;

        return (
          <section
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
                    {/* <div>
                      <input
                        type="text"
                        value={columnId}
                        disabled
                      />
                    </div> */}
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
            {/* {modal && <AddTaskModal title={title} />} */}
          </section>
        );
      })}
    </>
  );
};

export default Columns;
