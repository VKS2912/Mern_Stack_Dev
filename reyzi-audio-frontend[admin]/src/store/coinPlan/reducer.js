import {
  GET_COIN_PLAN,
  CREATE_NEW_COIN_PLAN,
  EDIT_COIN_PLAN,
  DELETE_COIN_PLAN,
  OPEN_COIN_PLAN_DIALOG,
  CLOSE_COIN_PLAN_DIALOG,
  GET_COIN_PLAN_HISTORY,
} from "./types";

const initialState = {
  coinPlan: [],
  dialog: false,
  dialogData: null,
  history: [],
  totalPlan: 0,
};

const coinPlanReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_COIN_PLAN:
      return {
        ...state,
        coinPlan: action.payload,
      };
    case CREATE_NEW_COIN_PLAN:
      const data = [...state.coinPlan];
      data.unshift(action.payload);
      return {
        ...state,
        coinPlan: data,
      };
    case EDIT_COIN_PLAN:
      return {
        ...state,
        coinPlan: state.coinPlan.map((coinPlan) => {
          if (coinPlan._id === action.payload.id) return action.payload.data;
          else return coinPlan;
        }),
      };
    case DELETE_COIN_PLAN:
      return {
        ...state,
        coinPlan: state.coinPlan.filter(
          (coinPlan) => coinPlan._id !== action.payload
        ),
      };
    case OPEN_COIN_PLAN_DIALOG:
      return {
        ...state,
        dialog: true,
        dialogData: action.payload || null,
      };
    case CLOSE_COIN_PLAN_DIALOG:
      return {
        ...state,
        dialog: false,
        dialogData: null,
      };

    case GET_COIN_PLAN_HISTORY:
      return {
        ...state,
        history: action.payload.history,
        totalPlan: action.payload.total,
      };

    default:
      return state;
  }
};

export default coinPlanReducer;
