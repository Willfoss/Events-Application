import React from "react";
import buttonLoading from "../../assets/loading-button.json";
import Lottie from "lottie-react";
import "./loading.css";

export default function Loading() {
  return (
    <div className="main-content-loading">
      <Lottie className="loading-animation " animationData={buttonLoading} loop={true} />
    </div>
  );
}
