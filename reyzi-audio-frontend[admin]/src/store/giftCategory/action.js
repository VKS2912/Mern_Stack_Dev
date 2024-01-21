import axios from "axios";
import { Toast } from "../../util/Toast";
import {
  CLOSE_CATEGORY_DIALOG,
  CREATE_NEW_CATEGORY,
  DELETE_CATEGORY,
  EDIT_CATEGORY,
  GET_CATEGORY,
} from "./types";

export const getCategory = () => (dispatch) => {
  axios
    .get(`giftCategory`)
    .then((res) => {
      if (res.data.status) {
        dispatch({ type: GET_CATEGORY, payload: res.data.category });
      } else {
        Toast("error", res.data.message);
      }
    })
    .catch((error) => Toast("error", error.message));
};
export const createNewCategory = (data) => (dispatch) => {
  axios
    .post(`giftCategory`, data)
    .then((res) => {
      if (res.data.status) {
        Toast("success", "Category created successfully!");
        dispatch({ type: CLOSE_CATEGORY_DIALOG });
        dispatch({ type: CREATE_NEW_CATEGORY, payload: res.data.category });
      } else {
        Toast("error", res.data.message);
      }
    })
    .catch((error) => Toast("error", error.message));
};
export const editCategory = (giftCategoryId, data) => (dispatch) => {
  axios
    .patch(`giftCategory/${giftCategoryId}`, data)
    .then((res) => {
      if (res.data.status) {
        Toast("success", "Category updated successfully!");
        dispatch({ type: CLOSE_CATEGORY_DIALOG });
        dispatch({
          type: EDIT_CATEGORY,
          payload: { data: res.data.category, id: giftCategoryId },
        });
      } else {
        Toast("error", res.data.message);
      }
    })
    .catch((error) => Toast("error", error.message));
};
export const deleteCategory = (giftCategoryId) => (dispatch) => {
  axios
    .delete(`giftCategory/${giftCategoryId}`)
    .then((res) => {
      if (res.data.status) {
        dispatch({ type: DELETE_CATEGORY, payload: giftCategoryId });
      } else {
        Toast("error", res.data.message);
      }
    })
    .catch((error) => console.log(error));
};
