import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";

const Cards = ({ data }) => {
  const [loading, setLoading] = useState(true);
  const [cards, setCards] = useState([]);
  //   console.log(data);

  const fetchCards = () => {
    // Simple POST request with a JSON body using fetch
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ columnIds: [data] }),
    };
    fetch("http://localhost:3002/api/cards/getallcards", requestOptions)
      .then((response) => response.json())
      .then((data) => setCards(data.cards[0]))
      .then(setLoading(false));
  };
  //   console.log(cards);

  useEffect(() => {
    fetchCards();
  }, []);
  //   if (loading) {
  //     return (
  //       <section>
  //         <h1>Loading...</h1>
  //       </section>
  //     );
  //   }

  if (cards != null) {
    return (
      <>
        {cards.map((card) => {
          const { title, cardId } = card;
          return (
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
  }
};

export default Cards;
