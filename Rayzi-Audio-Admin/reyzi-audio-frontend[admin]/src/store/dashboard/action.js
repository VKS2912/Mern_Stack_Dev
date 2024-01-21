import axios from "axios";
import { Toast } from "../../util/Toast";

import { GET_ANALYTIC, GET_DASHBOARD } from "./types";

export const getDashboard = () => (dispatch) => {
  axios
    .get(`dashboard`)
    .then((res) => {
      if (res.data.status) {
        dispatch({ type: GET_DASHBOARD, payload: res.data.dashboard });
      } else {
        Toast("error", res.data.message);
      }
    })
    .catch((error) => {
      Toast("error", error.message);
    });
};

export const getAnalytic = (type, start, end) => (dispatch) => {
  axios
    .get(`dashboard/analytic?type=${type}&startDate=${start}&endDate=${end}`)
    .then((res) => {
      if (res.data.status) {
        dispatch({ type: GET_ANALYTIC, payload: res.data.analytic });
      } else {
        Toast("error", res.data.message);
      }
    })
    .catch((error) => {
      Toast("error", error.message);
    });
};
