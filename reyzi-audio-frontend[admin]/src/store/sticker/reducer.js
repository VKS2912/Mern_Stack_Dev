import {
  GET_STICKER,
  CREATE_NEW_STICKER,
  OPEN_STICKER_DIALOG,
  CLOSE_STICKER_DIALOG,
  EDIT_STICKER,
  DELETE_STICKER,
} from "./types";

const initialState = {
  sticker: [],
  dialog: false,
  dialogData: null,
};

const stickerReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_STICKER:
      return {
        ...state,
        sticker: action.payload,
      };
    case CREATE_NEW_STICKER:
      const data = [...state.sticker, ...action.payload];
      return {
        ...state,
        sticker: data,
      };
    case EDIT_STICKER:
      return {
        ...state,
        sticker: state.sticker.map((sticker) => {
          if (sticker._id === action.payload.id) return action.payload.data;
          else return sticker;
        }),
      };
    case DELETE_STICKER:
      return {
        ...state,
        sticker: state.sticker.filter(
          (sticker) => sticker._id !== action.payload
        ),
      };
    case OPEN_STICKER_DIALOG:
      return {
        ...state,
        dialog: true,
        dialogData: action.payload || null,
      };
    case CLOSE_STICKER_DIALOG:
      return {
        ...state,
        dialog: false,
        dialogData: null,
      };

    default:
      return state;
  }
};

export default stickerReducer;
