import { OPEN_SPINNER_PROGRESS, CLOSE_SPINNER_PROGRESS } from "./types";

const initialState = {
  networkProgressDialog: false,
};

const spinnerReducer = (state = initialState, action) => {
  switch (action.type) {
    case OPEN_SPINNER_PROGRESS:
      return {
        ...state,
        networkProgressDialog: true,
      };
    case CLOSE_SPINNER_PROGRESS:
      return {
        ...state,
        networkProgressDialog: false,
      };
    default:
      return state;
  }
};

export default spinnerReducer;
