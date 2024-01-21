import axios from "axios";

export default function setToken(token) {
  if (token) {
    return (axios.defaults.headers.common["Authorization"] = token);
  } else {
    return delete axios.defaults.headers.common["Authorization"];
  }
}
