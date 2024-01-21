import { GET_ANALYTIC, GET_DASHBOARD } from "./types";

const initialState = {
  dashboard: [],
  analytic: [],
};

const dashboardReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_DASHBOARD:
      return {
        ...state,
        dashboard: action.payload,
      };

    case GET_ANALYTIC:
      return {
        ...state,
        analytic: action.payload,
      };

    default:
      return state;
  }
};

export default dashboardReducer;
