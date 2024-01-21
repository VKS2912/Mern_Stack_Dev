import { GET_REPORTED_USER } from "./types";

const initialState = {
  reportedUser: [],
};

const ReportedUserReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_REPORTED_USER:
      return {
        ...state,
        reportedUser: action.payload,
      };
    default:
      return state;
  }
};

export default ReportedUserReducer;
