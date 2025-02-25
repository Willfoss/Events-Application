import React, { useState } from "react";
import "./adminDashboard.css";
import UserHeader from "../UserHeader/UserHeader";
import CreateAdmin from "../CreateAdmin/CreateAdmin";
import Toast from "../Toast/Toast";
import EditUserProvider from "../EditUserProvider/EditUserProvider";

export default function AdminDashboard() {
  const [showCreateNewUser, setShowCreateNewUser] = useState(false);
  const [showUpdateUser, setShowUpdateUser] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [showErrorToast, setShowErrorToast] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  function handleUpdateUserClick() {
    setShowCreateNewUser(false);
    setShowUpdateUser(true);
  }

  function handleCreateUserClick() {
    setShowUpdateUser(false);
    setShowCreateNewUser(true);
  }

  return (
    <section id="admin-dashboard">
      <UserHeader />
      {showSuccessToast && <Toast success="yes" successMessage={successMessage} setShowToast={setShowSuccessToast} />}
      {showErrorToast && <Toast error="yes" errrorMessage={errorMessage} setShowToast={setShowErrorToast} />}
      <div className="admin-container">
        <div className="admin-button-container">
          <button className="admin-button" onClick={handleUpdateUserClick}>
            Update existing user Role
          </button>
          <button className="admin-button" onClick={handleCreateUserClick}>
            Create a new staff/admin account
          </button>
        </div>
        {showCreateNewUser && (
          <CreateAdmin
            setShowSuccessToast={setShowSuccessToast}
            setShowErrorToast={setShowErrorToast}
            setErrorMessage={setErrorMessage}
            setSuccessMessage={setSuccessMessage}
            setShowCreateNewUser={setShowCreateNewUser}
          />
        )}
        {showUpdateUser && (
          <EditUserProvider
            setShowSuccessToast={setShowSuccessToast}
            setShowErrorToast={setShowErrorToast}
            setErrorMessage={setErrorMessage}
            setSuccessMessage={setSuccessMessage}
            setShowCreateNewUser={setShowCreateNewUser}
          />
        )}
      </div>
    </section>
  );
}
