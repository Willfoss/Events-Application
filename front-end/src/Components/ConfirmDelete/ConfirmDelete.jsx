import React, { useContext } from "react";
import "./confirmDelete.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import setAuthorisationHeader from "../../Auth/auth-config";
import { UserContext } from "../../Context/UserContext";
import { deleteEvent } from "../../api";
import Toast from "../Toast/Toast";
import Lottie from "lottie-react";
import buttonLoading from "../../assets/loading-button.json";

export default function ConfirmDelete(props) {
  const { setShowDeleteEventModal, event_id, event_title } = props;
  const [showSucessToast, setShowSuccessToast] = useState(false);
  const [showErrorToast, setShowErrorToast] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { loggedInUser } = useContext(UserContext);

  const navigate = useNavigate();

  function handleDoNotDeleteClick() {
    setShowDeleteEventModal(false);
  }

  function handleDeleteEventClick() {
    setIsLoading(true);
    setShowErrorToast(false);
    const auth = setAuthorisationHeader(loggedInUser);
    deleteEvent(event_id, auth)
      .then(() => {
        navigate("/events", {
          replace: true,
          state: { showSuccessToast: true, successToastText: `you have successfully deleted ${event_title}` },
        });
      })
      .catch((error) => {
        setIsLoading(false);
        setShowErrorToast(true);
        setErrorMessage(error.response.data.message);
      });
  }

  return (
    <section id="confirm-action">
      {showErrorToast && <Toast error="yes" errorMessage={errorMessage} setShowToast={setShowErrorToast} />}
      <div className="confirm-action-container">
        <p className="confirm-action-text">{`Are you sure you want to delete ${event_title}?`}</p>
        <div className="confirm-action-buttons-container">
          {isLoading ? (
            <div className="delete-button-loading">
              <Lottie className="button-loading-animation " animationData={buttonLoading} loop={true} />
            </div>
          ) : (
            <button className="delete-button" onClick={handleDeleteEventClick}>
              Yes
            </button>
          )}

          <button className="do-not-delete-button" onClick={handleDoNotDeleteClick}>
            No
          </button>
        </div>
      </div>
    </section>
  );
}
