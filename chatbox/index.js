import React from "react";
import ReactDOM from "react-dom";
import { get } from "axios";
import App from "./App";

get("/whoami")
  .then((res) => {
    if (res.status === 404) window.location.href = "/login";
    return res.data;
  })
  .then((whoami) => {
    if (whoami && whoami.id) {
      const root = document.getElementById("root");
      ReactDOM.render(<App whoami={whoami} />, root);

      const spinner = document.querySelector(".spinner");
      spinner.parentNode.removeChild(spinner);
    }
  })
  .catch((error) => console.error(error));
