import React, { useContext, useEffect, useState } from "react";
import "./myEvents.css";
import UserHeader from "../UserHeader/UserHeader";
import { UserContext } from "../../Context/UserContext";
import Loading from "../Loading/Loading";
import Error from "../Error/Error";
import { getAllEventsForUser } from "../../api";
import setAuthorisationHeader from "../../Auth/auth-config";
import EventCard from "../EventCard/EventCard";

export default function MyEvents() {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(true);
  const [myEvents, setMyEvents] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const { loggedInUser } = useContext(UserContext);

  useEffect(() => {
    setIsLoading(true);
    setIsError(true);
    const authorisation = setAuthorisationHeader(loggedInUser);
    getAllEventsForUser(loggedInUser.user_id, authorisation)
      .then((events) => {
        setMyEvents(events);
        setIsLoading(false);
      })
      .catch((error) => {
        setIsLoading(false);
        setIsError(true);
        setErrorMessage(error.response.data.message);
      });
  }, []);

  return (
    <div className="my-events-container">
      <UserHeader />
      <section className="events">
        {isLoading ? (
          <Loading />
        ) : isError ? (
          <Error errorMessage={errorMessage} setIsError={setIsError} />
        ) : (
          <ul className="events-container">
            {myEvents.map((myEvent) => {
              console.log(myEvent.event_id);
              return <EventCard key={myEvent.event_id} event={myEvent} />;
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
