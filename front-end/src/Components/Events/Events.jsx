import React, { useContext, useEffect, useState } from "react";
import { getAllEvents } from "../../api";
import setAuthorisationHeader from "../../Auth/auth-config";
import { UserContext } from "../../Context/UserContext";
import Loading from "../Loading/Loading";
import "./events.css";
import Error from "../Error/Error";
import EventCard from "../EventCard/EventCard";
import Toast from "../Toast/Toast";

export default function Events(props) {
  const { showSuccessToast, setShowSuccessToast, successToastMessage, eventSearch, eventDate, toggleSearching, setToggleSearching } = props;
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { loggedInUser } = useContext(UserContext);

  useEffect(() => {
    setIsLoading(true);
    setIsError(false);
    const authorisation = setAuthorisationHeader(loggedInUser);
    if (eventDate && eventSearch) {
      authorisation.params = { date: eventDate.split("-").reverse().join("/"), search: eventSearch };
    } else if (eventDate) {
      authorisation.params = { date: eventDate.split("-").reverse().join("/") };
    } else if (eventSearch) {
      authorisation.params = { search: eventSearch };
    }
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
  }, [eventDate, toggleSearching]);

  return (
    <section className="events">
      {isLoading ? (
        <Loading />
      ) : isError ? (
        <Error errorMessage={errorMessage} setIsError={setIsError} />
      ) : (
        <>
          {showSuccessToast && <Toast success="yes" setShowToast={setShowSuccessToast} successMessage={successToastMessage} />}
          <ul className="events-container">
            {events.map((event) => {
              return <EventCard key={event.event_id} event={event} />;
            })}
          </ul>
        </>
      )}
    </section>
  );
}
