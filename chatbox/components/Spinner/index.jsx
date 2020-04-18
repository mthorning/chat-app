import React from "react";
import spinnerGif from "./spinner.gif";

export default function () {
  return (
    <div className="spinner">
      <img src={spinnerGif} />
    </div>
  );
}
