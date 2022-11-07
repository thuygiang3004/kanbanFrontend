import React, { useEffect, useState } from "react";
import AddTaskModal from "./AddTaskModal";
import Card from "./Card";
import "./Modal.css";
import { Droppable } from "react-beautiful-dnd";
import uuid from "react-uuid";

const urlPostNewCard = "http://localhost:3002/api/cards/";

const addTaskToDB = ({ taskData }) => {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      title: taskData.title,
      columnId: taskData.columnId,
      cardId: taskData.cardId,
    }),
  };
  fetch(urlPostNewCard, requestOptions).then((response) => response.json());
  // .then(setLoading(false));
};

const Column = ({ columnId, title, index, cardIds, reload1 }) => {
  // console.log(cardIds);
  const [modal, setModal] = useState(false);
  const [taskTitle, setTaskTitle] = useState("");
  const [column, setColumn] = useState(columnId);
  const [reload, setReload] = useState(false);
  const [reload2, setReload2] = useState(reload1);

  // Load card data
  const [loading, setLoading] = useState(true);
  const [cards, setCards] = useState([]);
  const fetchCards = () => {
    // Simple POST request with a JSON body using fetch
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ columnIds: [columnId] }),
    };
    fetch("http://localhost:3002/api/cards/getallcards", requestOptions)
      .then((response) => response.json())
      .then((data) => setCards(data.cards[0]))
      .then(setLoading(false));
  };

  useEffect(() => {
    fetchCards();
  }, [reload, reload2]);

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
    const cardId = uuid();
    const taskData = { title: taskTitle, columnId: column, cardId: cardId };
    addTaskToDB({ taskData });
    toggleModal();
    setReload(!reload);
    window.location.reload(false);
  };

  return (
    <Droppable droppableId={columnId}>
      {(provided) => (
        <div style={{ border: "1px solid black", margin: "10px" }}>
          <h3>{title}</h3>
          <div {...provided.droppableProps} ref={provided.innerRef}>
            {cardIds.map((cardId, index) => {
              const thisCardId = cardIds[index];
              let card = cards.find((card) => card.cardId == thisCardId);
              if (card) {
                return (
                  <Card
                    key={card.cardId}
                    id={card.cardId}
                    title={card.title}
                    data={card}
                    // reloadCard={reload}
                    index={index}
                  />
                );
              }
            })}
            {provided.placeholder}
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
        </div>
      )}
    </Droppable>
  );
};

export default Column;
