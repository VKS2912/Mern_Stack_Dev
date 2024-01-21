import axios from "axios";
import {Toast} from "../../util/Toast";

import {GET_REDEEM, ACCEPT_REDEEM} from "./types";

export const getRedeem = (type) => (dispatch) => {
  axios
    .get(`redeem?type=${type}`)
    .then((res) => {
      if (res.data.status) {
        dispatch({type: GET_REDEEM, payload: res.data.redeem});
      } else {
        Toast("error", res.data.message);
      }
    })
    .catch((error) => {
      console.log(error);
      Toast("error", error.message);
    });
};

export const acceptRedeem = (id, type) => (dispatch) => {
  axios
    .patch(`redeem/${id}?type=${type}`)
    .then((res) => {
      if (res.data.status) {
        if (type === "decline") return Toast("error", "Decline Success!!");
        if (type === "accept") return Toast("success", "Accept Success!!");
        dispatch({type: ACCEPT_REDEEM, payload: res.data.redeem});
      } else {
        Toast("error", res.data.message);
      }
    })
    .catch((error) => {
      console.log(error);
      Toast("error", error.message);
    });
};
