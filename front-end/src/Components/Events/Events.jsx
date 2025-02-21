import React, { useContext, useEffect, useState } from "react";
import { getAllEvents } from "../../api";
import setAuthorisationHeader from "../../Auth/auth-config";
import { UserContext } from "../../Context/UserContext";
import Loading from "../Loading/Loading";
import "./events.css";
import Error from "../Error/Error";
import EventCard from "../EventCard/EventCard";

export default function Events() {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { loggedInUser } = useContext(UserContext);

  useEffect(() => {
    setIsLoading(true);
    setIsError(false);
    const authorisation = setAuthorisationHeader(loggedInUser);
    getAllEvents(authorisation)
      .then(({ events }) => {
        setEvents(events);
        setIsLoading(false);
      })
      .catch((error) => {
        setIsLoading(false);
        setIsError(true);
        setErrorMessage(error.response.data.message);
      });
  }, []);

  return (
    <section className="events">
      {isLoading ? (
        <Loading />
      ) : isError ? (
        <Error errorMessage={errorMessage} setIsError={setIsError} />
      ) : (
        <ul className="events-container">
          {events.map((event) => {
            return <EventCard key={event.event_id} event={event} />;
          })}
        </ul>
      )}
    </section>
  );
}
