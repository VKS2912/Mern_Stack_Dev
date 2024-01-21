import axios from "axios";

export default function setDevKey(key) {
  if (key) {
    return (axios.defaults.headers.common["key"] = key);
  } else {
    return delete axios.defaults.headers.common["key"];
  }
}
