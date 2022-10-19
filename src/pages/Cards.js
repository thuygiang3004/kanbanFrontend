import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { Draggable } from "react-beautiful-dnd";

const Cards = ({ data, reloadCard }) => {
  const [loading, setLoading] = useState(true);
  const [cards, setCards] = useState([]);
  const reload = reloadCard;

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

  useEffect(() => {
    fetchCards();
  }, [reload]);

  if (cards != null) {
    return (
      <>
        {cards.map((card, index) => {
          const { title, cardId } = card;
          return (
            <Draggable draggableId={cardId} index={index}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                  key={cardId}
                  style={{ border: "1px solid black", margin: "10px" }}
                >
                  <div className="Card">
                    <h4>{title}</h4>
                  </div>
                </div>
              )}
            </Draggable>
          );
        })}
      </>
    );
  }
};

export default Cards;
