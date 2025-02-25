import React, { useContext, useEffect, useState } from "react";
import "./searchUser.css";
import { Search } from "lucide-react";
import { getUsers } from "../../api";
import setAuthorisationHeader from "../../Auth/auth-config";
import { UserContext } from "../../Context/UserContext";
import SearchUserCard from "../SearchUserCard/SearchUserCard";

export default function SearchUser(props) {
  const { setShowSuccessToast, setShowErrorToast, setErrorMessage, setSuccessMessage, selectedUserToEdit, setSelectedUserToEdit } = props;
  const [users, setUsers] = useState();
  const [loading, setIsLoading] = useState(false);
  const { loggedInUser } = useContext(UserContext);

  const [windowPixels, setWindowPixels] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    function handleResize() {
      setWindowPixels({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    setIsLoading(true);
    setShowErrorToast(false);
    const authorisation = setAuthorisationHeader(loggedInUser);
    getUsers(authorisation)
      .then((users) => {
        setUsers(users);
        setIsLoading(false);
      })
      .catch((error) => {
        setIsLoading(false);
        setShowErrorToast(true);
        setErrorMessage(error.response.data.message);
      });
  }, []);

  return (
    <section id="search-for-user" className={selectedUserToEdit && windowPixels.width <= 768 ? "hide-user-search" : "show-user-search"}>
      <div className="search-user-header">
        <label className="search-label" htmlFor="user-search">
          <input className="user-search-input" name="user-search" placeholder="search for a user"></input>
          <Search className="search-icon" />
        </label>
      </div>
      <div className="user-list-container">
        {users &&
          users.map((user) => {
            return <SearchUserCard key={user.user_id} user={user} setSelectedUserToEdit={setSelectedUserToEdit} />;
          })}
      </div>
    </section>
  );
}
