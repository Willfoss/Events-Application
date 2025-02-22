import React, { useContext, useState } from "react";
import "./editEvent.css";
import TextareaAutosize from "react-textarea-autosize";
import buttonLoading from "../../assets/loading-button.json";
import Lottie from "lottie-react";
import setAuthorisationHeader from "../../Auth/auth-config";
import { UserContext } from "../../Context/UserContext";
import { patchEventDetails } from "../../api";
import { useNavigate } from "react-router-dom";
import ConfirmDelete from "../ConfirmDelete/ConfirmDelete";

export default function EditEvent(props) {
  const { event, setShowSuccessToast, setShowErrorToast, setToastSuccessMessage, setErrorMessage, setIsStaffEditing } = props;
  const [eventTitle, setEventTitle] = useState(event.event_title);
  const [eventDescription, setEventDescription] = useState(event.event_description);
  const [host, setHost] = useState(event.host);
  const [image, setImage] = useState(event.image);
  const [location, setLocation] = useState(event.location);
  const [startDate, setStartDate] = useState(event.start_date.split("/").reverse().join("-"));
  const [endDate, setEndDate] = useState(event.end_date.split("/").reverse().join("-"));
  const [startTime, setStartTime] = useState(event.start_time);
  const [endTime, setEndTime] = useState(event.end_time);
  const [link, setLink] = useState(event.link);
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteModal, setShowDeleteEventModal] = useState(false);
  const { loggedInUser } = useContext(UserContext);
  const navigate = useNavigate();

  function handleUpdateEvent(e) {
    e.preventDefault();
    setShowSuccessToast(true);
    setIsLoading(true);
    setShowErrorToast(false);
    const authorisation = setAuthorisationHeader(loggedInUser);
    patchEventDetails(
      event.event_id,
      eventTitle,
      eventDescription,
      host,
      image,
      location,
      startDate,
      endDate,
      startTime,
      endTime,
      link,
      authorisation
    )
      .then((editedEvent) => {
        setIsLoading(false);
        setShowSuccessToast(true);
        setToastSuccessMessage(`${eventTitle} has been successfully updated`);
        setIsStaffEditing(false);
      })
      .catch((error) => {
        setIsLoading(false);
        setShowErrorToast(true);
        setErrorMessage(error.response.data.message);
      });
  }

  function handleCancelEditingClick() {
    window.location.reload();
  }

  function handleDeleteEventConfirmation() {
    setShowDeleteEventModal(true);
  }

  return (
    <div className="edit-event">
      {showDeleteModal && (
        <ConfirmDelete event_id={event.event_id} event_title={event.event_title} setShowDeleteEventModal={setShowDeleteEventModal} />
      )}
      <section id="edit-event-container">
        <div className="edit-event-button-container">
          <button className="delete-event-button" onClick={handleDeleteEventConfirmation}>
            Delete Event
          </button>
          <button className="cancel-editing-button" onClick={handleCancelEditingClick}>
            Cancel Editing
          </button>
        </div>
        <img className="single-event-image" src={image}></img>
        <form className="edit-event-form" onSubmit={handleUpdateEvent}>
          <div className="edit-event-input-container">
            <label className="edit-event-label" htmlFor="event-title">
              <p className="edit-event-text bold">Image URL: </p>
            </label>
            <input
              className="edit-event-input input-width"
              name="event-title"
              type="url"
              value={image}
              onChange={(e) => setImage(e.target.value)}
            ></input>
          </div>
          <div className="edit-event-input-container">
            <label className="edit-event-label" htmlFor="event-title">
              <p className="edit-event-text bold">Event Title: </p>
            </label>
            <input
              className="edit-event-input input-width"
              name="event-title"
              type="text"
              value={eventTitle}
              onChange={(e) => setEventTitle(e.target.value)}
            ></input>
          </div>
          <div className="edit-event-input-container">
            <label className="edit-event-label" htmlFor="event-description">
              <p className="edit-event-text bold">Event Description: </p>
            </label>
            <TextareaAutosize
              className="edit-event-textarea input-width"
              name="event-description"
              type="text"
              value={eventDescription}
              onChange={(e) => setEventDescription(e.target.value)}
            ></TextareaAutosize>
          </div>
          <div className="edit-event-input-container">
            <label className="edit-event-label" htmlFor="event-title">
              <p className="edit-event-text bold">Organiser: </p>
            </label>
            <input
              className="edit-event-input input-width"
              name="event-title"
              type="text"
              value={host}
              onChange={(e) => setHost(e.target.value)}
            ></input>
          </div>
          <div className="edit-event-input-container">
            <label className="edit-event-label" htmlFor="event-title">
              <p className="edit-event-text bold">Start Date: </p>
            </label>
            <input
              className="edit-event-input input-width"
              name="event-title"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            ></input>
          </div>
          <div className="edit-event-input-container">
            <label className="edit-event-label" htmlFor="event-title">
              <p className="edit-event-text bold">End Date: </p>
            </label>
            <input
              className="edit-event-input input-width"
              name="event-title"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            ></input>
          </div>
          <div className="edit-event-input-container">
            <label className="edit-event-label" htmlFor="event-title">
              <p className="edit-event-text bold">Start Time: </p>
            </label>
            <input
              className="edit-event-input input-width"
              name="event-title"
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
            ></input>
          </div>
          <div className="edit-event-input-container">
            <label className="edit-event-label" htmlFor="event-title">
              <p className="edit-event-text bold">End Time: </p>
            </label>
            <input
              className="edit-event-input input-width"
              name="event-title"
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
            ></input>
          </div>
          <div className="edit-event-input-container">
            <label className="edit-event-label" htmlFor="event-title">
              <p className="edit-event-text bold">Location: </p>
            </label>
            <input
              className="edit-event-input input-width"
              name="event-title"
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            ></input>
          </div>
          <div className="edit-event-input-container">
            <label className="edit-event-label" htmlFor="event-title">
              <p className="edit-event-text bold">Organiser Link: </p>
            </label>
            <input
              className="edit-event-input input-width"
              name="event-title"
              type="url"
              value={link}
              onChange={(e) => setLink(e.target.value)}
            ></input>
          </div>
          {isLoading ? (
            <div className="registration-button-loading">
              <Lottie className="button-loading-animation " animationData={buttonLoading} loop={true} />
            </div>
          ) : (
            <button className="update-event-button">Update Event</button>
          )}
        </form>
      </section>
    </div>
  );
}
