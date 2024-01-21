import axios from "axios";
import { Toast } from "../../util/Toast";

import {
  GET_ADVERTISEMENT,
  EDIT_ADVERTISEMENT,
  SHOW_ADVERTISEMENT,
} from "./types";

export const getAdvertisement = () => (dispatch) => {
  axios
    .get("/advertisement")
    .then((res) => {
      if (res.data.status) {
        dispatch({ type: GET_ADVERTISEMENT, payload: res.data.advertisement });
      } else {
        Toast("error", res.data.message);
      }
    })
    .catch((error) => {
      Toast("error", error.message);
    });
};

export const editAdvertisement = (id, data) => (dispatch) => {
  axios
    .patch(`/advertisement/${id}`, data)
    .then((res) => {
      if (res.data.status) {
        dispatch({ type: EDIT_ADVERTISEMENT, payload: res.data.advertisement });
        Toast("success", "Updated Successfully!");
      } else {
        Toast("error", res.data.message);
      }
    })
    .catch((error) => {
      Toast("error", error.message);
    });
};

export const showAdvertisement = (id) => (dispatch) => {
  axios
    .put(`/advertisement/${id}`)
    .then((res) => {
      if (res.data.status) {
        dispatch({ type: SHOW_ADVERTISEMENT, payload: res.data.advertisement });
        Toast("success", "Updated Successfully!");
      } else {
        Toast("error", res.data.message);
      }
    })
    .catch((error) => {
      Toast("error", error.message);
    });
};
