import React, { useContext, useEffect, useState } from "react";
import { Calendar1, Search } from "lucide-react";
import "./userHeader.css";
import { UserContext } from "../../Context/UserContext";
import { Link, useNavigate } from "react-router-dom";

export default function UserHeader() {
  const [activeClass, setActiveClass] = useState(false);
  const { loggedInUser } = useContext(UserContext);
  const navigate = useNavigate();
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
    <section id="header">
      <div className="brand" onClick={() => navigate("/events")}>
        <Calendar1 className="logo"></Calendar1>
        <h1 className="logo-heading">EventSphere</h1>
      </div>
      <nav>
        {windowPixels.width <= 768 ? (
          <>
            <div className={`hamburger ${activeClass && "active"}`} onClick={() => setActiveClass(!activeClass)}>
              <span className="bar"></span>
              <span className="bar"></span>
              <span className="bar"></span>
            </div>
            <ul className={`hamburger-navigation-menu ${activeClass && "active"}`}>
              <li className="navigation-item">
                <Link to="/events" className="link">
                  Events
                </Link>
              </li>
              <li className="navigation-item">
                <Link className="link">My Events</Link>
              </li>
              <li className="navigation-item">
                <Link className="link">My Profile</Link>
              </li>
              {loggedInUser.role === "admin" && (
                <li className="navigation-item">
                  <Link className="link">Admin Dashboard</Link>
                </li>
              )}
            </ul>
            <div className={`content-dimmer ${activeClass && "active"}`} onClick={() => setActiveClass(false)}></div>
          </>
        ) : (
          <ul className="navigation-link-container">
            <Link to="/events" className="link">
              Events
            </Link>
            <Link to="/my-events" className="link">
              My Events
            </Link>
            <Link to="/my-profile" className="link">
              My Profile
            </Link>
            {loggedInUser.role === "admin" && <Link className="link">Admin Dashboard</Link>}
          </ul>
        )}
      </nav>
    </section>
  );
}
