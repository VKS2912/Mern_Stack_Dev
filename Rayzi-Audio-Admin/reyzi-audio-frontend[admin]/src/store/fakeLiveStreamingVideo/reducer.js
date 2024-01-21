import {
  DELETE_LIVE_STEAMING_VIDEO,
  GET_FAKE_USER_LIST,
  GET_LIVE_STEAMING_VIDEO,
  INSERT_LIVE_STEAMING_VIDEO,
  UPDATE_LIVE_STEAMING_VIDEO,
} from "./type";

const initialState = {
  video: [],
  fakeUser: [],
};

const fakeLiveStreamingVideoReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_LIVE_STEAMING_VIDEO:
      return {
        ...state,
        video: action.payload,
      };
    case GET_FAKE_USER_LIST:
      return {
        ...state,
        fakeUser: action.payload,
      };

    case INSERT_LIVE_STEAMING_VIDEO:
      const data = [...state.video];
      data.unshift(action.payload);
      return {
        ...state,
        video: data,
      };
    case UPDATE_LIVE_STEAMING_VIDEO:
      return {
        ...state,
        video: state.video.map((video) => {
          if (video._id === action.payload.id) return action.payload.data;
          else return video;
        }),
      };

    case DELETE_LIVE_STEAMING_VIDEO:
      return {
        ...state,
        video: state.video.filter((video) => video._id !== action.payload),
      };

    default:
      return state;
  }
};

export default fakeLiveStreamingVideoReducer;
