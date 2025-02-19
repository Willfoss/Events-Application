import React from "react";
import "./eventsProvider.css";
import UserHeader from "../UserHeader/UserHeader";
import Events from "../Events/Events";

export default function EventsProvider() {
  return (
    <div className="events-provider-container">
      <UserHeader />
      <Events />
    </div>
  );
}
