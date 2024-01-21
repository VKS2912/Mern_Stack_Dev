import React, { useEffect, useState } from "react";

// antd
import { Popconfirm } from "antd";

//react-router
import { connect, useSelector } from "react-redux";

import $ from "jquery";
import { Link, useHistory } from "react-router-dom";

//action
import {
  getPost,
  getComment,
  getLike,
  deleteComment,
} from "../store/post/action";
import { getFollowersFollowing } from "../store/follower/action";
import { getVideo } from "../store/video/action";
import { editCoin } from "../store/user/action";

//serverPath
import { baseURL } from "../util/Config";

import { permissionError } from "../util/Alert";

// dayjs
import dayjs from "dayjs";

//image
import Male from "../assets/images/male.png";

//inline edit
import EdiText from "react-editext";

//toast
import { Toast } from "../util/Toast";

const UserDetail = (props) => {
  const history = useHistory();

  const user = JSON.parse(localStorage.getItem("user"));
  const post = useSelector((state) => state.post.post);
  const video = useSelector((state) => state.video.video);
  const followersFollowingList = useSelector(
    (state) => state.followersFollowing.followersFollowing
  );
  const comment = useSelector((state) => state.post.comment);
  const like = useSelector((state) => state.post.like);

  const hasPermission = useSelector((state) => state.admin.admin.flag);

  // eslint-disable-next-line
  const [showFeed, setShowFeed] = useState(true);
  const [followersFollowing, setFollowersFollowing] = useState(false);
  const [postVideo, setPostVideo] = useState([]);

  const [coin, setCoin] = useState(0);
  const [isCoin, setIsCoin] = useState(false);

  const [diamond, setDiamond] = useState(0);
  const [isDiamond, setIsDiamond] = useState(false);

  $(document).ready(() => {
    $("#manageVideoFeed").on("click", "a", function () {
      // remove className 'active' from all li who already has className 'active'
      $("#manageVideoFeed a.active").removeClass("active");
      // adding className 'active' to current click li
      $(this).addClass("active");
      if ($(this).attr("at") === "Videos") {
        setShowFeed(false);
        setFollowersFollowing(false);
      } else {
        if ($(this).attr("at") === "Feed") {
          setShowFeed(true);
          setFollowersFollowing(false);
        } else setFollowersFollowing(true);
      }
    });
  });
  // set default Image

  $(document).ready(function () {
    $("img").bind("error", function () {
      // Set the default image
      $(this).attr("src", `${baseURL}` + "storage/male.png");
    });
  });

  document.addEventListener(
    "play",
    function (e) {
      var videos = document.getElementsByTagName("video");
      for (var i = 0, len = videos.length; i < len; i++) {
        // eslint-disable-next-line
        if (videos[i] != e.target) {
          videos[i].pause();
        }
      }
    },
    true
  );

  useEffect(() => {
    $("#manageVideoFeed li a").first().addClass("active");
  }, []);

  useEffect(() => {
    props.getPost(user?._id); // eslint-disable-next-line
  }, [user?._id]);

  useEffect(() => {
    setPostVideo(post);
  }, [post]);
  useEffect(() => {
    setPostVideo(video);
  }, [video]);

  let now = dayjs();

  const handleLike = (id, index, type) => {
    $(`#commentWrap${index}`).slideUp();
    $(`#likeWrap${index}`).slideToggle("slow");
    props.getLike(id, type);
  };
  const handleComment = (id, index, type) => {
    $(`#likeWrap${index}`).slideUp();
    $(`#commentWrap${index}`).slideToggle("slow");
    props.getComment(id, type);
  };

  const handleFollowersFollowing = (type, id) => {
    props.getFollowersFollowing(type, id);
  };

  const handleVideo = (id) => {
    props.getVideo(id);
  };
  const handlePost = (id) => {
    props.getPost(id);
  };

  function handleDelete(commentId, index) {
    if (!hasPermission) return permissionError();
    const commentCount = $(`#comment${index}`).text();
    parseInt(commentCount) > 0 &&
      $(`#comment${index}`).text(parseInt(commentCount) - 1);
    props.deleteComment(commentId);
  }

  const handleUserInfo = (user) => {
    localStorage.setItem("user", JSON.stringify(user));
    history.push("/admin/user/detail");
  };

  const handleSave = (coin, id, type) => {
    if (!hasPermission) return permissionError();
    const validNumber = /^\d+$/.test(coin);
    if (!validNumber) {
      return Toast("error", "Invalid Value");
    }
    let data;
    if (type === "rCoin") {
      const newObj = {
        ...user,
        rCoin: coin,
      };

      localStorage.setItem("user", JSON.stringify(newObj));
      setIsCoin(true);
      setCoin(coin);
      data = {
        userId: id,
        rCoin: coin,
      };
    } else {
      const newObj = {
        ...user,
        diamond: coin,
      };
      localStorage.setItem("user", JSON.stringify(newObj));
      setIsDiamond(true);
      setDiamond(coin);
      data = {
        userId: id,
        diamond: coin,
      };
    }
    props.editCoin(data);
  };

  return (
    <>
      <div className="page-title">
        <div className="row">
          <div className="col-12 col-md-6 order-md-1 order-last"></div>
          <div className="col-12 col-md-6 order-md-2 order-first">
            <nav
              aria-label="breadcrumb"
              className="breadcrumb-header float-start float-lg-end"
            >
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <Link to="/admin/dashboard" className="text-danger">
                    Dashboard
                  </Link>
                </li>
                <li className="breadcrumb-item">
                  <Link to="/admin/user" className="text-danger">
                    User
                  </Link>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  Detail
                </li>
              </ol>
            </nav>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-xl-12">
          <div class="profile-cover"></div>
          <div class="profile-header ">
            <div class="profile-img">
              <img src={user.image ? user.image : Male} alt="" />
            </div>
            <div class="profile-name">
              <h3>{user?.name}</h3>
            </div>
            <div class="profile-header-menu">
              <ul class="list-unstyled" id="manageVideoFeed">
                <li>
                  <a
                    href={() => false}
                    className="pointer-cursor"
                    at="Feed"
                    onClick={() => handlePost(user?._id)}
                  >
                    Feed ({user?.post})
                  </a>
                </li>

                <li>
                  <a
                    href={() => false}
                    className="pointer-cursor"
                    at="Videos"
                    onClick={() => handleVideo(user?._id)}
                  >
                    Videos ({user?.video})
                  </a>
                </li>
                <li>
                  <a
                    href={() => false}
                    className="pointer-cursor"
                    onClick={() =>
                      handleFollowersFollowing("follower", user?._id)
                    }
                  >
                    Followers ({user?.followers})
                  </a>
                </li>
                <li>
                  <a
                    href={() => false}
                    className="pointer-cursor"
                    onClick={() =>
                      handleFollowersFollowing("following", user?._id)
                    }
                  >
                    Following ({user?.following})
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-md-12 col-lg-4">
          <div class="card">
            <div class="card-body">
              <h5 class="card-title">About</h5>
              <span className="text-danger">{user.bio ? "Bio : " : ""}</span>
              <span>{user?.bio}</span>
              {user.bio && <br />}
              {user.bio && <br />}
              <ul class="list-unstyled profile-about-list">
                <li>
                  <i class="fal fa-user m-r-xxs"></i>
                  <span>
                    Username &nbsp;
                    <span className="text-danger">{user?.username}</span>
                  </span>
                </li>
                <li>
                  <span className="d-flex" style={{ alignItems: "baseline" }}>
                    <i class="far fa-gem m-r-xxs"></i>
                    Diamond &nbsp;
                    <EdiText
                      type="text"
                      value={isDiamond ? diamond : user?.diamond}
                      onSave={(val) => handleSave(val, user?._id, "diamond")}
                      className="editClass"
                    />
                  </span>
                </li>
                <li>
                  <span className="d-flex" style={{ alignItems: "baseline" }}>
                    <i class="far fa-registered m-r-xxs "></i>
                    RCoin &nbsp;{" "}
                    <EdiText
                      type="text"
                      value={isCoin ? coin : user?.rCoin}
                      onSave={(val) => handleSave(val, user?._id, "rCoin")}
                      className="editClass"
                    />
                  </span>
                </li>
                <li>
                  <i class="fas fa-venus-mars m-r-xxs"></i>
                  <span>
                    Gender &nbsp;{" "}
                    <span className="text-danger">{user?.gender}</span>
                  </span>
                </li>
                <li>
                  <i class="fas fa-child m-r-xxs"></i>
                  <span>
                    Age &nbsp;<span className="text-danger">{user?.age}</span>
                  </span>
                </li>

                <li>
                  <i class="fas fa-sign-in-alt m-r-xxs"></i>
                  <span>
                    Login Type &nbsp;
                    <span className="text-danger">
                      {user?.loginType === 0
                        ? "Google"
                        : user?.loginType === 1
                        ? "Facebook"
                        : user?.loginType === 2
                        ? "Quick"
                        : "IOS"}
                    </span>
                  </span>
                </li>
                <li>
                  <i class="fas fa-crown m-r-xxs"></i>
                  <span>
                    isVIP &nbsp;
                    <span
                      className={`${
                        user?.isVIP ? "text-success" : "text-primary"
                      }`}
                    >
                      {user?.isVIP ? "Yes" : "No"}
                    </span>
                  </span>
                </li>
                <li>
                  <i class="fas fa-map-marker m-r-xxs"></i>
                  <span>
                    Ip &nbsp;<span className="text-danger">{user?.ip}</span>
                  </span>
                </li>
                <li>
                  <i class="fas fa-clock m-r-xxs"></i>
                  <span>
                    Last login date &nbsp;
                    <span className="text-danger">{user?.lastLogin}</span>
                  </span>
                </li>
                {/* <li class="profile-about-list-buttons">
                  <button class="btn btn-block btn-primary m-t-md icon_margin">Follow</button>
                  <button class="btn btn-block btn-secondary m-t-md icon_margin">Message</button>
                </li> */}
              </ul>
            </div>
          </div>
          <div class="card">
            <div class="card-body">
              <h5 class="card-title">Contact Info</h5>
              <ul class="list-unstyled profile-about-list">
                <li>
                  <i class="far fa-envelope m-r-xxs"></i>
                  <span>{user?.email}</span>
                </li>
                <li>
                  <i class="far fa-compass m-r-xxs"></i>
                  <span>
                    Lives in <span>{user?.country}</span>
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div class="col-md-12 col-lg-8">
          <div class="card card-bg">
            <div class="card-body ">
              {followersFollowing ? (
                <div
                  class="container followDiv"
                  style={{ maxHeight: 548, overflow: "auto" }}
                >
                  <div class="row post-comments d-flex flex-wrap justify-content-between">
                    {followersFollowingList?.length > 0 ? (
                      followersFollowingList.map((data, index) => {
                        return (
                          <>
                            <div
                              class="col-md-6"
                              style={{
                                paddingRight: "10px",
                                borderRight: `${
                                  followersFollowingList.length > 1 &&
                                  index % 2 === 0
                                    ? "1px solid #7d7d83"
                                    : "transparent"
                                }`,
                              }}
                            >
                              <div class="post-comm post-padding">
                                <img
                                  src={
                                    data?.toUserId.image
                                      ? data?.toUserId.image
                                      : data?.fromUserId.image
                                      ? data?.fromUserId.image
                                      : Male
                                  }
                                  class="comment-img commentImg"
                                  alt=""
                                />
                                <div
                                  class="comment-container pointer-cursor"
                                  onClick={() =>
                                    handleUserInfo(
                                      data?.toUserId
                                        ? data?.toUserId
                                        : data?.fromUserId
                                    )
                                  }
                                >
                                  <span class="comment-author">
                                    {data?.toUserId?.name
                                      ? data?.toUserId?.name
                                      : data?.fromUserId?.name}
                                    <small class="comment-date">
                                      {now.diff(data?.createdAt, "minute") <=
                                        60 &&
                                      now.diff(data?.createdAt, "minute") >= 0
                                        ? now.diff(data?.createdAt, "minute") +
                                          " minutes ago"
                                        : now.diff(data?.createdAt, "hour") >=
                                          24
                                        ? dayjs(data?.createdAt).format(
                                            "DD MMM, YYYY"
                                          )
                                        : now.diff(data?.createdAt, "hour") +
                                          " hour ago"}
                                    </small>
                                  </span>
                                  <span>
                                    {data?.toUserId?.username
                                      ? data?.toUserId?.username
                                      : data?.fromUserId?.username}
                                    {/* {data?.toUserId?.username
                                    ? data?.toUserId?.username?.length >= 22
                                      ? data?.toUserId?.username?.substr(
                                          0,
                                          22
                                        ) + "..."
                                      : data?.toUserId?.username
                                    : data?.fromUserId?.username?.length >= 22
                                    ? data?.fromUserId?.username?.substr(
                                        0,
                                        22
                                      ) + "..."
                                    : data?.fromUserId?.username} */}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </>
                        );
                      })
                    ) : (
                      <p className="text-center">Nothing to Show!!</p>
                    )}
                  </div>
                </div>
              ) : postVideo.length > 0 ? (
                postVideo
                  .slice(0)
                  .reverse()
                  .map((data, index) => {
                 
                    return (
                      <>
                        <div class="post">
                          <div class="post-header">
                            <img src={user.image ? user.image : Male} alt="" />
                            <div class="post-info">
                              <span class="post-author">{user?.name}</span>
                              <br />
                              <span class="post-date">
                                {now.diff(data?.date, "minute") <= 60 &&
                                now.diff(data?.date, "minute") >= 0
                                  ? now.diff(data?.date, "minute") +
                                    " minutes ago"
                                  : now.diff(data?.date, "hour") >= 24
                                  ? dayjs(data?.date).format("DD MMM, YYYY")
                                  : now.diff(data?.date, "hour") + " hour ago"}
                              </span>
                            </div>
                          </div>
                          {data.isDelete ? (
                            <p className="text-center">
                              This Post is delete by Admin
                            </p>
                          ) : (
                            <>
                              <div class="post-body">
                                <video
                                  src={data?.video}
                                  class="post-image m-auto py-3"
                                  controls
                                  style={{ maxHeight: 400, width: "40%" }}
                                />
                              </div>
                              <div id="myGroup">
                                <div class="post-actions">
                                  <ul class="list-unstyled">
                                    <li>
                                      <a
                                        href={() => false}
                                        class="like-btn"
                                        onClick={() =>
                                          handleLike(
                                            data?._id,
                                            index,
                                            data.post ? "post" : "video"
                                          )
                                        }
                                        id="likeToggle"
                                      >
                                        {data?.like} Likes
                                      </a>
                                    </li>
                                    <li>
                                      <a
                                        href={() => false}
                                        class="like-btn"
                                        role="button"
                                        onClick={() =>
                                          handleComment(
                                            data?._id,
                                            index,
                                            data.post ? "post" : "video"
                                          )
                                        }
                                        id="commentToggle"
                                      >
                                        <span id={`comment${index}`}>
                                          {data?.comment}
                                        </span>{" "}
                                        &nbsp; Comments
                                      </a>
                                    </li>
                                  </ul>
                                </div>
                                <div class="post-comments">
                                  <div
                                    class="collapse"
                                    id={`likeWrap${index}`}
                                    style={{
                                      maxHeight: 250,
                                      overflow: "auto",
                                      display: "none",
                                    }}
                                  >
                                    <div class="row">
                                      <div class="col-12">
                                        {like?.length > 0 ? (
                                          like.map((like) => {
                                            return (
                                              <>
                                                <div class="post-comm post-padding">
                                                  <img
                                                    src={
                                                      like.image
                                                        ? like.image
                                                        : Male
                                                    }
                                                    class="comment-img"
                                                    alt=""
                                                    onClick={() =>
                                                      handleUserInfo(like.user)
                                                    }
                                                  />
                                                  <div class="comment-container pointer-cursor">
                                                    <span class="comment-author">
                                                      <span
                                                        onClick={() =>
                                                          handleUserInfo(
                                                            like.user
                                                          )
                                                        }
                                                      >
                                                        {like.name}
                                                      </span>
                                                      <small class="comment-date">
                                                        {like.time}
                                                      </small>
                                                    </span>
                                                  </div>
                                                </div>
                                              </>
                                            );
                                          })
                                        ) : (
                                          <p className="text-center">
                                            No data found
                                          </p>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                  <div
                                    class="collapse"
                                    id={`commentWrap${index}`}
                                    style={{ maxHeight: 250, overflow: "auto" }}
                                  >
                                    <div class="row">
                                      <div class="col-12">
                                        {comment?.length > 0 ? (
                                          comment.map((comment) => {
                                            return (
                                              <>
                                                <div class="post-comm post-padding">
                                                  <img
                                                    src={
                                                      comment.image
                                                        ? comment.image
                                                        : Male
                                                    }
                                                    class="comment-img commentImg"
                                                    alt=""
                                                    onClick={() =>
                                                      handleUserInfo(
                                                        comment.user
                                                      )
                                                    }
                                                  />
                                                  <div class="comment-container">
                                                    <span class="comment-author pointer-cursor">
                                                      <span
                                                        onClick={() =>
                                                          handleUserInfo(
                                                            comment.user
                                                          )
                                                        }
                                                      >
                                                        {comment.name}
                                                      </span>
                                                      <small class="comment-date">
                                                        {comment.time}
                                                        <Popconfirm
                                                          title="Are you sure to delete this comment?"
                                                          onConfirm={() =>
                                                            handleDelete(
                                                              comment._id,
                                                              index
                                                            )
                                                          }
                                                          okText="Yes"
                                                          cancelText="No"
                                                          placement="top"
                                                        >
                                                          <i className="fas fa-trash-alt text-danger comment-delete pointer-cursor"></i>
                                                        </Popconfirm>
                                                      </small>
                                                    </span>
                                                    <span className="pointer-cursor">
                                                      {comment.comment}
                                                    </span>
                                                  </div>
                                                </div>
                                              </>
                                            );
                                          })
                                        ) : (
                                          <p className="text-center">
                                            No data found
                                          </p>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                      </>
                    );
                  })
              ) : (
                <p className="text-center">Nothing to show!!</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default connect(null, {
  getPost,
  getLike,
  getComment,
  getFollowersFollowing,
  getVideo,
  deleteComment,
  editCoin,
})(UserDetail);
