import axios from "axios";
import { Toast } from "../../util/Toast";

import { GET_FOLLOWERS_FOLLOWING_LIST } from "./types";

export const getFollowersFollowing = (type, id) => (dispatch) => {

  axios
    .get(`/followFollowing?type=${type}&userId=${id}`)
    .then((res) => {

      if (res.data.status) {
        dispatch({
          type: GET_FOLLOWERS_FOLLOWING_LIST,
          payload: res.data.follow,
        });
      } else {
        Toast("error", res.data.message);
      }
    })
    .catch((error) => Toast("error", error.message));
};
