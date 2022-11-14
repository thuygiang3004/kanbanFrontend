import React, { useState, useEffect, useReducer } from "react";
import { Link, useParams, useLocation } from "react-router-dom";
import axios from "axios";
import uuid from "react-uuid";
import Column from "./Column";
import { DragDropContext } from "react-beautiful-dnd";
import "./Modal.css";

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
  fetch(urlReorderCardSameColumn, requestOptions).then((response) =>
    response.json()
  );
};

const urlReorderCardDifferentColumn =
  "http://localhost:3002/api/cards/reorder/differentcolumn";

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
};

const Board = () => {
  const boardId = useParams();
  const columnsurl = "http://localhost:3002/api/columns/all/" + boardId.id;

  const [loading, setLoading] = useState(true);
  const [columns, setColumns] = useState([]);

  const location = useLocation();
  const { boardTitle } = location.state;

  const [modal, setModal] = useState(false);
  const [columnTitle, setColumnTitle] = useState("");

  const [reducerValue, forceUpdate] = useReducer((x) => x + 1, 0);

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
    const reorderCardDifferentColumn = async (
      pulledOutCardId,
      removedColumnId,
      addedColumnId,
      removedColumnCardIds,
      addedColumnCardIds
    ) => {
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
      const result = await fetch(urlReorderCardDifferentColumn, requestOptions)
        .then((response) => response.json())
        .then(forceUpdate());
    };

    if (destination.droppableId != source.droppableId) {
      const sourceColumnId = source.droppableId;

      const sourceColumn = columns.find(
        (column) => column.columnId == sourceColumnId
      );

      const pulledOutCardId = sourceColumn.cardIds.splice(source.index, 1);
      const removedColumnCardIds = sourceColumn.cardIds;
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
    window.location.reload(false);
  };

  const fetchColumns = async () => {
    const reponse = await fetch(columnsurl);
    const newColumns = await reponse.json();
    setColumns(newColumns.columns);
    setLoading(false);
  };

  useEffect(() => {
    fetchColumns();
  }, [reducerValue]);
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
              fetchColumns={fetchColumns}
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
