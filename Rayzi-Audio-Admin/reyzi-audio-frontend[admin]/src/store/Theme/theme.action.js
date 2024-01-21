import axios from "axios";
import { Toast } from "../../util/Toast";
import {
  GET_THEME,
  CREATE_NEW_THEME,
  EDIT_THEME,
  CLOSE_THEME_DIALOG,
  DELETE_THEME,
} from "./theme.type";

export const getTheme = () => (dispatch) => {
  axios
    .get(`theme`)
    .then((res) => {
      if (res.data.status) {
        dispatch({ type: GET_THEME, payload: res.data.theme });
      } else {
        Toast("error", res.data.message);
      }
    })
    .catch((error) => Toast("error", error.message));
};
export const createNewTheme = (data) => (dispatch) => {
  axios
    .post(`theme`, data)
    .then((res) => {
      console.log(res.data);
      if (res.data.status) {
        dispatch({ type: CREATE_NEW_THEME, payload: res.data.theme });
        dispatch({ type: CLOSE_THEME_DIALOG });
        Toast("success", "Theme created successfully!");
      } else {
        Toast("error", res.data.message);
      }
    })
    .catch((error) => Toast("error", error.message));
};
export const editTheme = (data, id) => (dispatch) => {
  axios
    .patch(`theme/${id}`, data)
    .then((res) => {
      console.log(res.data);
      if (res.data.status) {
        Toast("success", "Theme updated successfully!");
        dispatch({ type: CLOSE_THEME_DIALOG });
        dispatch({
          type: EDIT_THEME,
          payload: { data: res.data.theme, id: id },
        });
      } else {
        Toast("error", res.data.message);
      }
    })
    .catch((error) => Toast("error", error.message));
};
export const deleteTheme = (id) => (dispatch) => {
  axios
    .delete(`theme/${id}`)
    .then((res) => {
      if (res.data.status) {
        dispatch({ type: DELETE_THEME, payload: id });
      } else {
        Toast("error", res.data.message);
      }
    })
    .catch((error) => console.log(error));
};
