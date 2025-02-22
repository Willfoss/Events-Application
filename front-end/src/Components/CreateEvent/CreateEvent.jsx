import React, { useContext, useState } from "react";
import "./createEvent.css";
import { UserContext } from "../../Context/UserContext";
import { useNavigate } from "react-router-dom";
import setAuthorisationHeader from "../../Auth/auth-config";
import buttonLoading from "../../assets/loading-button.json";
import Lottie from "lottie-react";
import TextareaAutosize from "react-textarea-autosize";
import UserHeader from "../UserHeader/UserHeader";

export default function CreateEvent() {
  const [eventTitle, setEventTitle] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [host, setHost] = useState("");
  const [image, setImage] = useState("");
  const [location, setLocation] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [link, setLink] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteModal, setShowDeleteEventModal] = useState(false);
  const { loggedInUser } = useContext(UserContext);
  const navigate = useNavigate();

  function handleCreateNewEvent(e) {
    e.preventDefault();
    setShowSuccessToast(true);
    setIsLoading(true);
    setShowErrorToast(false);
    const authorisation = setAuthorisationHeader(loggedInUser);
    //   .then((createdEvent) => {
    //     setIsLoading(false);
    //     setShowSuccessToast(true);
    //     setToastSuccessMessage(`${eventTitle} has been successfully created`);
    //     setIsStaffcreateing(false);
    //   })
    //   .catch((error) => {
    //     setIsLoading(false);
    //     setShowErrorToast(true);
    //     setErrorMessage(error.response.data.message);
    //   });
  }

  return (
    <section id="create-event">
      <UserHeader />
      <div className="create-event">
        <section id="create-event-container">
          <h2 className="create-new-event-title">Create a new Event</h2>
          <form className="create-event-form" onSubmit={handleCreateNewEvent}>
            <div className="create-event-input-container">
              <label className="create-event-label" htmlFor="event-title">
                <p className="create-event-text bold">Image URL: </p>
              </label>
              <input
                className="create-event-input input-width"
                name="event-title"
                type="url"
                value={image}
                onChange={(e) => setImage(e.target.value)}
              ></input>
            </div>
            <div className="create-event-input-container">
              <label className="create-event-label" htmlFor="event-title">
                <p className="create-event-text bold">Event Title: </p>
              </label>
              <input
                className="create-event-input input-width"
                name="event-title"
                type="text"
                value={eventTitle}
                onChange={(e) => setEventTitle(e.target.value)}
              ></input>
            </div>
            <div className="create-event-input-container">
              <label className="create-event-label" htmlFor="event-description">
                <p className="create-event-text bold">Event Description: </p>
              </label>
              <TextareaAutosize
                className="create-event-textarea input-width"
                name="event-description"
                type="text"
                value={eventDescription}
                onChange={(e) => setEventDescription(e.target.value)}
              ></TextareaAutosize>
            </div>
            <div className="create-event-input-container">
              <label className="create-event-label" htmlFor="event-title">
                <p className="create-event-text bold">Organiser: </p>
              </label>
              <input
                className="create-event-input input-width"
                name="event-title"
                type="text"
                value={host}
                onChange={(e) => setHost(e.target.value)}
              ></input>
            </div>
            <div className="create-event-input-container">
              <label className="create-event-label" htmlFor="event-title">
                <p className="create-event-text bold">Start Date: </p>
              </label>
              <input
                className="create-event-input input-width"
                name="event-title"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              ></input>
            </div>
            <div className="create-event-input-container">
              <label className="create-event-label" htmlFor="event-title">
                <p className="create-event-text bold">End Date: </p>
              </label>
              <input
                className="create-event-input input-width"
                name="event-title"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              ></input>
            </div>
            <div className="create-event-input-container">
              <label className="create-event-label" htmlFor="event-title">
                <p className="create-event-text bold">Start Time: </p>
              </label>
              <input
                className="create-event-input input-width"
                name="event-title"
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              ></input>
            </div>
            <div className="create-event-input-container">
              <label className="create-event-label" htmlFor="event-title">
                <p className="create-event-text bold">End Time: </p>
              </label>
              <input
                className="create-event-input input-width"
                name="event-title"
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
              ></input>
            </div>
            <div className="create-event-input-container">
              <label className="create-event-label" htmlFor="event-title">
                <p className="create-event-text bold">Location: </p>
              </label>
              <input
                className="create-event-input input-width"
                name="event-title"
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              ></input>
            </div>
            <div className="create-event-input-container">
              <label className="create-event-label" htmlFor="event-title">
                <p className="create-event-text bold">Organiser Link: </p>
              </label>
              <input
                className="create-event-input input-width"
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
              <button className="update-event-button">Create Event</button>
            )}
          </form>
        </section>
      </div>
    </section>
  );
}
