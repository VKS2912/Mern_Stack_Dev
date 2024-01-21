import axios from "axios";
import { Toast } from "../../util/Toast";
import {
  CLOSE_VIP_PLAN_DIALOG,
  CREATE_NEW_VIP_PLAN,
  DELETE_VIP_PLAN,
  EDIT_VIP_PLAN,
  GET_VIP_PLAN,
  GET_VIP_PLAN_HISTORY,
  RENEWAL_SWITCH,
} from "./types";

export const getVIPPlan = () => (dispatch) => {
  axios
    .get(`vipPlan`)
    .then((res) => {
      if (res.data.status) {
        dispatch({ type: GET_VIP_PLAN, payload: res.data.vipPlan });
      } else {
        Toast("error", res.data.message);
      }
    })
    .catch((error) => Toast("error", error.message));
};

export const createNewVIPPlan = (data) => (dispatch) => {
  axios
    .post(`vipPlan`, data)
    .then((res) => {
      if (res.data.status) {
        Toast("success", "Plan created successfully!");
        dispatch({ type: CLOSE_VIP_PLAN_DIALOG });
        dispatch({ type: CREATE_NEW_VIP_PLAN, payload: res.data.vipPlan });
      } else {
        Toast("error", res.data.message);
      }
    })
    .catch((error) => Toast("error", error.message));
};
export const editVIPPlan = (vipPlanId, data) => (dispatch) => {
  axios
    .patch(`vipPlan/${vipPlanId}`, data)
    .then((res) => {
      if (res.data.status) {
        Toast("success", "Plan updated successfully!");
        dispatch({ type: CLOSE_VIP_PLAN_DIALOG });
        dispatch({
          type: EDIT_VIP_PLAN,
          payload: { data: res.data.vipPlan, id: vipPlanId },
        });
      } else {
        Toast("error", res.data.message);
      }
    })
    .catch((error) => Toast("error", error.message));
};
export const deleteVIPPlan = (vipPlanId) => (dispatch) => {
  axios
    .delete(`vipPlan/${vipPlanId}`)
    .then((res) => {
      if (res.data.status) {
        dispatch({ type: DELETE_VIP_PLAN, payload: vipPlanId });
      } else {
        Toast("error", res.data.message);
      }
    })
    .catch((error) => console.log(error));
};
export const handleRenewalSwitch = (vipPlanId) => (dispatch) => {
  axios
    .put(`vipPlan/${vipPlanId}`)
    .then((res) => {
      if (res.data.status) {
        dispatch({ type: RENEWAL_SWITCH, payload: res.data.vipPlan });
      } else {
        Toast("error", res.data.message);
      }
    })
    .catch((error) => Toast("error", error.message));
};

export const vipPlanHistory =
  (id, start, limit, sDate, eDate) => (dispatch) => {
    const url =
      id !== null
        ? `vipPlan/history?userId=${id}&start=${start}&limit=${limit}&startDate=${sDate}&endDate=${eDate}`
        : `vipPlan/history?start=${start}&limit=${limit}&startDate=${sDate}&endDate=${eDate}`;
    axios
      .get(url)
      .then((res) => {
        if (res.data.status) {
          dispatch({
            type: GET_VIP_PLAN_HISTORY,
            payload: { history: res.data.history, total: res.data.total },
          });
        } else {
          Toast("error", res.data.message);
        }
      })
      .catch((error) => console.log(error));
  };
