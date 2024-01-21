import axios from "axios";
import { Toast } from "../../util/Toast";
import {
  GET_HASHTAG,
  CREATE_NEW_HASHTAG,
  EDIT_HASHTAG,
  CLOSE_HASHTAG_DIALOG,
  DELETE_HASHTAG,
} from "./types";

export const getHashtag = () => (dispatch) => {
  axios
    .get(`hashtag`)
    .then((res) => {
      if (res.data.status) {
        dispatch({ type: GET_HASHTAG, payload: res.data.hashtag });
      } else {
        Toast("error", res.data.message);
      }
    })
    .catch((error) => Toast("error", error.message));
};
export const createNewHashtag = (data) => (dispatch) => {
  axios
    .post(`hashtag`, data)
    .then((res) => {
      if (res.data.status) {
        Toast("success", "Hashtag created successfully!");
        dispatch({ type: CLOSE_HASHTAG_DIALOG });
        dispatch({ type: CREATE_NEW_HASHTAG, payload: res.data.hashtag });
      } else {
        Toast("error", res.data.message);
      }
    })
    .catch((error) => Toast("error", error.message));
};
export const editHashtag = (hashtagId, data) => (dispatch) => {
  axios
    .patch(`hashtag/${hashtagId}`, data)
    .then((res) => {
      if (res.data.status) {
        Toast("success", "Hashtag updated successfully!");
        dispatch({ type: CLOSE_HASHTAG_DIALOG });
        dispatch({
          type: EDIT_HASHTAG,
          payload: { data: res.data.hashtag, id: hashtagId },
        });
      } else {
        Toast("error", res.data.message);
      }
    })
    .catch((error) => Toast("error", error.message));
};
export const deleteHashtag = (hashtagId) => (dispatch) => {
  axios
    .delete(`hashtag/${hashtagId}`)
    .then((res) => {
      if (res.data.status) {
        dispatch({ type: DELETE_HASHTAG, payload: hashtagId });
      } else {
        Toast("error", res.data.message);
      }
    })
    .catch((error) => console.log(error));
};
