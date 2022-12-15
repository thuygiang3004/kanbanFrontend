import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useState, useContext, useEffect } from "react";
import axios from "../api/axios";
import AuthContext from "../context/AuthProvider";

const urlSearchMember = "/users/exist";
const urlAddMember = "boards/members/add";
const urlGetMembers = "boards/members/all";
const urlRemoveMember = "boards/members/remove";

export default function Members() {
  const boardId = useParams();

  const [searchEmail, setSearchEmail] = useState("");
  const { auth } = useContext(AuthContext);
  const [message, setMessage] = useState("");
  const [members, setMembers] = useState([]);

  const [owner, setOwner] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      setMessage("");
    }, 3000);
    return () => clearTimeout(timer);
  }, [message]);

  const fetchMembers = async () => {
    const response = await axios.post(
      urlGetMembers,
      JSON.stringify({
        boardId: boardId.id,
      }),
      {
        headers: {
          "Content-Type": "application/json",
          authorization: "Bearer " + auth.accessToken,
        },
      }
    );
    const newMembers = await response.data.members;
    const projectOwner = newMembers.find((member) => member.isOwner == true);
    if (projectOwner.email == auth.email) setOwner(true);
    console.log(newMembers);
    console.log(owner);
    setMembers(newMembers);
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const handleSearch = async () => {
    //Search for that user email
    const searchResult = await axios.post(
      urlSearchMember,
      JSON.stringify({
        memberEmail: searchEmail.toLowerCase(),
        boardId: boardId.id,
      }),
      {
        headers: {
          "Content-Type": "application/json",
          authorization: "Bearer " + auth.accessToken,
        },
      }
    );
    console.log(searchResult);
    if (searchResult.status == 204) {
      setMessage("This email is not a member of Kanban yet.");
    }
    if (searchResult.status == 201) {
      setMessage("This person is already a member of this project.");
    } else {
      //If that user hasn't been added to members yet, add it
      const addedUserId = await searchResult.data.userData._id;
      console.log(addedUserId);

      const addMemberResult = await axios.post(
        urlAddMember,
        JSON.stringify({
          userId: addedUserId,
          boardId: boardId.id,
        }),
        {
          headers: {
            "Content-Type": "application/json",
            authorization: "Bearer " + auth.accessToken,
          },
        }
      );

      console.log(addMemberResult);
      setSearchEmail("");
      setMessage(`Added ${searchEmail.toLowerCase()} to members list`);
      fetchMembers();
    }
  };

  const handleRemove = async (removedMemberId) => {
    console.log(removedMemberId);
    console.log(boardId.id);

    const removeMemberResult = await axios.post(
      urlRemoveMember,
      JSON.stringify({
        memberId: removedMemberId,
        boardId: boardId.id,
      }),
      {
        headers: {
          "Content-Type": "application/json",
          authorization: "Bearer " + auth.accessToken,
        },
      }
    );
    console.log(removeMemberResult);
    setMessage(`Removed from members list`);
    fetchMembers();
  };

  return (
    <main className="container">
      <h2>{} Members List</h2>
      {owner && (
        <div className="searchMember">
          <p>To add new members, please add their email</p>
          <p className={message ? "errmsg" : "offscreen"} aria-live="assertive">
            {message}
          </p>
          <input
            type="text"
            placeholder="Email"
            onChange={(e) => setSearchEmail(e.target.value)}
            value={searchEmail}
            required
          />
          <button className="btn" onClick={handleSearch}>
            Add Member
          </button>
          <h3>Members List</h3>
        </div>
      )}
      <div>
        {members.map((member, index) => {
          const memberx = members[index];
          return (
            <div className="members" key={memberx._id}>
              <p className="member">{memberx.email}</p>
              <p className="member">{memberx.name}</p>
              {((owner && !memberx.isOwner) ||
                (!owner && auth.email == memberx.email)) && (
                <button onClick={() => handleRemove(memberx._id)}>
                  Remove
                </button>
              )}
            </div>
          );
        })}
      </div>
      <button className="backLink" onClick={() => navigate(-1)}>
        Go back to Board
      </button>
    </main>
  );
}
