import {
  GET_ADVERTISEMENT,
  EDIT_ADVERTISEMENT,
  SHOW_ADVERTISEMENT,
} from "./types";

const initialState = {
  google: null,
};

const advertisementReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_ADVERTISEMENT:
      return {
        ...state,
        google: action.payload,
      };

    case EDIT_ADVERTISEMENT:
      return {
        ...state,
        google: action.payload,
      };

    case SHOW_ADVERTISEMENT:
      return {
        ...state,
        google: {
          ...state.google,
          show: action.payload.show,
        },
      };

    default:
      return state;
  }
};

export default advertisementReducer;
