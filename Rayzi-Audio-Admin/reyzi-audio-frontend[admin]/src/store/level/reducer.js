import {
  GET_LEVEL,
  CREATE_NEW_LEVEL,
  OPEN_LEVEL_DIALOG,
  CLOSE_LEVEL_DIALOG,
  EDIT_LEVEL,
  DELETE_LEVEL,
} from "./types";

const initialState = {
  level: [],
  dialog: false,
  dialogData: null,
};

const levelReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_LEVEL:
      return {
        ...state,
        level: action.payload,
      };
    case CREATE_NEW_LEVEL:
      const data = [...state.level];
      data.unshift(action.payload);
      return {
        ...state,
        level: data,
      };
    case EDIT_LEVEL:
      return {
        ...state,
        level: state.level.map((level) => {
          if (level._id === action.payload.id) return action.payload.data;
          else return level;
        }),
      };
    case DELETE_LEVEL:
      return {
        ...state,
        level: state.level.filter((level) => level._id !== action.payload),
      };
    case OPEN_LEVEL_DIALOG:
      return {
        ...state,
        dialog: true,
        dialogData: action.payload || null,
      };
    case CLOSE_LEVEL_DIALOG:
      return {
        ...state,
        dialog: false,
        dialogData: null,
      };

    default:
      return state;
  }
};

export default levelReducer;
