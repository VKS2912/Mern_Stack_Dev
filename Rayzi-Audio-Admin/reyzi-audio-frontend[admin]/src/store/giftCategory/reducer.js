import {
  CLOSE_CATEGORY_DIALOG,
  CREATE_NEW_CATEGORY,
  DELETE_CATEGORY,
  EDIT_CATEGORY,
  GET_CATEGORY,
  OPEN_CATEGORY_DIALOG,
} from "./types";

const initialState = {
  giftCategory: [],
  dialog: false,
  dialogData: null,
};

const giftCategoryReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_CATEGORY:
      return {
        ...state,
        giftCategory: action.payload,
      };
    case CREATE_NEW_CATEGORY:
      const data = [...state.giftCategory];
      data.unshift(action.payload);
      return {
        ...state,
        giftCategory: data,
      };
    case EDIT_CATEGORY:
      return {
        ...state,
        giftCategory: state.giftCategory.map((giftCategory) => {
          if (giftCategory._id === action.payload.id)
            return action.payload.data;
          else return giftCategory;
        }),
      };
    case DELETE_CATEGORY:
      return {
        ...state,
        giftCategory: state.giftCategory.filter(
          (giftCategory) => giftCategory._id !== action.payload
        ),
      };
    case OPEN_CATEGORY_DIALOG:
      return {
        ...state,
        dialog: true,
        dialogData: action.payload || null,
      };
    case CLOSE_CATEGORY_DIALOG:
      return {
        ...state,
        dialog: false,
        dialogData: null,
      };

    default:
      return state;
  }
};

export default giftCategoryReducer;
