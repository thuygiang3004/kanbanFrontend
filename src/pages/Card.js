import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { Draggable } from "react-beautiful-dnd";

const Card = ({ data, index, id }) => {
  const { title, cardId } = data;

  return (
    <Draggable draggableId={String(id)} index={index} key={cardId}>
      {(provided, snapshot) => {
        const style = {
          border: "1px solid black",
          margin: "10px",
          background: "#454B1B",
          color: "#FFFFFF",
          ...provided.draggableProps.style,
        };

        return (
          <div
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
            style={style}
          >
            <div className="Card">
              <h4>{title}</h4>
            </div>
          </div>
        );
      }}
    </Draggable>
  );
};

export default Card;
