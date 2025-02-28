import React, { useEffect, useState } from "react";
import "./addToCalendar.css";
import { useNavigate } from "react-router-dom";
import { convertDateToRFC } from "../utils/utils";

export default function AddToCalendar(props) {
  const { event } = props;
  const [url, setUrl] = useState("");

  useEffect(() => {
    if (event.event_title) {
      const startDate = convertDateToRFC(event.start_date, event.start_time);
      const endDate = convertDateToRFC(event.end_date, event.end_time);
      setUrl(
        `https://calendar.google.com/calendar/u/0/r/eventedit?text=${event.event_title}&dates=${startDate}/${endDate}&details=${event.event_description}&location=${event.location}`
      );
    }
  }, []);

  function addToCalendar() {
    window.open(url, "_blank");
  }

  return (
    <button className="add-to-calendar" onClick={addToCalendar}>
      Add to Calendar
    </button>
  );
}
