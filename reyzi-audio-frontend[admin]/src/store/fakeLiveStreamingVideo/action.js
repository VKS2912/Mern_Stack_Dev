import axios from "axios";
import { Toast } from "../../util/Toast";

import {
  DELETE_LIVE_STEAMING_VIDEO,
  GET_FAKE_USER_LIST,
  GET_LIVE_STEAMING_VIDEO,
  INSERT_LIVE_STEAMING_VIDEO,
  UPDATE_LIVE_STEAMING_VIDEO,
} from "./type";

export const getLiveStreamingVideo = (id) => (dispatch) => {
  axios
    .get(id ? `fakeLiveStreamingVideo?userId=${id}` : `fakeLiveStreamingVideo`)
    .then((res) => {
      if (res.data.status) {
        dispatch({ type: GET_LIVE_STEAMING_VIDEO, payload: res.data.video });
      } else {
        Toast("error", res.data.message);
      }
    })
    .catch((error) => Toast("error", error.message));
};

export const getFakeUserList = () => (dispatch) => {
  axios
    .get(`user/fake`)
    .then((res) => {
      if (res.data.status) {
        dispatch({ type: GET_FAKE_USER_LIST, payload: res.data.user });
      } else {
        Toast("error", res.data.message);
      }
    })
    .catch((error) => Toast("error", error.message));
};

//create livestream video
export const createFakeLiveStreamingVideo = (data) => (dispatch) => {
  axios
    .post(`fakeLiveStreamingVideo`, data)
    .then((res) => {
      if (res.data.status) {
        dispatch({ type: INSERT_LIVE_STEAMING_VIDEO, payload: res.data.video });
      } else {
        Toast("error", res.data.message);
      }
    })
    .catch((error) => Toast("error", error.message));
};

//update livestream video
export const updateFakeLiveStreamingVideo = (data, id) => (dispatch) => {
  axios
    .patch(`fakeLiveStreamingVideo/${id}`, data)
    .then((res) => {
      if (res.data.status) {
        dispatch({ type: UPDATE_LIVE_STEAMING_VIDEO, payload: res.data.video });
      } else {
        Toast("error", res.data.message);
      }
    })
    .catch((error) => Toast("error", error.message));
};

export const deleteFakeLiveStreamingVideo = (id) => (dispatch) => {
  axios
    .delete(`fakeLivestreamingVideo/${id}`)
    .then((res) => {
      if (res.data.status) {
        dispatch({ type: DELETE_LIVE_STEAMING_VIDEO, payload: id });
      } else {
        Toast("error", res.data.message);
      }
    })
    .catch((error) => console.log(error));
};
