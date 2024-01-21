import {
  CLOSE_BANNER_DIALOG,
  CREATE_NEW_BANNER,
  DELETE_BANNER,
  EDIT_BANNER,
  GET_BANNER,
  OPEN_BANNER_DIALOG,
  VIP_SWITCH,
} from "./types";

const initialState = {
  banner: [],
  dialog: false,
  dialogData: null,
};

const bannerReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_BANNER:
      return {
        ...state,
        banner: action.payload,
      };
    case CREATE_NEW_BANNER:
      const data = [...state.banner];
      data.unshift(action.payload);
      return {
        ...state,
        banner: data,
      };
    case EDIT_BANNER:
      return {
        ...state,
        banner: state.banner.map((banner) => {
          if (banner._id === action.payload.id) return action.payload.data;
          else return banner;
        }),
      };
    case DELETE_BANNER:
      return {
        ...state,
        banner: state.banner.filter((banner) => banner._id !== action.payload),
      };
    case VIP_SWITCH:
      return {
        ...state,
        banner: state.banner.map((banner) => {
          if (banner._id === action.payload._id)
            return {
              ...banner,
              isVIP: action.payload.isVIP,
            };
          else return banner;
        }),
      };
    case OPEN_BANNER_DIALOG:
      return {
        ...state,
        dialog: true,
        dialogData: action.payload || null,
      };
    case CLOSE_BANNER_DIALOG:
      return {
        ...state,
        dialog: false,
        dialogData: null,
      };

    default:
      return state;
  }
};

export default bannerReducer;
