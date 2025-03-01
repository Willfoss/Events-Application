import React, { useContext, useEffect, useState } from "react";
import "./eventCard.css";
import { convertToStringMonth } from "../utils/utils";
import { Link } from "react-router-dom";
import { getAttendeesForEvent } from "../../api";
import { UserContext } from "../../Context/UserContext";
import setAuthorisationHeader from "../../Auth/auth-config";

export default function EventCard(props) {
  const { event } = props;
  const [windowPixels, setWindowPixels] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const [isAleadyingAttending, setIsAleadyingAttending] = useState(false);
  const { loggedInUser } = useContext(UserContext);

  useState(() => {
    const authorisation = setAuthorisationHeader(loggedInUser);
    getAttendeesForEvent(event.event_id, authorisation).then((attendees) => {
      attendees.forEach((attendee) => {
        if (attendee.user_id === loggedInUser.user_id) {
          setIsAleadyingAttending(true);
        }
      });
    });
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

  return (
    <section id="event-card">
      {windowPixels.width <= 768 && isAleadyingAttending && <h3 className="attending-event-confirmation">You're signed up!</h3>}
      <div className="event-card-container">
        <div className="event-details-container">
          <div className="image-container">
            <img className="event-card-image" src={event.image}></img>
          </div>
          <div className="event-information-container">
            <div className="event-title-time-container">
              <h3 className="event-title">{event.event_title}</h3>
              <div className="information-container">
                <p className="event-text">
                  {event.start_time} - {event.end_time}
                </p>
                <p className=" event-text">{event.location}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="single-article-date-container">
          <div className={isAleadyingAttending ? "flex-space-between" : "event-confirmation-container"}>
            {windowPixels.width > 768 && isAleadyingAttending && <h3 className="attending-event-confirmation">You're signed up!</h3>}
            <div className="event-date-container">
              <p className="event-text center bold">{convertToStringMonth(event.start_date.slice(3, 5))}</p>
              <p className="event-text center bold">{event.start_date.slice(0, 2)}</p>
              <p className="event-text center bold">{event.start_date.slice(6, 11)}</p>
            </div>
          </div>
          {windowPixels.width > 768 && (
            <Link to={`/events/${event.event_id}`} className="single-event-button">
              More details
            </Link>
          )}
        </div>
      </div>
      {windowPixels.width <= 768 && (
        <Link to={`/events/${event.event_id}`} className="single-event-button">
          More details
        </Link>
      )}
    </section>
  );
}
