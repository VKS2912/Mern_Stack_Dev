import {
  GET_THEME,
  CREATE_NEW_THEME,
  OPEN_THEME_DIALOG,
  CLOSE_THEME_DIALOG,
  EDIT_THEME,
  DELETE_THEME,
} from "./theme.type";

const initialState = {
  theme: [],
  dialog: false,
  dialogData: null,
};

 const themeReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_THEME:
      return {
        ...state,
        theme: action.payload,
      };
    case CREATE_NEW_THEME:
      const data = [...state.theme, ...action.payload];
      return {
        ...state,
        theme: data,
      };
    case EDIT_THEME:
      return {
        ...state,
        theme: state.theme.map((theme) => {
          if (theme._id === action.payload.id) return action.payload.data;
          else return theme;
        }),
      };
    case DELETE_THEME:
      return {
        ...state,
        theme: state.theme.filter((theme) => theme._id !== action.payload),
      };
    case OPEN_THEME_DIALOG:
      return {
        ...state,
        dialog: true,
        dialogData: action.payload || null,
      };
    case CLOSE_THEME_DIALOG:
      return {
        ...state,
        dialog: false,
        dialogData: null,
      };

    default:
      return state;
  }
};
export default themeReducer;

