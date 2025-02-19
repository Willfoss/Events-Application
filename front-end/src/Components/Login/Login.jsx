import React, { useContext, useState } from "react";
import "./login.css";
import { Link, useNavigate } from "react-router-dom";
import buttonLoading from "../../assets/loading-button.json";
import Lottie from "lottie-react";
import Header from "../Header/Header.jsx";
import Toast from "../Toast/Toast.jsx";
import Error from "../Error/Error.jsx";
import { logInUser } from "../../api.js";
import { UserContext } from "../../Context/UserContext.jsx";

export default function Login(props) {
  const { showToast, setShowToast } = props;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isEmailError, setIsEmailError] = useState(false);
  const [isPasswordError, setIsPasswordError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { userChanged, setUserChanged, loggedInUser, setLoggedInUser } = useContext(UserContext);
  const navigate = useNavigate();

  function handleEmailChange(event) {
    setEmail(event.target.value.toLowerCase());
    setIsEmailError(false);
  }

  function handlePasswordChange(event) {
    setPassword(event.target.value);
    setIsPasswordError(false);
  }

  function handleLoginFormSubmit(event) {
    event.preventDefault();
    if (!email) {
      setIsEmailError(true);
    }
    if (!password) {
      setIsPasswordError(true);
    }
    if (!email || !password) {
      return;
    }
    setIsLoading(true);
    setIsError(false);
    logInUser(email, password)
      .then(({ user }) => {
        setIsLoading(false);
        setLoggedInUser(user);
        localStorage.setItem("user", JSON.stringify(user));
        setUserChanged(!userChanged);
        navigate("/events");
      })
      .catch((error) => {
        setIsLoading(false);
        setIsError(true);
        setErrorMessage(error.response.data.message);
      });
  }

  return (
    <section id="login-section">
      <Header />
      <div className="login-page-container">
        <div className="login-container">
          <form onSubmit={handleLoginFormSubmit} className="login-form">
            <h2 className="login-header">Log in</h2>
            {showToast && <Toast setShowToast={setShowToast} successStatic="yes" successMessage="You Successfully signed up! Please log in below" />}
            {isError && <Error setIsError={setIsError} errorMessage={errorMessage} />}
            <label htmlFor="email">
              <input
                className="login-text text-input"
                name="email"
                type="email"
                value={email}
                onChange={handleEmailChange}
                placeholder="Email"
              ></input>
              {isEmailError && <p className="login-error-text ">Enter a Name</p>}
            </label>
            <label htmlFor="password">
              <input
                className="login-text text-input"
                name="password"
                type="password"
                value={password}
                onChange={handlePasswordChange}
                placeholder="Password"
              ></input>
              {isPasswordError && <p className="login-error-text ">Enter an Email Address</p>}
            </label>
            {isLoading === true ? (
              <div className="signup-button-loading">
                <Lottie className="button-loading-animation " animationData={buttonLoading} loop={true} />
              </div>
            ) : (
              <button className="login-button">Log in</button>
            )}
            <Link className="link" to="/register">
              <p className="to-signup"> Not a user? Register here!</p>
            </Link>
          </form>
        </div>
      </div>
    </section>
  );
}
