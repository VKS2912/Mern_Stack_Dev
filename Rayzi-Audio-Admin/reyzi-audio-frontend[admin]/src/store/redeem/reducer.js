import {GET_REDEEM, ACCEPT_REDEEM} from "./types";

const initialState = {
  redeem: [],
};

const redeemReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_REDEEM:
      return {
        ...state,
        redeem: action.payload,
      };

    case ACCEPT_REDEEM:
      return {
        ...state,
        redeem: state.redeem.filter(
          (redeem) => redeem._id !== action.payload._id
        ),
      };

    default:
      return state;
  }
};

export default redeemReducer;
