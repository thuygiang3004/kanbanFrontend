import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";

const Board = () => {
  const boardId = useParams();
  const columnsurl = "http://localhost:3002/api/columns/all/" + boardId.id;

  const [loading, setLoading] = useState(true);
  const [columns, setColumns] = useState([]);
  const [cards, setCards] = useState([]);

  //   const fetchColumns = async () => {
  //     const reponse = await fetch(columnsurl);
  //     const newColumns = await reponse.json();
  //     setColumns(newColumns.columns);
  //     setLoading(false);
  //   };

  const getCards = () => {
    // Simple POST request with a JSON body using fetch
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ columnIds: ["col1"] }),
    };
    fetch("http://localhost:3002/api/cards/getallcards", requestOptions)
      .then((response) => response.json())
      .then((data) => setCards(data.cards));
  };

  useEffect(() => {
    // fetchColumns();
    getCards();
  }, []);
  if (loading) {
    return (
      <section>
        <h1>Loading...</h1>
      </section>
    );
  }
  console.log(columns);

  //   const cardsUrl = "http://localhost:3002/api/cards/getallcards";
  //   const fetchCards = async () => {
  //     const reponse = await fetch(cardsUrl);
  //     const newCards = await reponse.json();
  //     setCards(newCards.cards);
  //     setLoading(false);
  //   };

  console.log(cards);

  return (
    <>
      <h1>{boardId.id}</h1>
      {/* <section style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr" }}>
        {columns.map((column) => {
          const { columnId, title, cardIds } = column;
          return (
            <article key={columnId} style={{ border: "1px solid black" }}>
              <div>
                <h4>{title}</h4>
              </div>
            </article>
          );
        })}
      </section> */}
    </>
  );
};

export default Board;
