import {
  GET_FAKE_COMMENT,
  INSERT_FAKE_COMMENT,
  EDIT_FAKE_COMMENT,
  DELETE_FAKE_COMMENT,
  OPEN_COMMENT_DIALOG,
  CLOSE_COMMENT_DIALOG,
} from "./type";

const initialState = {
  comment: [],
  dialog: false,
  dialogData: null,
};

const fakeCommentReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_FAKE_COMMENT:
      return {
        ...state,
        comment: action.payload,
      };
    case INSERT_FAKE_COMMENT:
      const data = [...state.comment];
      data.unshift(action.payload);
      return {
        ...state,
        comment: data,
      };
    case EDIT_FAKE_COMMENT:
      return {
        ...state,
        comment: state.comment.map((comment) => {
          if (comment._id === action.payload.id) return action.payload.data;
          else return comment;
        }),
      };
    case DELETE_FAKE_COMMENT:
      return {
        ...state,
        comment: state.comment.filter(
          (comment) => comment._id !== action.payload
        ),
      };

    case OPEN_COMMENT_DIALOG:
      return {
        ...state,
        dialog: true,
        dialogData: action.payload || null,
      };
    case CLOSE_COMMENT_DIALOG:
      return {
        ...state,
        dialog: false,
        dialogData: null,
      };

    default:
      return state;
  }
};

export default fakeCommentReducer;
