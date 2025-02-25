import React, { useContext } from "react";
import UserHeader from "../UserHeader/UserHeader";
import { UserContext } from "../../Context/UserContext";
import "./profile.css";

export default function Profile() {
  const { loggedInUser, setLoggedInUser } = useContext(UserContext);

  function handleSignOutClick() {
    setLoggedInUser(null);
  }

  return (
    <section id="profile">
      <UserHeader />
      <div className="profile-container">
        <h2 className="profile-heading">User Profile</h2>
        <p className="profile-text">
          <span className="bold">Name: </span>
          {loggedInUser.name}
        </p>
        <p className="profile-text">
          <span className="bold">Email: </span>
          {loggedInUser.email}
        </p>
        <button className="log-out-button" onClick={handleSignOutClick}>
          Sign Out
        </button>
      </div>
    </section>
  );
}
