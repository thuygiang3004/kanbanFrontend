import React, { useState, useEffect } from "react";
import { Link, useParams, useLocation } from "react-router-dom";
import axios from "axios";
import Columns from "./Columns";
import Column from "./Column";
import Cards from "./Cards";
import { DragDropContext } from "react-beautiful-dnd";

const Board = () => {
  const location = useLocation();
  const { boardTitle } = location.state;

  const onDragEnd = () => {};

  const boardId = useParams();
  const columnsurl = "http://localhost:3002/api/columns/all/" + boardId.id;

  const [loading, setLoading] = useState(true);
  const [columns, setColumns] = useState([]);

  const fetchColumns = async () => {
    const reponse = await fetch(columnsurl);
    const newColumns = await reponse.json();
    setColumns(newColumns.columns);
    setLoading(false);
  };

  useEffect(() => {
    fetchColumns();
  }, []);
  if (loading) {
    return (
      <section>
        <h1>Loading...</h1>
      </section>
    );
  }

  return (
    <>
      <DragDropContext onDragEnd={onDragEnd}>
        <h1>{boardTitle}</h1>
        <section
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr" }}
        >
          {columns.map((columnId, index) => {
            const column = columns[index];
            return (
              <Column
                columnId={column.columnId}
                key={column.columnId}
                title={column.title}
                cards={column.cardIds}
                index={index}
              />
            );
          })}
        </section>
      </DragDropContext>
    </>
  );
};

export default Board;
