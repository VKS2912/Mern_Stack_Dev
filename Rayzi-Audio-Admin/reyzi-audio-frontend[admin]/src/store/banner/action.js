import axios from "axios";
import { Toast } from "../../util/Toast";
import {
  CLOSE_BANNER_DIALOG,
  CREATE_NEW_BANNER,
  DELETE_BANNER,
  EDIT_BANNER,
  GET_BANNER,
  VIP_SWITCH,
} from "./types";

export const getBanner = () => (dispatch) => {
  axios
    .get(`banner/all`)
    .then((res) => {
      if (res.data.status) {
        dispatch({ type: GET_BANNER, payload: res.data.banner });
      } else {
        Toast("error", res.data.message);
      }
    })
    .catch((error) => Toast("error", error.message));
};

export const handleVIPSwitch = (bannerId) => (dispatch) => {
  axios
    .put(`banner/${bannerId}`)
    .then((res) => {
      if (res.data.status) {
        dispatch({ type: VIP_SWITCH, payload: res.data.banner });
      } else {
        Toast("error", res.data.message);
      }
    })
    .catch((error) => Toast("error", error.message));
};
export const createNewBanner = (data) => (dispatch) => {
  axios
    .post(`banner`, data)
    .then((res) => {
      if (res.data.status) {
        Toast("success", "Banner created successfully!");
        dispatch({ type: CLOSE_BANNER_DIALOG });
        dispatch({ type: CREATE_NEW_BANNER, payload: res.data.banner });
      } else {
        Toast("error", res.data.message);
      }
    })
    .catch((error) => Toast("error", error.message));
};
export const editBanner = (bannerId, data) => (dispatch) => {
  axios
    .patch(`banner/${bannerId}`, data)
    .then((res) => {
      if (res.data.status) {
        Toast("success", "Banner updated successfully!");
        dispatch({ type: CLOSE_BANNER_DIALOG });
        dispatch({
          type: EDIT_BANNER,
          payload: { data: res.data.banner, id: bannerId },
        });
      } else {
        Toast("error", res.data.message);
      }
    })
    .catch((error) => Toast("error", error.message));
};
export const deleteBanner = (bannerId) => (dispatch) => {
  axios
    .delete(`banner/${bannerId}`)
    .then((res) => {
      if (res.data.status) {
        dispatch({ type: DELETE_BANNER, payload: bannerId });
      } else {
        Toast("error", res.data.message);
      }
    })
    .catch((error) => console.log(error));
};
