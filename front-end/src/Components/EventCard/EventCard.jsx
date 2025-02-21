import React, { useEffect, useState } from "react";
import "./eventCard.css";
import { convertToStringMonth } from "../utils/utils";
import { Link } from "react-router-dom";

export default function EventCard(props) {
  const { event } = props;
  const [windowPixels, setWindowPixels] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
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
      <div className="event-card-container">
        <div className="event-details-container">
          <img className="event-card-image" src={event.image}></img>
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
          <div className="event-date-container">
            <p className="event-text center bold">{convertToStringMonth(event.start_date.slice(3, 5))}</p>
            <p className="event-text center bold">{event.start_date.slice(0, 2)}</p>
            <p className="event-text center bold">{event.start_date.slice(6, 11)}</p>
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
