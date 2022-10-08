import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import Cards from "./Cards";

const Board = () => {
  const boardId = useParams();
  const columnsurl = "http://localhost:3002/api/columns/all/" + boardId.id;

  const [loading, setLoading] = useState(true);
  const [columns, setColumns] = useState([]);
  const [cards, setCards] = useState([]);

  const fetchColumns = async () => {
    const reponse = await fetch(columnsurl);
    const newColumns = await reponse.json();
    setColumns(newColumns.columns);
    // setLoading(false);
  };

  const columnIds = columns.map((column) => {
    return column.columnId;
  });

  const fetchCards = () => {
    // Simple POST request with a JSON body using fetch
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ columnIds: columnIds }),
    };
    fetch("http://localhost:3002/api/cards/getallcards", requestOptions)
      .then((response) => response.json())
      .then((data) => setCards(data.cards[0]))
      .then(setLoading(false));
  };

  useEffect(() => {
    fetchColumns();
    fetchCards();
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
      <h1>{boardId.id}</h1>
      <section style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr" }}>
        {columns.map((column) => {
          const { columnId, title, cardIds } = column;
          return (
            <article key={columnId} style={{ border: "1px solid black" }}>
              <div>
                <h4>{title}</h4>
                <Cards data={"col1"} />
                {/* {console.log(columnId)} */}
                {/* {cards.map((card) => {
                  //   const { title, cardId } = card;
                  if (column.cardIds.includes(card.cardId)) {
                    return (
                      // <p>Card here</p>
                      <div
                        key={card.cardId}
                        style={{ border: "1px solid black", margin: "10px" }}
                      >
                        <h4>{card.title}</h4>
                      </div>
                    );
                  }
                })} */}
              </div>
            </article>
          );
        })}
      </section>
    </>
  );
};

export default Board;
