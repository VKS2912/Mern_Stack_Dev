/* eslint-disable no-mixed-operators */
import React, { useEffect, useState } from "react";

// routing
import { Link, useHistory } from "react-router-dom";

// react dropzone
import ReactDropzone from "react-dropzone";

// redux
import { connect, useSelector } from "react-redux";

import { permissionError } from "../../util/Alert";

//action
import {
  getFakeUserList,
  getLiveStreamingVideo,
  updateFakeLiveStreamingVideo,
  createFakeLiveStreamingVideo,
} from "../../store/fakeLiveStreamingVideo/action";
import axios from "axios";

const FakeLiveStreamingPage = (props) => {
  const history = useHistory();

  useEffect(() => {
    props.getFakeUserList();
    props.getLiveStreamingVideo();
  }, []);

  const { user: userData, video } = useSelector(
    (state) => state.fakeLiveStreamingVideo
  );

  const detail = JSON.parse(localStorage.getItem("liveStreamingVideo"));

  const hasPermission = useSelector((state) => state.admin.admin.flag);

  const [type, setType] = useState("1");
  const [user, setUser] = useState("");
  const [link, setLink] = useState("");
  const [videos, setVideos] = useState([]);
  const [mongoId, setMongoId] = useState("");

  const [errors, setError] = useState({
    video: "",
    type: "",
    user: "",
  });

  useEffect(() => {
    if (detail) {
      const links = detail.video.join(",");
      setMongoId(detail?._id);
      setVideos(detail?.video);
      setType(detail?.type.toString());
      setUser(detail?.user?._id);
      setLink(links);
    }
  }, []);

  //for not create double livestream for same user
  const array2 = video.map((value) => value?.user._id);
  const user_ = userData.filter((value) => {
    return array2.indexOf(value?._id) === -1;
  });
  var users;
  if (mongoId) {
    users = userData;
  } else {
    users = user_;
  }

  const onPreviewDrop = (files) => {
    setError({ ...errors, video: "" });
    files.map((file) =>
      Object.assign(file, { preview: URL.createObjectURL(file) })
    );
    setVideos(videos.concat(files));
  };

  const removeVideo = (file) => {
    if (!mongoId) {
      if (file.preview) {
        const video = videos.filter((ele) => {
          return ele.preview !== file.preview;
        });
        setVideos(video);
      }
    } else {
      const data = {
        video: file,
      };
      axios
        .put(`fakeLiveStreamingVideo/remove/${mongoId}`, data)
        .then((res) => {
        })
        .catch((error) => {
          console.log(error);
        });
      if (file) {
        const video = videos.filter((ele) => {
          return ele !== file;
        });
        setVideos(video);
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!type) {
      if (videos.length === 0 && !link) {
        const errors = {};

        if (!type) errors.type = "type is Required!";

        if (videos.length === 0 && !link)
          errors.video = "Please select an video!";

        if (user === "Select user" || !user) {
          errors.user = "Please select a user!";
        }
        return setError({ ...errors });
      }
    }

    const formData = new FormData();

    formData.append("userId", user);
    formData.append("type", parseInt(type));
    if (type === "1") {
      for (let i = 0; i < videos.length; i++) {
        if (typeof videos[i] !== "string") {
          formData.append("video", videos[i]);
        }
      }
    } else {
      formData.append("video", link);
    }

    if (!hasPermission) return permissionError();

    if (!mongoId) {
      props.createFakeLiveStreamingVideo(formData);
    } else {
      props.updateFakeLiveStreamingVideo(formData, mongoId);
    }

    setTimeout(() => {
      history.push("/admin/fakeLiveStreaming");
    }, 3000);
  };

  return (
    <>
      <div className="page-title">
        <div className="row">
          <div className="col-12 col-md-6 order-md-1 order-last">
            <h3 className="mb-3 c">LIve Streaming Dialog</h3>
          </div>
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
                  <Link to="/admin/fakeLiveStreaming" className="text-danger">
                    Live Streaming
                  </Link>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  Dialog
                </li>
              </ol>
            </nav>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col">
          <div class="card">
            <div class="card-body card-overflow">
              <div class="d-sm-flex align-items-center justify-content-between mb-4"></div>

              <form>
                <div className="row">
                  <div className="col-md-6 d-flex justify-content-start">
                    <label className="mb-2 text-gray">Video Type : </label>
                    <div class="form-check">
                      <input
                        class="form-check-input mx-2"
                        type="radio"
                        name="videoType"
                        id="image"
                        value="1"
                        onClick={(e) => {
                          setType(e.target.value);
                        }}
                        checked={type === "1" ? true : false}
                      />
                      <label class="form-check-label" for="image">
                        Video
                      </label>
                    </div>
                    <div class="form-check">
                      <input
                        class="form-check-input mx-2"
                        type="radio"
                        name="videoType"
                        id="link"
                        value="0"
                        checked={type === "0" ? true : false}
                        onClick={(e) => {
                          setType(e.target.value);
                        }}
                      />
                      <label class="form-check-label" for="link">
                        Link
                      </label>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label className="text-gray mb-2">user</label>
                      <>
                        <select
                          class="form-select form-control"
                          aria-label="Default select example"
                          value={user}
                          onChange={(e) => {
                            setUser(e.target.value);
                            if (e.target.value === "Select user") {
                              return setError({
                                ...errors,
                                user: "Please select a user!",
                              });
                            } else {
                              return setError({
                                ...errors,
                                user: "",
                              });
                            }
                          }}
                        >
                          <option value="Select user" selected>
                            Select user
                          </option>

                          {userData?.map((user) => {
                            return (
                              <option value={user?._id}>{user?.name}</option>
                            );
                          })}
                        </select>
                        {errors.user && (
                          <div className="ml-2 mt-1">
                            {errors.user && (
                              <div className="pl-1 text__left">
                                <span className="text-red">{errors.user}</span>
                              </div>
                            )}
                          </div>
                        )}
                      </>
                    </div>
                  </div>
                </div>

                <div className={type === "1" ? "row mt-4" : "d-none"}>
                  <div className="col-lg-2">
                    <label className="form-control-label" for="input-username">
                      Select (Multiple) video
                    </label>

                    <>
                      <ReactDropzone
                        onDrop={(acceptedFiles) => onPreviewDrop(acceptedFiles)}
                        accept="video/*"
                      >
                        {({ getRootProps, getInputProps }) => (
                          <section>
                            <div {...getRootProps()}>
                              <input {...getInputProps()} />
                              <div
                                style={{
                                  height: 130,
                                  width: 130,
                                  border: "2px dashed gray",
                                  textAlign: "center",
                                  marginTop: "10px",
                                }}
                              >
                                <i
                                  className="fas fa-plus"
                                  style={{ paddingTop: 30, fontSize: 70 }}
                                ></i>
                              </div>
                            </div>
                          </section>
                        )}
                      </ReactDropzone>

                      {errors.video && (
                        <div className="ml-2 mt-1">
                          {errors.video && (
                            <div className="pl-1 text__left">
                              <span className="text-red">{errors.video}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </>
                  </div>
                  <div className="col-lg-10 mt-4">
                    {type === "1" && videos?.length > 0 && (
                      <>
                        {videos.map((file, index) => {

                          return (
                            <>
                              <video
                                height="60px"
                                width="60px"
                                alt="app"
                                controls
                                src={
                                  mongoId && !file?.preview
                                    ? file
                                    : file.preview
                                }
                                style={{
                                  boxShadow:
                                    "0 5px 15px 0 rgb(105 103 103 / 00%)",
                                  border: "2px solid #fff",
                                  borderRadius: 10,
                                  marginTop: 10,
                                  float: "left",
                                  objectFit: "contain",
                                  marginRight: 15,
                                }}
                              />
                              <div
                                class="img-container"
                                style={{
                                  display: "inline",
                                  position: "relative",
                                  float: "left",
                                }}
                              >
                                <i
                                  class="fas fa-times-circle text-danger"
                                  style={{
                                    position: "absolute",
                                    right: "10px",
                                    top: "4px",
                                    cursor: "pointer",
                                  }}
                                  onClick={() => removeVideo(file)}
                                ></i>
                              </div>
                            </>
                          );
                        })}
                      </>
                    )}
                  </div>
                </div>

                <div className={type === "0" ? "row mt-4" : "d-none"}>
                  <textarea
                    type="text"
                    rows={3}
                    cols={3}
                    className="form-control"
                    required=""
                    placeholder="Enter video"
                    value={link}
                    onChange={(e) => {
                      setLink(e.target.value);
                      if (!e.target.value) {
                        return setError({
                          ...errors,
                          video: "video is Required!",
                        });
                      } else {
                        return setError({
                          ...errors,
                          video: "",
                        });
                      }
                    }}
                  />

                  {!mongoId && (
                    <>
                      <span className="text-danger">Note : </span>
                      <span className="">
                        You can add multiple video separate by comma (,)
                      </span>
                    </>
                  )}
                  {errors.video && (
                    <div className="ml-2 mt-1">
                      {errors.video && (
                        <div className="pl-1 text__left">
                          <span className="text-red">{errors.video}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="mt-5">
                  <button
                    type="button"
                    className="btn btn-outline-info ml-2 btn-round float__right icon_margin"
                    onClick={() => {
                      history.push("/admin/fakeLiveStreaming");
                    }}
                  >
                    Close
                  </button>
                  {!mongoId ? (
                    <button
                    type="button"
                    className="btn btn-round float__right btn-danger"
                    onClick={handleSubmit}
                  >
                    Submit
                  </button>
                  ):(
                    <button
                    type="button"
                    className="btn btn-round float__right btn-danger"
                    onClick={handleSubmit}
                  >
                    Update
                  </button>
                  )}
                  
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default connect(null, {
  getFakeUserList,
  getLiveStreamingVideo,
  updateFakeLiveStreamingVideo,
  createFakeLiveStreamingVideo,
})(FakeLiveStreamingPage);
