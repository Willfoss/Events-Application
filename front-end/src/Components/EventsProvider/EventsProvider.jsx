import React, { useEffect, useState } from "react";
import "./eventsProvider.css";
import UserHeader from "../UserHeader/UserHeader";
import Events from "../Events/Events";
import { useLocation, useNavigate } from "react-router-dom";
import { Search } from "lucide-react";

export default function EventsProvider(props) {
  let location = useLocation();
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [successToastMessage, setSuccessToastMessage] = useState("");
  const [search, setSearch] = useState("");
  const [toggleSearching, setToggleSearching] = useState(false);
  const [eventDate, setEventDate] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (location.state && location.state.showSuccessToast === true) {
      setShowSuccessToast(true);
      setSuccessToastMessage(location.state.successToastText);
      navigate(location.pathname, { replace: true });
    } else {
      setShowSuccessToast(false);
    }
  }, []);

  function handleSearchChange(event) {
    setSearch(event.target.value);
  }

  function handleSearchRequest(event) {
    if (event._reactName === "onClick" || event.key === "Enter") {
      setToggleSearching(!toggleSearching);
    }
  }

  function handleDateChange(event) {
    setEventDate(event.target.value);
  }

  return (
    <div className="events-provider-container">
      <UserHeader />
      <div className="events-header-image">
        <div className="event-filters-container">
          <label className="date-events-label bold" htmlFor="event-search">
            Search by Date
            <input className="event-search-input" name="event-date" value={eventDate} onChange={handleDateChange} type="date"></input>
          </label>
          <label className="search-events-label bold" htmlFor="event-search">
            Search by Event
            <div className="events-search-icon-bar-container">
              <input
                className="event-search-input"
                name="event-search"
                placeholder="search for an event"
                value={search}
                onChange={handleSearchChange}
                onKeyDown={handleSearchRequest}
              ></input>
              <Search className="search-event-icon" onClick={handleSearchRequest} />
            </div>
          </label>
        </div>
      </div>
      <div className="event-filters-mobile-container">
        <label className="date-events-label-mobile bold" htmlFor="event-search">
          Search by Date
          <input className="event-search-mobile-input" name="event-date" value={eventDate} onChange={handleDateChange} type="date"></input>
        </label>
        <label className="search-events-label bold" htmlFor="event-search">
          Search by Event
          <div className="events-search-icon-bar-container">
            <input
              className="event-search-mobile-input"
              name="event-search"
              placeholder="search for an event"
              value={search}
              onChange={handleSearchChange}
              onKeyDown={handleSearchRequest}
            ></input>
            <Search className="search-event-mobile-icon" onClick={handleSearchRequest} />
          </div>
        </label>
      </div>
      <Events
        showSuccessToast={showSuccessToast}
        setShowSuccessToast={setShowSuccessToast}
        successToastMessage={successToastMessage}
        eventSearch={search}
        eventDate={eventDate}
        toggleSearching={toggleSearching}
        setToggleSearching={setToggleSearching}
      />
    </div>
  );
}
