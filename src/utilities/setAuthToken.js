import axios from "../api/axios";

const setAuthToken = (token) => {
  if (token) {
    // apply for every request
    axios.defaults.headers.common["Authorization"] = "Bearer " + token;
  } else {
    delete axios.defaults.headers.common["Authorization"];
  }
};

export default setAuthToken;
