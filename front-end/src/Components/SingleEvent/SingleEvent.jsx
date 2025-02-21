import React, { useContext, useEffect, useState } from "react";
import "./singleEvent.css";
import UserHeader from "../UserHeader/UserHeader";
import { useParams } from "react-router-dom";
import { UserContext } from "../../Context/UserContext";
import { deleteEventAttendee, getAttendeesForEvent, getSingleEvent, registerForEvent } from "../../api";
import setAuthorisationHeader from "../../Auth/auth-config";
import { convertToLongStringMonth } from "../utils/utils";
import buttonLoading from "../../assets/loading-button.json";
import Lottie from "lottie-react";
import Toast from "../Toast/Toast";
import Loading from "../Loading/Loading";
import Error from "../Error/Error";
import EditEvent from "../EditEvent/EditEvent";

export default function SingleEvent() {
  const { event_id } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [isRegistrationLoading, setIsRegistrationLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [showErrorToast, setShowErrorToast] = useState(false);
  const [isCancellingLoading, setIsCancellingLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isUserAlreadyAttendingEvent, setIsUserAlreadyAttendingEvent] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [toastSuccessMessage, setToastSuccessMessage] = useState("");
  const [event, setEvent] = useState({});
  const { loggedInUser } = useContext(UserContext);
  const [startDay, setStartDay] = useState("");
  const [startMonth, setStartMonth] = useState("");
  const [startYear, setStartYear] = useState("");
  const [endDay, setEndDay] = useState("");
  const [endMonth, setEndMonth] = useState("");
  const [endYear, setEndYear] = useState("");
  const [isStaffEditing, setIsStaffEditing] = useState(false);
  let [optimisticAttendeeCount, setOptimisticAttendeeCount] = useState(0);

  useEffect(() => {
    setIsLoading(true);
    setIsError(false);
    const authorisation = setAuthorisationHeader(loggedInUser);
    getSingleEvent(event_id, authorisation)
      .then(({ event }) => {
        setEvent(event);
        setStartDay(event.start_date.slice(0, 2));
        setStartMonth(convertToLongStringMonth(event.start_date.slice(3, 5)));
        setStartYear(event.start_date.slice(6, 11));
        setEndDay(event.end_date.slice(0, 2));
        setEndMonth(convertToLongStringMonth(event.end_date.slice(3, 5)));
        setEndYear(event.end_date.slice(6, 11));
        setOptimisticAttendeeCount(event.number_of_attendees);

        return getAttendeesForEvent(event.event_id, authorisation);
      })
      .then((attendees) => {
        attendees.forEach((attendee) => {
          if (attendee.user_id === loggedInUser.user_id) {
            setIsUserAlreadyAttendingEvent(true);
          }
        });
        setIsLoading(false);
      })
      .catch((error) => {
        setIsLoading(false);
        setIsError(true);
        setShowErrorToast(true);
        setErrorMessage(error.response.data.message);
      });
  }, [event_id, isStaffEditing]);

  function signupForEvent() {
    setIsRegistrationLoading(true);
    setIsError(false);
    const authorisation = setAuthorisationHeader(loggedInUser);
    setOptimisticAttendeeCount((optimisticAttendeeCount += 1));
    registerForEvent(event.event_id, loggedInUser.user_id, authorisation)
      .then(({ attendee }) => {
        setIsRegistrationLoading(false);
        setIsUserAlreadyAttendingEvent(true);
        setShowSuccessToast(true);
        setToastSuccessMessage(`You have successfully signed up to ${event.event_title}`);
      })
      .catch((error) => {
        showErrorToast(true);
        setIsRegistrationLoading(false);
        setOptimisticAttendeeCount((optimisticAttendeeCount -= 1));
        setErrorMessage(error.response.data.message);
      });
  }

  function cancelRegistration() {
    setIsCancellingLoading(true);
    setIsError(false);
    setOptimisticAttendeeCount((optimisticAttendeeCount -= 1));
    const authorisation = setAuthorisationHeader(loggedInUser);
    deleteEventAttendee(event.event_id, loggedInUser.user_id, authorisation)
      .then(() => {
        setIsCancellingLoading(false);
        setIsUserAlreadyAttendingEvent(false);
        setShowSuccessToast(true);
        setToastSuccessMessage(`You are no longer attending ${event.event_title}`);
      })
      .catch((error) => {
        setIsCancellingLoading(false);
        showErrorToast(true);
        setOptimisticAttendeeCount((optimisticAttendeeCount += 1));
        setErrorMessage(error.response.data.message);
      });
  }

  return (
    <div className="single-event">
      <UserHeader />
      {isLoading ? (
        <Loading />
      ) : isError ? (
        <Error setIsError={setIsError} errorMessage={errorMessage} />
      ) : isStaffEditing ? (
        <EditEvent
          event={event}
          setShowSuccessToast={setShowSuccessToast}
          setShowErrorToast={setShowErrorToast}
          setToastSuccessMessage={setToastSuccessMessage}
          setErrorMessage={setErrorMessage}
          setIsStaffEditing={setIsStaffEditing}
        />
      ) : (
        <>
          {showSuccessToast && <Toast setShowToast={setShowSuccessToast} success="yes" successMessage={toastSuccessMessage} />}
          {showErrorToast && <Toast error="yes" setShowToast={setShowErrorToast} errorMessage={errorMessage} />}
          <section id="single-event-container">
            <img className="single-event-image" src={event.image}></img>
            {loggedInUser.role === "staff" ||
              ("admin" && (
                <button className="edit-event-button" onClick={() => setIsStaffEditing(true)}>
                  Edit Event
                </button>
              ))}
            <div className="event-content-container">
              <h2 className="single-event-title">{event.event_title}</h2>
              <p className="single-event-text">{event.event_description}</p>
              <p className="single-event-text">
                <span className="bold">Organiser: </span>
                {event.host}
              </p>
              <p className="single-event-text">
                <span className="bold">Start Date: </span>
                {startDay} {startMonth} {startYear}
              </p>
              <p className="single-event-text">
                <span className="bold">End Date: </span>
                {endDay} {endMonth} {endYear}
              </p>
              <p className="single-event-text">
                <span className="bold">Start Time: </span> {event.start_time}
              </p>
              <p className="single-event-text">
                <span className="bold">End Time: </span> {event.end_time}
              </p>
              <p className="single-event-text">
                <span className="bold">Number of attendees: </span> {optimisticAttendeeCount}
              </p>
              <p className="single-event-text">
                <span className="bold">Location: </span>
                {event.location}
              </p>
              {!isUserAlreadyAttendingEvent ? (
                isRegistrationLoading ? (
                  <div className="registration-button-loading">
                    <Lottie className="button-loading-animation " animationData={buttonLoading} loop={true} />
                  </div>
                ) : (
                  <button className="register-for-event-button" onClick={signupForEvent}>
                    Register for Event
                  </button>
                )
              ) : (
                <div className="cancel-reg-container">
                  <div className="registered-for-event">You are already signed up for this event!</div>
                  {isCancellingLoading ? (
                    <div className="cancel-registration">
                      <Lottie className="button-loading-animation " animationData={buttonLoading} loop={true} />
                    </div>
                  ) : (
                    <div className="cancel-registration" onClick={cancelRegistration}>
                      Cancel Registration
                    </div>
                  )}
                </div>
              )}
            </div>
          </section>
        </>
      )}
    </div>
  );
}
