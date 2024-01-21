import { start } from "@popperjs/core";
import {
  DELETE_COMMENT,
  DELETE_POST,
  EDIT_FAKE_POST,
  GET_COMMENT,
  GET_FAKE_POST,
  GET_LIKE,
  GET_POST,
  INSERT_POST,
} from "./types";

const initialState = {
  post: [],
  comment: [],
  like: [],
  hashtag: [],
  caption: [],
  totalPost: 0,
};

const postReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_POST:
      return {
        ...state,
        post: action.payload.post,
        totalPost: action.payload.total,
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

    case DELETE_POST:
      return {
        ...state,
        post: state.post.filter((post) => post._id !== action.payload),
      };

    case DELETE_COMMENT:
      return {
        ...state,
        comment: state.comment.filter(
          (comment) => comment._id !== action.payload
        ),
      };
    case GET_FAKE_POST:
      return {
        ...state,
        post: action.payload.post,
        totalPost: action.payload.total,
      };

    case INSERT_POST:
      const data = [...state.post];
      data.unshift(action.payload);

      return {
        ...state,
        post: data,
        comment: action.payload,
        like: action.payload,
        hashtag: action.payload,
        caption: action.payload,
      };

      case EDIT_FAKE_POST:
        return{
          ...state,
          post: state.post.map((post) => {
            if (post._id === action.payload.id) return action.payload.data;
            else return post;
          }),
        }

    default:
      return state;
  }
};

export default postReducer;
