import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Draggable } from "react-beautiful-dnd";
import { FaEdit, FaTrash } from "react-icons/fa";
import "./Modal.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const Card = ({
  data,
  index,
  id,
  columnTitle,
  fetchCards,
  columnId,
  cardIds,
}) => {
  const { title, dueDate, cardId } = data;
  const [modal, setModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [taskTitle, setTaskTitle] = useState(title);
  const [selectedDate, setSelectedDate] = useState(
    dueDate ? new Date(dueDate) : null
  );
  const [cardIdList, setCardIdList] = useState(cardIds);

  const toggleModal = () => {
    setModal(!modal);
  };

  const toggleDeleteModal = () => {
    setDeleteModal(!deleteModal);
  };

  if (deleteModal) {
    document.body.classList.add("active-modal");
  } else {
    document.body.classList.remove("active-modal");
  }

  if (modal) {
    document.body.classList.add("active-modal");
  } else {
    document.body.classList.remove("active-modal");
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const editTaskInDB = async ({ taskData }) => {
      const urlEditCard = `http://localhost:3002/api/cards/card/${taskData.cardId}`;
      console.log(taskData);
      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cardId: taskData.cardId,
          title: taskData.taskTitle,
          dueDate: taskData.dueDate,
        }),
      };
      const result = await fetch(urlEditCard, requestOptions).then((response) =>
        response.json()
      );
      console.log(result);
      const updatedCard = await result.data;
      setTaskTitle(updatedCard.title);
      setSelectedDate(updatedCard.dueDate);
    };

    const taskData = {
      cardId: cardId,
      taskTitle: taskTitle,
      dueDate: selectedDate,
    };
    editTaskInDB({ taskData });
    toggleModal();
  };

  const handleDeleteSubmit = (e) => {
    e.preventDefault();

    const urlRemoveCard = `http://localhost:3002/api/cards/card/remove/${cardId}`;

    const removeTaskfromDB = async () => {
      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cardId: cardId,
          columnId: columnId,
        }),
      };
      const result = await fetch(urlRemoveCard, requestOptions).then(
        (response) => response.json()
      );
      const newCardIds = await result.data.cardIds;
      setCardIdList(newCardIds);
    };

    removeTaskfromDB();
    toggleDeleteModal();
  };

  useEffect(() => {
    fetchCards();
  }, [taskTitle, selectedDate, cardIdList]);

  return (
    <Draggable draggableId={String(id)} index={index} key={cardId}>
      {(provided, snapshot) => {
        const style = {
          border: "1px solid black",
          margin: "10px",
          background: "#454B1B",
          color: "#FFFFFF",
          ...provided.draggableProps.style,
        };

        return (
          <div
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
            style={style}
          >
            <div className="Card">
              <h4>{title}</h4>
              <p>Due: {dueDate}</p>
              <button type="button" className="edit-btn" onClick={toggleModal}>
                <FaEdit />
              </button>
              <button
                type="button"
                className="delete-btn"
                onClick={toggleDeleteModal}
              >
                <FaTrash />
              </button>

              {modal && (
                <div className="modal" style={{ color: "black" }}>
                  <div onClick={toggleModal} className="overlay"></div>
                  <div className="modal-content">
                    <form onSubmit={handleSubmit}>
                      <h2>Edit task</h2>
                      <div className="form-control">
                        <div>
                          <label>Status</label>
                          <input type="text" value={columnTitle} disabled />
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

              {deleteModal && (
                <div className="modal" style={{ color: "black" }}>
                  <div onClick={toggleDeleteModal} className="overlay"></div>
                  <div className="modal-content">
                    <form onSubmit={handleDeleteSubmit}>
                      <h2>Would you like to delete this task?</h2>
                      <div className="form-control">
                        <div>
                          <label>Status</label>
                          <input type="text" value={columnTitle} disabled />
                        </div>
                        <div>
                          <label htmlFor="taskTitle">Task Title</label>
                          <input
                            type="text"
                            name="taskTitle"
                            value={taskTitle}
                            disabled
                          />
                        </div>
                        <div>
                          <label htmlFor="dueDate">Due Date</label>
                          <DatePicker
                            name="dueDate"
                            selected={selectedDate}
                            disabled
                          />
                        </div>
                        <button type="submit" className="submit-btn">
                          Delete
                        </button>
                      </div>
                      <button
                        className="close-modal"
                        onClick={toggleDeleteModal}
                      >
                        CLOSE
                      </button>
                    </form>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      }}
    </Draggable>
  );
};

export default Card;
