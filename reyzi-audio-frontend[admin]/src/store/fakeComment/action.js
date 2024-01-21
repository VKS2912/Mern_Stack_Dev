import axios from "axios";
import { Toast } from "../../util/Toast";
import {
  CLOSE_COMMENT_DIALOG,
  DELETE_FAKE_COMMENT,
  EDIT_FAKE_COMMENT,
  GET_FAKE_COMMENT,
  INSERT_FAKE_COMMENT,
} from "./type";

export const getFakeComment = () => (dispatch) => {
  axios
    .get(`fakeComment`)
    .then((res) => {
      dispatch({ type: GET_FAKE_COMMENT, payload: res.data.comment });
    })
    .catch((error) => {
      console.log(error);
      Toast("error", error.message);
    });
};
export const insertFakeComment = (data) => (dispatch) => {
  axios
    .post(`fakeComment`, data)
    .then((res) => {
      if (res.data.status) {
        dispatch({ type: INSERT_FAKE_COMMENT, payload: res.data.comment });
        Toast("success", "Insert Comment Successfully");
        dispatch({ type: CLOSE_COMMENT_DIALOG });
      }
    })
    .catch((error) => {
      console.log(error);
      Toast("error", error.message);
    });
};
export const updateFakeComment = (data, id) => (dispatch) => {
  axios
    .patch(`fakeComment/${id}`, data)
    .then((res) => {
      if (res.data.status) {
        dispatch({
          type: EDIT_FAKE_COMMENT,
          payload: { data: res.data.comment, id: id },
        });
        Toast("success", "Update Comment Successfully");
        dispatch({ type: CLOSE_COMMENT_DIALOG });
      }
    })
    .catch((error) => {
      console.log(error);
      Toast("error", error.message);
    });
};
export const deleteFakeComment = (id) => (dispatch) => {
  axios
    .delete(`fakeComment/${id}`)
    .then((res) => {
      if (res.data.status) {
        dispatch({ type: DELETE_FAKE_COMMENT, payload: id });
      }
    })
    .catch((error) => {
      console.log(error);
      Toast("error", error.message);
    });
};
