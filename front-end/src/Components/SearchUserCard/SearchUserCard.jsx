import React from "react";
import "./searchUserCard.css";

export default function SearchUserCard(props) {
  const { user, setSelectedUserToEdit } = props;
  function handleUserCardClick() {
    setSelectedUserToEdit(user);
  }
  return (
    <div className="user-card-container" key={user.user_id} onClick={handleUserCardClick}>
      <p className="user-card-text bold">{user.email}</p>
      <p className="user-card-text">{user.name}</p>
    </div>
  );
}
