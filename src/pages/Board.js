import React, { useState, useEffect } from "react";
import { Link, useParams, useLocation } from "react-router-dom";
import axios from "axios";
import uuid from "react-uuid";

import Column from "./Column";

import { DragDropContext } from "react-beautiful-dnd";

const urlReorderCardSameColumn =
  "http://localhost:3002/api/cards/reorder/samecolumn";
const reorderCardSameColumn = (columnId, cardIds) => {
  console.log(columnId);
  console.log(cardIds);
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      sameColumnId: columnId,
      samecolumnCardIds: cardIds,
    }),
  };
  fetch(urlReorderCardSameColumn, requestOptions)
    .then((response) => response.json())
    .then(console.log("updated"));
  // .then(setLoading(false));
};

const urlReorderCardDifferentColumn =
  "http://localhost:3002/api/cards/reorder/differentcolumn";
const reorderCardDifferentColumn = (
  pulledOutCardId,
  removedColumnId,
  addedColumnId,
  removedColumnCardIds,
  addedColumnCardIds
) => {
  // console.log(removedColumnCardIds);

  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      reorderedCardId: pulledOutCardId,
      removedColumnId: removedColumnId,
      addedColumnId: addedColumnId,
      removedColumnCardIds: removedColumnCardIds,
      addedColumnCardIds: addedColumnCardIds,
    }),
  };
  fetch(urlReorderCardDifferentColumn, requestOptions)
    .then((response) => response.json())
    .then(console.log("updated"));
  // .then(setLoading(false));
};

const urlPostNewColumn = "http://localhost:3002/api/columns/";
const addColumnToDB = (title, boardId, columnId) => {
  console.log(title);
  console.log(boardId);
  console.log(columnId);
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      title: title,
      columnId: columnId,
      boardId: boardId,
    }),
  };
  fetch(urlPostNewColumn, requestOptions).then((response) => response.json());
  // .then(setLoading(false));
};

const Board = () => {
  const boardId = useParams();
  const columnsurl = "http://localhost:3002/api/columns/all/" + boardId.id;

  const [loading, setLoading] = useState(true);
  const [columns, setColumns] = useState([]);
  const [reload1, setReload1] = useState(false);

  const location = useLocation();
  const { boardTitle } = location.state;
  // console.log(boardTitle);

  const [modal, setModal] = useState(false);
  const [columnTitle, setColumnTitle] = useState("");

  const onDragEnd = (result) => {
    // console.log(result);
    const { destination, source, draggableId, type } = result;
    if (!destination) {
      return;
    }
    const targetColumnId = destination.droppableId;

    const targetColumn = columns.find(
      (column) => column.columnId == targetColumnId
    );

    // In the same column
    if (destination.droppableId == source.droppableId) {
      const pulledOutCardId = targetColumn.cardIds.splice(source.index, 1);
      const newCardIds = targetColumn.cardIds;
      targetColumn.cardIds.splice(destination.index, 0, ...pulledOutCardId);
      reorderCardSameColumn(targetColumnId, newCardIds);
    }

    //If different column
    if (destination.droppableId != source.droppableId) {
      const sourceColumnId = source.droppableId;

      const sourceColumn = columns.find(
        (column) => column.columnId == sourceColumnId
      );

      const pulledOutCardId = sourceColumn.cardIds.splice(source.index, 1);
      // console.log(pulledOutCardId);
      const removedColumnCardIds = sourceColumn.cardIds;
      // console.log(removedColumnCardIds);
      targetColumn.cardIds.splice(destination.index, 0, ...pulledOutCardId);
      const addedColumnCardIds = targetColumn.cardIds;
      // console.log(addedColumnCardIds);
      reorderCardDifferentColumn(
        pulledOutCardId,
        sourceColumnId,
        targetColumnId,
        removedColumnCardIds,
        addedColumnCardIds
      );
      setReload1(!reload1);
      window.location.reload(false);
    }
  };

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
    const columnId = uuid();
    addColumnToDB(columnTitle, boardId.id, columnId);
    toggleModal();
    // setReload(!reload);
    window.location.reload(false);
  };

  const fetchColumns = async () => {
    const reponse = await fetch(columnsurl);
    const newColumns = await reponse.json();
    setColumns(newColumns.columns);
    setLoading(false);
    // console.log(columns);
  };

  useEffect(() => {
    fetchColumns();
  }, [setReload1]);
  if (loading) {
    return (
      <section>
        <h1>Loading...</h1>
      </section>
    );
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <h1>{boardTitle.title}</h1>
      <section
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 0.3fr" }}
      >
        {columns.map((column, index) => {
          const columnx = columns[index];
          // console.log(index);
          return (
            <Column
              columnId={columnx.columnId}
              key={columnx.columnId}
              title={columnx.title}
              cardIds={columnx.cardIds}
              index={index}
              reload1={reload1}
            />
          );
        })}

        <div style={{ margin: "10px" }}>
          {" "}
          <button
            style={{ backgroundColor: "#283618", color: "#fefae0" }}
            onClick={toggleModal}
          >
            Add List
          </button>
        </div>

        {modal && (
          <div className="modal">
            <div onClick={toggleModal} className="overlay"></div>
            <div className="modal-content">
              <form onSubmit={handleSubmit}>
                <h2>Add List</h2>
                <div className="form-control">
                  <div>
                    <label>List Title</label>
                    <input
                      type="text"
                      placeholder="list title"
                      value={columnTitle}
                      onChange={(e) => setColumnTitle(e.target.value)}
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
    </DragDropContext>
  );
};

export default Board;
