import React, { useEffect, useState } from "react";
import "./eventsProvider.css";
import UserHeader from "../UserHeader/UserHeader";
import Events from "../Events/Events";
import { useLocation, useNavigate } from "react-router-dom";

export default function EventsProvider(props) {
  let location = useLocation();
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [successToastMessage, setSuccessToastMessage] = useState("");
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

  return (
    <div className="events-provider-container">
      <UserHeader />
      <Events showSuccessToast={showSuccessToast} setShowSuccessToast={setShowSuccessToast} successToastMessage={successToastMessage} />
    </div>
  );
}
