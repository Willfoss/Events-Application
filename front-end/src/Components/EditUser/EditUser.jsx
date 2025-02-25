import React, { useEffect, useState } from "react";
import("./editUser.css");
import { ArrowLeft } from "lucide-react";

export default function EditUser(props) {
  const { setShowSuccessToast, setShowErrorToast, setErrorMessage, setSuccessMessage, selectedUserToEdit, setSelectedUserToEdit } = props;
  const [users, setUsers] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [role, setRole] = useState(selectedUserToEdit ? selectedUserToEdit.role : "user");
  const [windowPixels, setWindowPixels] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  function handleRoleChange(event) {
    setRole(event.target.value);
  }

  function handleUpdateUser(event) {
    event.preventDefault();
  }

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

  function handleBackArrowClick() {
    setSelectedUserToEdit();
  }

  return (
    <section id="edit-user" className={!selectedUserToEdit && windowPixels.width <= 768 ? "hide-edit-user" : "show-edit-user"}>
      <div className={windowPixels.width > 768 ? "hide-icon" : "edit-user-header"} onClick={handleBackArrowClick}>
        <ArrowLeft className="back-to-chat-list-button" />
      </div>
      {selectedUserToEdit && (
        <section id="admin-register-section">
          <div className="admin-register-container">
            <div className="register-container">
              <form onSubmit={handleUpdateUser} className="update-user-role-form">
                <p className="profile-text">
                  <span className="bold">Name: </span>
                  {selectedUserToEdit.name}
                </p>
                <p className="profile-text">
                  <span className="bold">Email: </span>
                  {selectedUserToEdit.email}
                </p>
                <label className="register-text bold" htmlFor="role">
                  Update User Role
                  <select className="update-user-role-select" name="role" defaultValue="user" onChange={handleRoleChange}>
                    <option value={"user"}>User</option>
                    <option value={"staff"}>Staff</option>
                    <option value={"admin"}>Admin</option>
                  </select>
                </label>
                <label className="register-text" htmlFor="profile-picture"></label>
                {isLoading === true ? (
                  <div className="update-user-button-loading">
                    <Lottie className="button-loading-animation " animationData={buttonLoading} loop={true} />
                  </div>
                ) : (
                  <button className="update-user-button ">Update User Role</button>
                )}
              </form>
            </div>
          </div>
        </section>
      )}
    </section>
  );
}
