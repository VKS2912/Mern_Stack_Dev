import axios from "axios";
import { baseURL, key } from "../../util/Config";
import { Toast } from "../../util/Toast";
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

export const getPost = (id, start, limit, sDate, eDate) => (dispatch) => {
  const url =
    id !== null
      ? `getPost?userId=${id}`
      : `getPost?start=${start}&limit=${limit}&startDate=${sDate}&endDate=${eDate}`;
  axios
    .get(url)
    .then((res) => {
      if (res.data.status) {
        dispatch({
          type: GET_POST,
          payload: { post: res.data.post, total: res.data.total },
        });
      } else {
        Toast("error", res.data.message);
      }
    })
    .catch((error) => Toast("error", error.message));
};

export const getComment = (postId, type) => (dispatch) => {
  const type_ = type === "video" ? "videoId" : "postId";
  const url = `${baseURL}comment?${type_}=${postId}&type=ADMIN`;
  const requestOptions = {
    method: "GET",
    headers: {
      key: key,
    },
  };

  fetch(url, requestOptions)
    .then((response) => response.json())
    .then((res) => {
      if (res.status) {
        dispatch({ type: GET_COMMENT, payload: res.data });
      } else {
        Toast("error", res.message);
      }
    })
    .catch((error) => Toast("error", error.message));

  // axios
  //   .get(`comment?postId=${postId}`)
  //   .then((res) => {
  //     if (res.data.status) {
  //       dispatch({ type: GET_COMMENT, payload: res.data.comments });
  //     } else {
  //       Toast("error", res.data.message);
  //     }
  //   })
  //   .catch((error) => Toast("error", error.message));
};

export const getLike = (postId, type) => (dispatch) => {
  const type_ = type === "video" ? "videoId" : "postId";
  const url = `${baseURL}likes?${type_}=${postId}&type=ADMIN`;
  const requestOptions = {
    method: "GET",
    headers: {
      key: key,
    },
  };

  fetch(url, requestOptions)
    .then((response) => response.json())
    .then((res) => {
      if (res.status) {
        dispatch({ type: GET_LIKE, payload: res.data });
      } else {
        Toast("error", res.message);
      }
    })
    .catch((error) => Toast("error", error.message));
};

export const deletePost = (postId) => (dispatch) => {
  axios
    .delete(`deletePost/?postId=${postId}`)
    .then((res) => {
      if (res.data.status) {
        dispatch({ type: DELETE_POST, payload: postId });
      } else {
        Toast("error", res.data.message);
      }
    })
    .catch((error) => Toast("error", error.message));
};

export const allowDisallowComment = (postId) => (dispatch) => {
  axios
    .patch(`/post/commentSwitch/${postId}`)
    .then((res) => {
      if (res.data.status) {
        localStorage.setItem("PostDetail", JSON.stringify(res.data.post));
      } else {
        Toast("error", res.data.message);
      }
    })
    .catch((error) => Toast("error", error.message));
};

// get fake post

export const getFakePost =
  (id, start, limit, sDate, eDate, type) => (dispatch) => {
    axios
      .get(
        `getPost?start=${start}&limit=${limit}&startDate=${sDate}&endDate=${eDate}&type=${type}`
      )
      .then((res) => {
        if (res.data.status) {
          dispatch({
            type: GET_FAKE_POST,
            payload: { post: res.data.post, total: res.data.total },
          });
        } else {
          Toast("error", res.data.message);
        }
      })
      .catch((error) => Toast("error", error.message));
  };    

//create fake post
export const insertPost = (data) => (dispatch) => {
  axios
    .post(`/uploadFakePost`, data)
    .then((res) => {
      if (res.data.status) {
        dispatch({ type: INSERT_POST, payload: res.data.post });
        Toast("success", "Post Insert Successful");
        // setTimeout(() => {
        window.location.href = "/admin/post/fake";
        // }, 3000);
      } else {
        Toast("error", res.data.message);
      }
    })
    .catch((error) => Toast("error", error.message));
};

export const editFakePost = (postId, data) => (dispatch) => {
  axios
    .patch(`updateFakePost?postId=${postId}`, data)
    .then((res) => {
      if (res.data.status) {
        dispatch({
          type: EDIT_FAKE_POST,
          payload: { data: res.data.posts, postId: postId },
        });
        Toast("success", "Post Update Successful");
        setTimeout(() => {
          window.location.href = "/admin/post/fake";
        }, 3000);
      } else {
        Toast("error", res.data.message);
      }
    })
    .catch((error) => Toast("error", error.message));
};

export const deleteComment = (commentId) => (dispatch) => {
  const requestOptions = {
    method: "DELETE",
    headers: {
      key: key,
    },
  };

  fetch(`${baseURL}comment?commentId=${commentId}`, requestOptions)
    .then((response) => response.json())
    .then((res) => {
      if (res.status) {
        dispatch({ type: DELETE_COMMENT, payload: commentId });
      } else {
        Toast("error", res.message);
      }
    })
    .catch((error) => Toast("error", error.message));
};
