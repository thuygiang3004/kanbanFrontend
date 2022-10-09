import React, { useState } from "react";
import Cards from "./Cards";
import "./Modal.css";

const Columns = ({ data }) => {
  //   console.log(cardsData);
  const [modal, setModal] = useState(false);
  const toggleModal = () => {
    setModal(!modal);
  };

  if (modal) {
    document.body.classList.add("active-modal");
  } else {
    document.body.classList.remove("active-modal");
  }

  const columnIds = data.map((column) => {
    return column.columnId;
  });
  //   console.log(columnIds);
  return (
    <>
      {data.map((column) => {
        const { cardIds, columnId, title, _id } = column;
        return (
          <section
            key={_id}
            style={{ border: "1px solid black", margin: "10px" }}
          >
            <h3>{title}</h3>
            <div>
              <Cards data={columnId} />
              <button style={{ backgroundColor: "cyan" }} onClick={toggleModal}>
                Add task
              </button>
            </div>
            {modal && (
              <div className="modal">
                <div onClick={toggleModal} className="overlay"></div>
                <div className="modal-content">
                  <form>
                    <h2>Add task</h2>
                    <div className="form-control">
                      <input
                        type="text"
                        className="grocery"
                        placeholder="task title"
                      />
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
        );
      })}
    </>
  );
};

export default Columns;
