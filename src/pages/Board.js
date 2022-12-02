import React, { useState, useEffect, useReducer } from 'react';
import { Link, useParams, useLocation } from 'react-router-dom';
import axios from 'axios';
import uuid from 'react-uuid';
import Column from './Column';
import { DragDropContext } from 'react-beautiful-dnd';
import './Modal.css';

const urlReorderCardSameColumn =
  'http://localhost:3002/api/cards/reorder/samecolumn';
const reorderCardSameColumn = (columnId, cardIds) => {
  console.log(columnId);
  console.log(cardIds);
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
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
  'http://localhost:3002/api/cards/reorder/differentcolumn';

const urlPostNewColumn = 'http://localhost:3002/api/columns/';
const addColumnToDB = (title, boardId, columnId) => {
  console.log(title);
  console.log(boardId);
  console.log(columnId);
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      title: title,
      columnId: columnId,
      boardId: boardId,
    }),
  };
  fetch(urlPostNewColumn, requestOptions).then((response) => response.json());
};

const urlEditColumn = "http://localhost:3002/api/columns/edit";
const editColumnToDB = (title, columnId) => {
  console.log(title);
  console.log(columnId);
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      title: title,
      columnId: columnId,
    }),
  };
  const result = fetch(urlEditColumn, requestOptions).then((response) =>
    response.json()
  );
  console.log(result);
};

const Board = () => {
  const boardId = useParams();
  const columnsurl = 'http://localhost:3002/api/columns/all/' + boardId.id;

  const [loading, setLoading] = useState(true);
  const [columns, setColumns] = useState([]);

  const location = useLocation();
  const { boardTitle } = location.state;

  const [modal, setModal] = useState(false);
  const [columnTitle, setColumnTitle] = useState('');

  const [reducerValue, forceUpdate] = useReducer((x) => x + 1, 0);

  const [isNew, setIsNew] = useState(true);

  const [editingColId, setEditingColId] = useState("");

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
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
      // NOTE: Possible Bug??
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
      fetchColumns();
      // window.location.reload(false);
    }
  };

  const toggleColModal = () => {
    setModal(!modal);
  };
  if (modal) {
    document.body.classList.add('active-modal');
  } else {
    document.body.classList.remove('active-modal');
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isNew) {
      const columnId = uuid();
      addColumnToDB(columnTitle, boardId.id, columnId);
    } else {
      editColumnToDB(columnTitle, editingColId);
    }
    toggleColModal();
    fetchColumns();
    // window.location.reload(false);
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
      <section className="board-title">
        <h1>{boardTitle.title}</h1>
        <Link
          className="membersLink"
          key={boardId.id}
          to={`/board/members/${boardId.id}`}
          // state={{ boardTitle: { boardTitle.title } }}
        >
          Members
        </Link>
      </section>
      <section
        // style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 0.3fr" }}
        className="board"
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
              boardId={boardId}
              toggleColModal={toggleColModal}
              isNew={isNew}
              setIsNew={setIsNew}
              editingColId={editingColId}
              setEditingColId={setEditingColId}
              columnTitle={columnTitle}
              setColumnTitle={setColumnTitle}
            />
          );
        })}

        <div className="newcol-div">
          {" "}
          <button
            className="newcol-btn btn"
            onClick={() => {
              setIsNew(true);
              toggleColModal();
            }}
          >
            Add Swimlane
          </button>
        </div>

        {modal && (
          <div className="modal">
            <div onClick={toggleColModal} className="overlay"></div>
            <div className="modal-content">
              <form onSubmit={handleSubmit}>
                <h2>{isNew ? "Add List" : "Edit List"}</h2>
                <div className="form-control">
                  <div className="form-group">
                    <label>List Title</label>
                    <input
                      type="text"
                      placeholder="list title"
                      value={columnTitle}
                      onChange={(e) => setColumnTitle(e.target.value)}
                    />
                  </div>
                  <button type="submit" className="submit-btn btn">
                    Submit
                  </button>
                </div>
                <button className="close-modal" onClick={toggleColModal}>
                  &times;
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
