import React from "react";
import ReactDOM from "react-dom";
import App from "./App";

fetch("/whoami")
  .then((res) => {
    if (res.status === 404) window.location.href = "/login";
    return res.json();
  })
  .then((whoami) => {
    const root = document.getElementById("root");
    ReactDOM.render(<App whoami={whoami} />, root);

    const spinner = document.querySelector(".spinner");
    spinner.parentNode.removeChild(spinner);
  })
  .catch((error) => console.error(error));
