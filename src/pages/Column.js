import React, { useEffect, useState } from "react";
import Card from "./Card";
import "./Modal.css";
import { Droppable } from "react-beautiful-dnd";
import uuid from "react-uuid";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const urlPostNewCard = "http://localhost:3002/api/cards/";

const Column = ({ columnId, title, index, cardIds, fetchColumns }) => {
  // console.log(cardIds);
  const [modal, setModal] = useState(false);
  const [taskTitle, setTaskTitle] = useState("");
  const [column, setColumn] = useState(columnId);
  // const [reload, setReload] = useState(false);
  const [cardIdList, setCardIdList] = useState(cardIds);

  // const [value, onChange] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

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
  }, [cardIds, cardIdList]);

  useEffect(() => {
    fetchColumns();
  }, [cardIdList]);

  const toggleModal = () => {
    setModal(!modal);
  };

  if (modal) {
    document.body.classList.add("active-modal");
  } else {
    document.body.classList.remove("active-modal");
  }

  //Handle when adding task
  const handleSubmit = (e, columnId) => {
    e.preventDefault();
    const cardId = uuid();
    const taskData = {
      title: taskTitle,
      dueDate: selectedDate,
      columnId: column,
      cardId: cardId,
    };

    const addTaskToDB = async ({ taskData }) => {
      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: taskData.title,
          dueDate: taskData.dueDate,
          columnId: taskData.columnId,
          cardId: taskData.cardId,
        }),
      };
      const result = await fetch(urlPostNewCard, requestOptions).then(
        (response) => response.json()
      );
      console.log(result);
      const newCardId = await result.cardId;
      setCardIdList((oldCardIdList) => [...oldCardIdList, newCardId]);
    };

    addTaskToDB({ taskData });
    toggleModal();
    // window.location.reload(false);
  };

  return (
    <Droppable droppableId={columnId}>
      {(provided) => (
        <div className="column">
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
                    columnTitle={title}
                    columnId={columnId}
                    data={card}
                    // reloadCard={reload}
                    index={index}
                    fetchCards={fetchCards}
                    cardIds={cardIds}
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
                      <label htmlFor="taskTitle">Task Title</label>
                      <input
                        type="text"
                        name="taskTitle"
                        placeholder="task title"
                        value={taskTitle}
                        onChange={(e) => setTaskTitle(e.target.value)}
                      />
                    </div>
                    <div>
                      <label htmlFor="dueDate">Due Date</label>
                      <DatePicker
                        name="dueDate"
                        onChange={(date) => setSelectedDate(date)}
                        selected={selectedDate}
                        isClearable
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
