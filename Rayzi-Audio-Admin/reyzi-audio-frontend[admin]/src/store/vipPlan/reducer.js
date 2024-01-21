import {
  GET_VIP_PLAN,
  CREATE_NEW_VIP_PLAN,
  EDIT_VIP_PLAN,
  OPEN_VIP_PLAN_DIALOG,
  CLOSE_VIP_PLAN_DIALOG,
  RENEWAL_SWITCH,
  DELETE_VIP_PLAN,
  GET_VIP_PLAN_HISTORY,
} from "./types";

const initialState = {
  vipPlan: [],
  dialog: false,
  dialogData: null,
  history: [],
  totalPlan: 0,
};

const vipPlanReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_VIP_PLAN:
      return {
        ...state,
        vipPlan: action.payload,
      };
    case CREATE_NEW_VIP_PLAN:
      const data = [...state.vipPlan];
      data.unshift(action.payload);
      return {
        ...state,
        vipPlan: data,
      };
    case EDIT_VIP_PLAN:
      return {
        ...state,
        vipPlan: state.vipPlan.map((vipPlan) => {
          if (vipPlan._id === action.payload.id) return action.payload.data;
          else return vipPlan;
        }),
      };
    case DELETE_VIP_PLAN:
      return {
        ...state,
        vipPlan: state.vipPlan.filter(
          (vipPlan) => vipPlan._id !== action.payload
        ),
      };
    case RENEWAL_SWITCH:
      return {
        ...state,
        vipPlan: state.vipPlan.map((vipPlan) => {
          if (vipPlan._id === action.payload._id)
            return {
              ...vipPlan,
              isAutoRenew: action.payload.isAutoRenew,
            };
          else return vipPlan;
        }),
      };
    case OPEN_VIP_PLAN_DIALOG:
      return {
        ...state,
        dialog: true,
        dialogData: action.payload || null,
      };
    case CLOSE_VIP_PLAN_DIALOG:
      return {
        ...state,
        dialog: false,
        dialogData: null,
      };

    case GET_VIP_PLAN_HISTORY:
      return {
        ...state,
        history: action.payload.history,
        totalPlan: action.payload.total,
      };

    default:
      return state;
  }
};

export default vipPlanReducer;
