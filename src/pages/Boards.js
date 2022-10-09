import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const url = "http://localhost:3002/api/boards/all";

const Boards = () => {
  const [loading, setLoading] = useState(true);
  const [boards, setBoards] = useState([]);
  // const [value, setValue] = useState(0);

  const fetchBoards = async () => {
    const reponse = await fetch(url);
    const newBoards = await reponse.json();
    setBoards(newBoards.boards);
    setLoading(false);
  };
  useEffect(() => {
    fetchBoards();
  }, []);
  if (loading) {
    return (
      <section>
        <h1>Loading...</h1>
      </section>
    );
  }

  // console.log(boards);
  return (
    <section>
      <h2>Boards List</h2>
      {boards.map((board) => {
        const { _id, title } = board;
        return (
          <article key={_id} style={{ border: "1px solid black" }}>
            <div>
              <h4>ID: {_id}</h4>
              <Link
                key={_id}
                to={`/board/${_id}`}
                // state={{ boardTitle: "giang" }}
              >
                {board.title}
              </Link>
            </div>
          </article>
        );
      })}
      <button style={{ backgroundColor: "cyan" }}>Create new project</button>
    </section>
  );
};

export default Boards;
