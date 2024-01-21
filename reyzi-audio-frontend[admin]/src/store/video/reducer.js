import {
  DELETE_COMMENT,
  DELETE_VIDEO,
  EDIT_FAKE_VIDEO,
  GET_COMMENT,
  GET_FAKE_VIDEO,
  GET_LIKE,
  GET_VIDEO,
  INSERT_FAKE_VIDEO,
} from "./types";

const initialState = {
  video: [],
  comment: [],
  like: [],
  totalVideo: 0,
};

const videoReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_VIDEO:
      return {
        ...state,
        video: action.payload.video,
        totalVideo: action.payload.total,
      };
    case GET_COMMENT:
      return {
        ...state,
        comment: action.payload,
      };
    case GET_LIKE:
      return {
        ...state,
        like: action.payload,
      };

    case DELETE_VIDEO:

      return {
        ...state,
        video: state.video.filter((video) => video._id !== action.payload),
      };

    case DELETE_COMMENT:
      return {
        ...state,
        comment: state.comment.filter(
          (comment) => comment._id !== action.payload
        ),
      };
      case GET_FAKE_VIDEO:
        return{
          ...state,
          video: action.payload.video,
          totalVideo: action.payload.total,
        }
      case INSERT_FAKE_VIDEO:
        const data = [...state.video];
        data.unshift(action.payload.video)
        return{
          ...state,
          video : data,

        }
        
        case EDIT_FAKE_VIDEO:
          return{
            ...state,
            video: state.video.map((video) => {
              if (video._id === action.payload.id) return action.payload.data;
              else return video;
            }),
          }

    default:
      return state;
  }
};

export default videoReducer;
