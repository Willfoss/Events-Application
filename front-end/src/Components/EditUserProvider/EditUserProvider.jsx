import React, { useState } from "react";
import "./editUserProvider.css";
import SearchUser from "../SearchUser/SearchUser";
import EditUser from "../EditUser/EditUser";

export default function EditUserProvider(props) {
  const { setShowSuccessToast, setShowErrorToast, setErrorMessage, setSuccessMessage } = props;
  const [selectedUserToEdit, setSelectedUserToEdit] = useState();

  return (
    <section id="update-user-provider">
      <SearchUser
        setShowSuccessToast={setShowSuccessToast}
        setShowErrorToast={setShowErrorToast}
        setErrorMessage={setErrorMessage}
        setSuccessMessage={setSuccessMessage}
        selectedUserToEdit={selectedUserToEdit}
        setSelectedUserToEdit={setSelectedUserToEdit}
      />
      <EditUser
        setShowSuccessToast={setShowSuccessToast}
        setShowErrorToast={setShowErrorToast}
        setErrorMessage={setErrorMessage}
        setSuccessMessage={setSuccessMessage}
        selectedUserToEdit={selectedUserToEdit}
        setSelectedUserToEdit={setSelectedUserToEdit}
      />
    </section>
  );
}
