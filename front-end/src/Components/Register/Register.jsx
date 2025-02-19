import React, { useContext, useState } from "react";
import "./register.css";
import { Link, useNavigate } from "react-router-dom";
import Lottie from "lottie-react";
import buttonLoading from "../../assets/loading-button.json";
import Header from "../Header/Header.jsx";
import { registerNewUser } from "../../api.js";
import Error from "../Error/Error.jsx";
import { UserContext } from "../../Context/UserContext.jsx";

export default function Register(props) {
  const { setShowToast } = props;
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isNameError, setIsNameError] = useState(false);
  const [isEmailError, setIsEmailError] = useState(false);
  const [isPasswordError, setIsPasswordError] = useState(false);
  const [isConfirmPasswordError, setIsConfirmPasswordError] = useState(false);
  const navigate = useNavigate();
  const { loggedInUser } = useContext(UserContext);

  function handleNameChange(event) {
    setName(event.target.value);
    setIsNameError(false);
  }

  function handleEmailChange(event) {
    setEmail(event.target.value.toLowerCase());
    setIsEmailError(false);
  }

  function handlePasswordChange(event) {
    setPassword(event.target.value);
    setIsPasswordError(false);
    if (confirmPassword === event.target.value) setIsConfirmPasswordError(false);
  }

  function handleConfirmPasswordChange(event) {
    setConfirmPassword(event.target.value);
    if (password === event.target.value) setIsConfirmPasswordError(false);
  }

  function handleregisterSubmit(event) {
    event.preventDefault();

    if (!name || name.trim() === "") {
      setIsNameError(true);
    }
    if (!email) {
      setIsEmailError(true);
    }
    if (/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/.test(password) === false) {
      setIsPasswordError(true);
    }
    if (confirmPassword !== password) {
      setIsConfirmPasswordError(true);
    }
    if (
      !name ||
      name.trim() === "" ||
      !email ||
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/.test(password) === false ||
      confirmPassword !== password
    ) {
      return;
    } else {
      setIsError(false);
      setIsLoading(true);
      registerNewUser(name, email, password)
        .then((data) => {
          setIsLoading(false);
          navigate("/");
          setShowToast(true);
        })
        .catch((error) => {
          setIsLoading(false);
          setErrorMessage(error.response.data.message);
          setIsError(true);
        });
    }
  }

  return (
    <section id="register-section">
      <Header />
      <div className="register-page-container">
        <div className="register-container">
          <form onSubmit={handleregisterSubmit} className="register-form">
            <h2 className="register-header">Register for Free</h2>
            {isError && <Error setIsError={setIsError} errorMessage={errorMessage} />}
            <label className="register-text" htmlFor="name">
              Name
              <input className="register-text text-input" name="name" type="text" value={name} onChange={handleNameChange}></input>
              {isNameError && <p className="register-error-text ">Enter a Name</p>}
            </label>
            <label className="register-text " htmlFor="email">
              Email Address
              <input className="register-text text-input" name="email" type="email" value={email} onChange={handleEmailChange}></input>
              {isEmailError && <p className="register-error-text ">Enter an Email Address</p>}
            </label>
            <label className="register-text" htmlFor="password">
              Password
              <input className="register-text text-input" name="password" type="password" value={password} onChange={handlePasswordChange}></input>
              {isPasswordError && (
                <p className="register-error-text ">Password must contain at least one uppercase letter, one lowercase letter and one number</p>
              )}
            </label>
            <label className="register-text" htmlFor="confirm-password">
              Confirm Password
              <input
                className="register-text text-input"
                name="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
              ></input>
              {isConfirmPasswordError && <p className="register-error-text ">Passwords must match</p>}
            </label>
            <label className="register-text" htmlFor="profile-picture"></label>
            {isLoading === true ? (
              <div className="register-button-loading">
                <Lottie className="button-loading-animation " animationData={buttonLoading} loop={true} />
              </div>
            ) : (
              <button className="register-button">Sign up</button>
            )}
            <Link className="link" to="/">
              <p className="to-login"> Already a user? Log in!</p>
            </Link>
          </form>
        </div>
      </div>
    </section>
  );
}
