import axios from "axios";
import { Toast } from "../../util/Toast";
import {
  BLOCK_UNBLOCK_SWITCH,
  GET_USER,
  GET_HISTORY,
  EDIT_COIN,
} from "./types";
import { baseURL, key } from "../../util/Config";

export const getUser =
  (start, limit, searchValue, sDate, eDate) => (dispatch) => {
    const requestOptions = {
      method: "GET",
      headers: { key: key },
    };
    fetch(
      `${baseURL}getUsers?start=${start}&limit=${limit}&search=${searchValue}&startDate=${sDate}&endDate=${eDate}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((res) => {
        if (res.status) {
          let male, female;
          if (res.maleFemale) {
            // eslint-disable-next-line
            res.maleFemale.map((data) => {
              if (data._id === "Female") return (female = data.gender);
              if (data._id === "Male") return (male = data.gender);
            });
          }
          dispatch({
            type: GET_USER,
            payload: {
              user: res.user,
              activeUser: res.activeUser,
              total: res.total,
              male: male,
              female: female,
            },
          });
        } else {
          Toast("error", res.message);
        }
      })
      .catch((error) => Toast("error", error.message));
  };

export const handleBlockUnblockSwitch = (userId) => (dispatch) => {
  axios
    .patch(`blockUnblock/${userId}`)
    .then((res) => {
      if (res.data.status) {
        dispatch({ type: BLOCK_UNBLOCK_SWITCH, payload: res.data.user });
      } else {
        Toast("error", res.data.message);
      }
    })
    .catch((error) => Toast("error", error.message));
};

export const userHistory = (data) => (dispatch) => {
  axios
    .post(`history`, data)
    .then((res) => {
      if (res.data.status) {
        dispatch({ type: GET_HISTORY, payload: res.data });
      } else {
        Toast("error", res.data.message);
      }
    })
    .catch((error) => Toast("error", error.message));
};

export const editCoin = (data) => (dispatch) => {
  axios
    .post(`/user/addLessCoin`, data)
    .then((res) => {
      if (res.data.status) {
        dispatch({
          type: EDIT_COIN,
          payload: { data: res.data.user, id: data.userId },
        });
        Toast("success", "Update Successful!!");
      } else {
        Toast("error", res.data.message);
      }
    })
    .catch((error) => Toast("error", error.message));
};
