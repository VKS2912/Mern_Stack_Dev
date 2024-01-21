import { GET_FOLLOWERS_FOLLOWING_LIST } from "./types";

const initialState = {
  followersFollowing: [],
};

const followerReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_FOLLOWERS_FOLLOWING_LIST:
      return {
        ...state,
        followersFollowing: action.payload,
      };

    default:
      return state;
  }
};

export default followerReducer;
