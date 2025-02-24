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
  const [isTitleError, setIsTitleError] = useState(false);
  const [eventDescription, setEventDescription] = useState("");
  const [isDescriptionError, setIsDescriptionError] = useState(false);
  const [host, setHost] = useState("");
  const [isHostError, setIsHostError] = useState("");
  const [image, setImage] = useState("");
  const [isImageError, setIsImageError] = useState(false);
  const [location, setLocation] = useState("");
  const [isLocationError, setIsLocationError] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [isStartDateError, setIsStartDataError] = useState(false);
  const [endDate, setEndDate] = useState("");
  const [isEndDateError, setIsEndDateError] = useState(false);
  const [startTime, setStartTime] = useState("");
  const [isStartTimeError, setIsStartTimeError] = useState(false);
  const [endTime, setEndTime] = useState("");
  const [isEndTimeError, setIsEndTimeError] = useState(false);
  const [link, setLink] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showErrorToast, setShowErrorToast] = useState(false);
  const { loggedInUser } = useContext(UserContext);
  const navigate = useNavigate();

  function handleCreateNewEvent(e) {
    e.preventDefault();

    if (!eventTitle) setIsTitleError(true);
    if (!eventDescription) setIsDescriptionError(true);
    if (!host) setIsHostError(true);
    if (!image) setIsImageError(true);
    if (!location) setIsLocationError(true);
    if (!startDate) setIsStartDataError(true);
    if (!startTime) setIsStartTimeError(true);
    if (!endDate) setIsEndDateError(true);
    if (!endTime) setIsEndTimeError(true);

    if (!eventTitle || !eventDescription || !host || !location || !image || !startDate || !startTime || !endDate || !endTime) return;

    setIsLoading(true);
    setShowErrorToast(false);
    const authorisation = setAuthorisationHeader(loggedInUser);
  }

  return (
    <section id="create-event">
      <UserHeader />
      <div className="create-event">
        <section id="create-event-container">
          <h2 className="create-new-event-title">Create a new Event</h2>
          <form className="create-event-form" onSubmit={handleCreateNewEvent}>
            <div className="create-event-input-container">
              <label className="create-event-label" htmlFor="event-image">
                <p className="create-event-text bold">Image URL: </p>
              </label>
              <div className="post-event-input-container">
                <input
                  className="create-event-input input-width"
                  name="event-image"
                  type="url"
                  value={image}
                  onChange={(e) => {
                    setImage(e.target.value);
                    setIsImageError(false);
                  }}
                ></input>
                {isImageError && <p className="form-field-missing-text">Image URL is required</p>}
              </div>
            </div>

            <div className="create-event-input-container">
              <label className="create-event-label" htmlFor="event-title">
                <p className="create-event-text bold">Event Title: </p>
              </label>
              <div className="post-event-input-container">
                <input
                  className="create-event-input input-width"
                  name="event-title"
                  type="text"
                  value={eventTitle}
                  onChange={(e) => {
                    setEventTitle(e.target.value);
                    setIsTitleError(false);
                  }}
                ></input>
                {isTitleError && <p className="form-field-missing-text">Event title is required</p>}
              </div>
            </div>
            <div className="create-event-input-container">
              <label className="create-event-label" htmlFor="event-description">
                <p className="create-event-text bold">Event Description: </p>
              </label>
              <div className="post-event-input-container">
                <TextareaAutosize
                  className="create-event-textarea input-width"
                  name="event-description"
                  type="text"
                  value={eventDescription}
                  onChange={(e) => {
                    setEventDescription(e.target.value);
                    setIsDescriptionError(false);
                  }}
                ></TextareaAutosize>
                {isDescriptionError && <p className="form-field-missing-text">Event description is required</p>}
              </div>
            </div>
            <div className="create-event-input-container">
              <label className="create-event-label" htmlFor="event-organiser">
                <p className="create-event-text bold">Organiser: </p>
              </label>
              <div className="post-event-input-container">
                <input
                  className="create-event-input input-width"
                  name="event-organier"
                  type="text"
                  value={host}
                  onChange={(e) => {
                    setHost(e.target.value);
                    setIsHostError(false);
                  }}
                ></input>
                {isHostError && <p className="form-field-missing-text">Organiser is required</p>}
              </div>
            </div>
            <div className="create-event-input-container">
              <label className="create-event-label" htmlFor="event-start-date">
                <p className="create-event-text bold">Start Date: </p>
              </label>
              <div className="post-event-input-container">
                <input
                  className="create-event-input input-width"
                  name="event-start-date"
                  type="date"
                  value={startDate}
                  onChange={(e) => {
                    setStartDate(e.target.value);
                    setIsStartDataError(false);
                  }}
                ></input>
                {isStartDateError && <p className="form-field-missing-text">Start date is required</p>}
              </div>
            </div>
            <div className="create-event-input-container">
              <label className="create-event-label" htmlFor="event-end-date">
                <p className="create-event-text bold">End Date: </p>
              </label>
              <div className="post-event-input-container">
                <input
                  className="create-event-input input-width"
                  name="event-end-date"
                  type="date"
                  value={endDate}
                  onChange={(e) => {
                    setEndDate(e.target.value);
                    setIsEndDateError(false);
                  }}
                ></input>
                {isEndDateError && <p className="form-field-missing-text">End date is required</p>}
              </div>
            </div>
            <div className="create-event-input-container">
              <label className="create-event-label" htmlFor="event-start-time">
                <p className="create-event-text bold">Start Time: </p>
              </label>
              <div className="post-event-input-container">
                <input
                  className="create-event-input input-width"
                  name="event-start-time"
                  type="time"
                  value={startTime}
                  onChange={(e) => {
                    setStartTime(e.target.value);
                    setIsStartTimeError(false);
                  }}
                ></input>
                {isStartTimeError && <p className="form-field-missing-text">Start time is required</p>}
              </div>
            </div>
            <div className="create-event-input-container">
              <label className="create-event-label" htmlFor="event-end-time">
                <p className="create-event-text bold">End Time: </p>
              </label>
              <div className="post-event-input-container">
                <input
                  className="create-event-input input-width"
                  name="event-end-time"
                  type="time"
                  value={endTime}
                  onChange={(e) => {
                    setEndTime(e.target.value);
                    setIsEndTimeError(false);
                  }}
                ></input>
                {isEndTimeError && <p className="form-field-missing-text">End time is required</p>}
              </div>
            </div>
            <div className="create-event-input-container">
              <label className="create-event-label" htmlFor="event-location">
                <p className="create-event-text bold">Location: </p>
              </label>
              <div className="post-event-input-container">
                <input
                  className="create-event-input input-width"
                  name="event-location"
                  type="text"
                  value={location}
                  onChange={(e) => {
                    setLocation(e.target.value);
                    setIsLocationError(false);
                  }}
                ></input>
                {isLocationError && <p className="form-field-missing-text">Location is required</p>}
              </div>
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
