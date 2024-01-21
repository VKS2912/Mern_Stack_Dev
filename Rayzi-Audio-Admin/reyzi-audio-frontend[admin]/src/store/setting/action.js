import axios from "axios";
import { Toast } from "../../util/Toast";
import { GET_SETTING, UPDATE_SETTING } from "./types";

export const getSetting = () => (dispatch) => {
  axios
    .get("setting")
    .then((res) => {
      if (res.data.status) {
        dispatch({ type: GET_SETTING, payload: res.data.setting });
      } else {
        Toast("error", res.data.message);
      }
    })
    .catch((error) => Toast("error", error.message));
};

export const updateSetting = (settingId, data) => (dispatch) => {
  axios
    .patch(`setting/${settingId}`, data)
    .then((res) => {
      if (res.data.status) {
        dispatch({ type: GET_SETTING, payload: res.data.setting });
        Toast("success", "Updated Successfully!");
      } else {
        Toast("error", res.data.message);
      }
    })
    .catch((error) => Toast("error", error.message));
};

export const handleSwitch = (settingId, type) => (dispatch) => {
  axios
    .put(`setting/${settingId}?type=${type}`)
    .then((res) => {
      if (res.data.status) {
        dispatch({ type: UPDATE_SETTING, payload: res.data.setting });
        Toast("success", "Updated Successfully!");
      } else {
        Toast("error", res.data.message);
      }
    })
    .catch((error) => Toast("error", error.message));
};
