import axios from "axios";
import { Toast } from "../../util/Toast";

import { GET_REPORTED_USER } from "./types";

export const getReportedUser = () => (dispatch) => {
  axios
    .get("/report")
    .then((res) => {
      if (res.data.status) {
        dispatch({ type: GET_REPORTED_USER, payload: res.data.report });
      } else {
        Toast("error", res.data.message);
      }
    })
    .catch((error) => Toast("error", error.message));
};
