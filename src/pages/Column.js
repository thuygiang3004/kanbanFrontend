import React, { useEffect, useState, useContext } from "react";
import Card from "./Card";
import "./Modal.css";
import { Droppable } from "react-beautiful-dnd";
import uuid from "react-uuid";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "../api/axios";
import AuthContext from "../context/AuthProvider";
import { FaEdit } from "react-icons/fa";

const urlPostNewCard = "http://localhost:3002/api/cards/";
const urlGetMembers = "boards/members/all";

const Column = ({
  columnId,
  title,
  index,
  cardIds,
  fetchColumns,
  boardId,
  toggleColModal,
  isNew,
  setIsNew,
  editingColId,
  setEditingColId,
  columnTitle,
  setColumnTitle,
}) => {
  const [modal, setModal] = useState(false);
  const [editColModal, setEditColModal] = useState(false);
  const [taskTitle, setTaskTitle] = useState("");
  const [column, setColumn] = useState(columnId);
  const [cardIdList, setCardIdList] = useState(cardIds);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [members, setMembers] = useState([]);
  const [assignee, setAssignee] = useState(members[0]);
  const [currentAssignee, setCurrentAssignee] = useState();
  // console.log(currentAssignee?._id);

  // Load card data
  const [loading, setLoading] = useState(true);
  const [cards, setCards] = useState([]);
  const { auth } = useContext(AuthContext);
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
    // console.log(cards);
  };

  const fetchMembers = async () => {
    const response = await axios.post(
      urlGetMembers,
      JSON.stringify({
        boardId: boardId.id,
      }),
      {
        headers: {
          "Content-Type": "application/json",
          authorization: "Bearer " + auth.accessToken,
        },
      }
    );
    const newMembers = await response.data.members;
    const blankMember = {
      _id: "",
      name: "",
      email: "",
      isOwner: false,
    };
    const displayMembers = [blankMember, ...newMembers];
    // console.log(displayMembers);
    setMembers(displayMembers);
  };

  useEffect(() => {
    fetchMembers();
  }, [modal]);

  useEffect(() => {
    fetchCards();
  }, [cardIds, cardIdList]);

  useEffect(() => {
    fetchColumns();
  }, [cardIdList]);

  useEffect(() => {
    cards?.map((card) => {
      let thisAssignee;
      if (card.assignee) {
        thisAssignee = members.find(
          (member) => member._id.toString() == card.assignee._id.toString()
        );
      }
      setCurrentAssignee(thisAssignee);
      // console.log(currentAssignee);
    });
  }, [cards, cardIds]);

  const toggleModal = () => {
    setModal(!modal);
  };
  // const toggleEditColModal = () => {
  //   setModal(!editColModal);
  // };

  if (modal) {
    document.body.classList.add("active-modal");
  } else {
    document.body.classList.remove("active-modal");
  }

  if (editColModal) {
    document.body.classList.add("active-modal");
  } else {
    document.body.classList.remove("active-modal");
  }

  //Handle when adding task
  const handleSubmit = (e, columnId) => {
    e.preventDefault();
    console.log(assignee);
    const cardId = uuid();
    const taskData = {
      title: taskTitle,
      dueDate: selectedDate,
      columnId: column,
      cardId: cardId,
      assignee: assignee,
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
          assignee: taskData.assignee,
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
          <div className="column-title-div">
            <h3>{title}</h3>
            <button
              type="button"
              className="edit-btn"
              onClick={() => {
                setIsNew(false);
                toggleColModal();
                setEditingColId(columnId);
                setColumnTitle(title);
              }}
            >
              <FaEdit />
            </button>
          </div>
          <div className="add-task-btn-div">
            <button className="add-task-btn btn" onClick={toggleModal}>
              Add task
            </button>
          </div>

          <div {...provided.droppableProps} ref={provided.innerRef}>
            {cardIds.map((cardId, index) => {
              const thisCardId = cardIds[index];
              let card = cards?.find((card) => card.cardId == thisCardId);
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
                    members={members}
                    currentAssignee={currentAssignee}
                  />
                );
              }
            })}
            {provided.placeholder}
          </div>

          {modal && (
            <div className="modal">
              <div onClick={toggleModal} className="overlay"></div>
              <div className="modal-content">
                <form onSubmit={handleSubmit}>
                  <h2>Add task</h2>
                  <div className="form-control">
                    <div className="form-group">
                      <label>Status</label>
                      <input type="text" value={title} disabled />
                    </div>
                    <div className="form-group">
                      <label htmlFor="taskTitle">Task Title</label>
                      <input
                        type="text"
                        name="taskTitle"
                        placeholder="task title"
                        value={taskTitle}
                        onChange={(e) => setTaskTitle(e.target.value)}
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

                    <div className="form-group">
                      <label htmlFor="assignee">Assignee</label>
                      <select
                        name="assignee"
                        value={assignee}
                        onChange={(e) => {
                          const selectedMember = e.target.value;
                          setAssignee(selectedMember);
                          console.log(assignee);
                        }}
                      >
                        {members.map((member) => {
                          return (
                            <option value={member._id}>{member.name}</option>
                          );
                        })}
                      </select>
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
      )}
    </Droppable>
  );
};

export default Column;
