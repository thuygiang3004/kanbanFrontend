import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";

const Cards = (columnId) => {
  const [loading, setLoading] = useState(true);
  const [cards, setCards] = useState([]);

  const fetchCards = () => {
    // Simple POST request with a JSON body using fetch
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ columnIds: columnId }),
    };
    fetch("http://localhost:3002/api/cards/getallcards", requestOptions)
      .then((response) => response.json())
      .then((data) => setCards(data.cards[0]))
      .then(setLoading(false));
  };

  useEffect(() => {
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
      {cards.map((card) => {
        const { title, cardId } = card;
        return (
          // <p>Card here</p>
          <div
            key={cardId}
            style={{ border: "1px solid black", margin: "10px" }}
          >
            <h4>{title}</h4>
          </div>
        );
      })}
    </>
  );
};

export default Cards;
