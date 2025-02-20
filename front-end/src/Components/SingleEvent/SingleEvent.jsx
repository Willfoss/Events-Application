import React, { useContext, useEffect, useState } from "react";
import "./singleEvent.css";
import UserHeader from "../UserHeader/UserHeader";
import { useParams } from "react-router-dom";
import { UserContext } from "../../Context/UserContext";
import { getSingleEvent } from "../../api";
import setAuthorisationHeader from "../../Auth/auth-config";
import { convertToLongStringMonth } from "../utils/utils";

export default function SingleEvent() {
  const { event_id } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [ErrorMessage, setErrorMessage] = useState("");
  const [event, setEvent] = useState({});
  const { loggedInUser } = useContext(UserContext);
  const [startDay, setStartDay] = useState("");
  const [startMonth, setStartMonth] = useState("");
  const [startYear, setStartYear] = useState("");
  const [endDay, setEndDay] = useState("");
  const [endMonth, setEndMonth] = useState("");
  const [endYear, setEndYear] = useState("");

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
        setIsLoading(false);
      })
      .catch((error) => {
        setIsLoading(false);
        setIsError(true);
        setErrorMessage(error.response.data.message);
      });
  }, [event_id]);

  function registerForEvent() {}

  console.log(event);

  return (
    <div className="single-event">
      <UserHeader />
      <section id="single-event-container">
        <img className="single-event-image" src={event.image}></img>
        <div className="event-content-container">
          <h2 className="event-title">{event.event_title}</h2>
          <p className="event-text">{event.event_description}</p>
          <p className="event-text">
            <span className="bold">Organiser: </span>
            {event.host}
          </p>
          <p className="event-text">
            <span className="bold">Start Date: </span>
            {startDay} {startMonth} {startYear}
          </p>
          <p className="event-text">
            <span className="bold">End Date: </span>
            {endDay} {endMonth} {endYear}
          </p>
          <p className="event-text">
            <span className="bold">Start Time: </span> {event.start_time}
          </p>
          <p className="event-text">
            <span className="bold">End Time: </span> {event.end_time}
          </p>
          <p className="event-text">
            <span className="bold">Number of attendees: </span> {event.number_of_attendees}
          </p>
          <p className="event-text">
            <span className="bold">Location: </span>
            {event.location}
          </p>
          <button className="register-for-event-button" onClick={registerForEvent}>
            Register for Event
          </button>
        </div>
      </section>
    </div>
  );
}
