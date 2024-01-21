import {
  GET_COMPLAIN,
  SOLVED_COMPLAIN,
  OPEN_COMPLAIN_DIALOG,
  CLOSE_COMPLAIN_DIALOG,
} from "./types";

const initialState = {
  complain: [],
  dialog: false,
  dialogData: null,
};

const complainReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_COMPLAIN:
      return {
        ...state,
        complain: action.payload,
      };

    case OPEN_COMPLAIN_DIALOG:
      return {
        ...state,
        dialog: true,
        dialogData: action.payload || null,
      };

    case CLOSE_COMPLAIN_DIALOG:
      return {
        ...state,
        dialog: false,
        dialogData: null,
      };

    case SOLVED_COMPLAIN:
      return {
        ...state,
        complain: state.complain.filter(
          (complain) => complain._id !== action.payload._id
        ),
      };

    default:
      return state;
  }
};

export default complainReducer;
