/* eslint-disable no-mixed-operators */
import React, { useEffect, useState } from "react";

// routing
import { Link, useHistory } from "react-router-dom";

// redux
import { connect, useSelector } from "react-redux";

import { permissionError } from "../../util/Alert";

//action
import { getFakeUserList } from "../../store/fakeLiveStreamingVideo/action";

import { getFakeUser } from "../../store/FakeUser/Action";

import { insertVideo, editVideo } from "../../store/video/action";
import { $ } from "jquery";
import { baseURL } from "../../util/Config";

const FakeVideoPage = (props) => {
  const history = useHistory();
  const detail = JSON.parse(localStorage.getItem("fakeRelite"));
  const hasPermission = useSelector((state) => state.admin.admin.flag);
  const { user } = useSelector((state) => state.fakeUser);

  console.log("user",user) ;

  useEffect(() => {
    props.getFakeUser("", "", "ALL", "ALL", "ALL"); // eslint-disable-next-line
  }, []);

  const [show, setShow] = useState("");

  const [thumbnail, setThumbnail] = useState("");
  const [thumbnailPath, setThumbnailPath] = useState("");
  const [screenshot, setScreenshot] = useState("");
  const [screenshotPath, setScreenshotPath] = useState("");
  const [video, setVideo] = useState([]);
  const [videoPath, setVideoPath] = useState("");
  const [videoType, setVideoType] = useState(0);
  const [user_, setUser] = useState("");
  const [caption, setCaption] = useState("");
  const [location, setLocation] = useState("");
  const [mongoId, setMongoId] = useState("");
  const [userData, setUserData] = useState([]);

  const [errors, setError] = useState({
    video: "",
    screenshot: "",
    show: "",
    thumbnail: "",
    videoPath: "",
    user_: "",
    location : "",
  });

  useEffect(() => {
    if (detail) {
   
      setThumbnail(detail.thumbnail);
      setScreenshot(detail.screenshot);
      setUser(detail?.userId?._id);
      setShow(detail.showVideo.toString());
      setLocation(detail.location);
      setVideoType(detail.fakeVideoType);
      setCaption(detail.caption);
      setThumbnailPath(baseURL + detail.thumbnail);
      setScreenshotPath(baseURL + detail.screenshot);

      setVideoPath(detail.video);

      setMongoId(detail._id);
    }
  }, []);

  useEffect(() => {
    setUserData(user);
  }, [user]);

  const HandleInputThumbnail = (e) => {
    if (e.target.files[0]) {
      setThumbnail(e.target.files[0]);
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        setThumbnailPath(reader.result);
      });
      reader.readAsDataURL(e.target.files[0]);
    }
  };


  const HandleInputScreenshot = (e) => {
    if (e.target.files[0]) {
      setScreenshot(e.target.files[0]);
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        setScreenshotPath(reader.result);
      });
      reader.readAsDataURL(e.target.files[0]);
    }
  };
  const HandleInputVideo = (e) => {
    // if (e.target.files[0]) {
    //   setVideo(e.target.files[0]);
    //   const reader = new FileReader();
    //   reader.addEventListener("load", () => {
    //     setVideoPath(reader.result);
    //   });
    //   reader.readAsDataURL(e.target.files[0]);
    // }
    setVideo(e.target.files[0]);
    setVideoPath(URL.createObjectURL(e.target.files[0]));
  };

  const handleSubmit = () => {
    
    if (!video || !user_ || user === "Select user" || !show || !location) {
      const errors = {};
      if (!video.length === 0 || !videoPath) errors.video = "Please select an video!";
      if (!user_ || user === "Select user") errors.user_ = "User Required";
      if (!show) errors.show = "Please Select Video Show Type";
      if(!location) errors.location = "Please Enter Location";

      return setError({ ...errors });
    } else {
      if (!hasPermission) return permissionError();
      const formData = new FormData();

      formData.append("thumbnail", thumbnail);
      formData.append("showVideo", parseInt(show));

      formData.append("userId", user_);
      formData.append("screenshot", screenshot);
      if (videoType == 0) {
        formData.append("video", videoPath);
      } else {
        formData.append("video", video);
      }
      formData.append("fakeVideoType", videoType);
      formData.append("location", location);
      formData.append("caption", caption);
      formData.append("isFake", true);
      formData.append("isOriginalAudio", true);
      formData.append("hashtag","");


      if (mongoId) {
        props.editVideo(mongoId, formData);
      } else {
        props.insertVideo(formData);
      }

      history.push("/admin/video/fake");
    }
    // if (!user_ || user === "Select user") {
    //   const errors = {};

    //   if (!user_) errors.user_ = "user is Required!";

    //   return setError({ ...errors });
    // }
  };

  return (
    <>
      <div className="page-title">
        <div className="row">
          <div className="col-12 col-md-6 order-md-1 order-last">
            <h3 className="mb-3 text-light">Fake Relite Dialog</h3>
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
                  <Link to="/admin/video" className="text-danger">
                    Video
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
                  <div className="col-md-6">
                    <div className="form-group">
                      <label className="text-gray mb-2">user</label>

                      <>
                        <select
                          class="form-select form-control"
                          aria-label="Default select example"
                          value={user_}
                          onChange={(e) => {
                            setUser(e.target.value);
                            if (e.target.value === "Selectuser") {
                              return setError({
                                ...errors,
                                user_: "Please select a user!",
                              });
                            } else {
                              return setError({
                                ...errors,
                                user_: "",
                              });
                            }
                          }}
                        >
                          <option value="Selectuser">Select user</option>
                          {userData?.map((user) => {
                            return user.name == detail?.userId?.name ? (
                              <option value={user?._id} selected>
                                {user?.name}
                              </option>
                            ) : (
                              <option value={user?._id}>{user?.name}</option>
                            );
                          })}
                        </select>
                        {errors.user_ && (
                          <div className="ml-2 mt-1">
                            {errors.user_ && (
                              <div className="pl-1 text__left">
                                <span className="text-red">{errors.user_}</span>
                              </div>
                            )}
                          </div>
                        )}
                      </>
                    </div>
                  </div>
                  <div className="col-md-6 d-flex justify-content-start mt-5">
                    <label className="mb-2 text-gray">Show Video : </label>
                    <div class="form-check">
                      <input
                        class="form-check-input mx-2"
                        type="radio"
                        name="show"
                        id="public"
                        value="0"
                        checked={show === "0" ? true : false}
                        onClick={(e) => {
                          setShow(e.target.value);
                        }}
                      />
                      <label class="form-check-label" for="public">
                        Public
                      </label>
                    </div>
                    <div class="form-check">
                      <input
                        class="form-check-input mx-2"
                        type="radio"
                        name="show"
                        id="private"
                        value="1"
                        checked={show === "1" ? true : false}
                        onClick={(e) => {
                          setShow(e.target.value);
                        }}
                      />
                      <label class="form-check-label" for="private">
                        Private
                      </label>
                    </div>
                  </div>
                  <div className="col-md-6"></div>
                  <div className="col-md-6">
                    {errors.show && (
                      <div className="ml-2 mt-1">
                        {errors.show && (
                          <div className="pl-1 text__left">
                            <span className="text-red">{errors.show}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="row mt-4">
                  <div className="col-md-6">
                    <div className="form-group ">
                      <label className="mb-2 text-gray">Thumbnail</label>
                      <input
                        type="file"
                        className="form-control form-control-sm"
                        accept="image/*"
                        required=""
                        onChange={HandleInputThumbnail}
                      />
                      {errors.thumbnail && (
                        <div className="ml-2 mt-1">
                          {errors.thumbnail && (
                            <div className="pl-1 text__left">
                              <span className="text-red">
                                {errors.thumbnail}
                              </span>
                            </div>
                          )}
                        </div>
                      )}
                      {thumbnailPath && (
                        <>
                          <img
                            height="60px"
                            width="60px"
                            alt="app"
                            src={thumbnailPath}
                            style={{
                              boxShadow: "0 5px 15px 0 rgb(105 103 103 / 00%)",
                              border: "2px solid #fff",
                              borderRadius: 10,
                              marginTop: 10,
                              float: "left",
                              objectFit: "contain",
                              marginRight: 15,
                            }}
                          />
                        </>
                      )}
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group ">
                      <label className="mb-2 text-gray">Screenshot</label>
                      <input
                        type="file"
                        className="form-control form-control-sm"
                        accept="image/*"
                        required=""
                        onChange={HandleInputScreenshot}
                      />
                      {errors.screenshot && (
                        <div className="ml-2 mt-1">
                          {errors.screenshot && (
                            <div className="pl-1 text__left">
                              <span className="text-red">
                                {errors.screenshot}
                              </span>
                            </div>
                          )}
                        </div>
                      )}
                      {screenshotPath && (
                        <>
                          <img
                            height="60px"
                            width="60px"
                            alt="app"
                            src={screenshotPath}
                            style={{
                              boxShadow: "0 5px 15px 0 rgb(105 103 103 / 00%)",
                              border: "2px solid #fff",
                              borderRadius: 10,
                              marginTop: 10,
                              float: "left",
                              objectFit: "contain",
                              marginRight: 15,
                            }}
                          />
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="row mt-4">
                  <div className="col-md-6">
                    <div className="form-group ">
                      <label className="mb-2 text-gray">location</label>
                      <input
                        type="text"
                        className="form-control"
                        required=""
                        placeholder="location"
                        value={location}
                        onChange={(e) => {
                          setLocation(e.target.value);
                          if (!e.target.value) {
                            return setError({
                              ...errors,
                              location: "Location is Required!",
                            });
                          } else {
                            return setError({
                              ...errors,
                              location: "",
                            });
                          }
                        }}
                      />
                       {errors.location && (
                        <div className="ml-2 mt-1">
                          {errors.location && (
                            <div className="pl-1 text__left">
                              <span className="text-red">
                                {errors.location}
                              </span>
                            </div>
                          )}
                          </div>
                       )}
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group ">
                      <label className="mb-2 text-gray">Caption</label>
                      <textarea
                        rows={3}
                        cols={30}
                        className="form-control"
                        required=""
                        placeholder="caption"
                        value={caption}
                        onChange={(e) => {
                          setCaption(e.target.value);
                        }}
                      />
                    </div>
                  </div>
                </div>

               
                <div className="row mt-4">
                  <div className="col-md-6 d-flex justify-content-start">
                    <label className="mb-2 text-gray">Video Type : </label>
                    <div class="form-check">
                      <input
                        class="form-check-input mx-2"
                        type="radio"
                        name="videoType"
                        id="video"
                        value="1"
                        onClick={(e) => {
                          setVideoType(e.target.value);
                        }}
                        checked={videoType == "1" ? true : false}
                      />
                      <label class="form-check-label" for="video">
                        Video
                      </label>
                    </div>
                    <div class="form-check">
                      <input
                        class="form-check-input mx-2"
                        type="radio"
                        name="videoType"
                        id="linkVideo"
                        value="0"
                        checked={videoType == "0" ? true : false}
                        onClick={(e) => {
                          setVideoType(e.target.value);
                        }}
                      />
                      <label class="form-check-label" for="linkVideo">
                        Link
                      </label>
                    </div>
                  </div>
                </div>
                <div className="row mt-4">
                  <div className={videoType == "1" ? "col-md-6" : "d-none"}>
                    <div className="form-group ">
                      <label className="mb-2 text-gray">video</label>
                      <input
                        type="file"
                        className="form-control form-control-sm"
                        accept="video/*"
                        required=""
                        controls
                        // value={}
                        onChange={HandleInputVideo}
                      />
                      {errors.video && (
                        <div className="ml-2 mt-1">
                          {errors.video && (
                            <div className="pl-1 text__left">
                              <span className="text-red">{errors.video}</span>
                            </div>
                          )}
                        </div>
                      )}
                      {videoPath && (
                        <>
                          <video
                            height="60px"
                            width="60px"
                            alt="app"
                            src={videoPath}
                            style={{
                              boxShadow: "0 5px 15px 0 rgb(105 103 103 / 00%)",
                              border: "2px solid #fff",
                              borderRadius: 10,
                              marginTop: 10,
                              float: "left",
                              objectFit: "contain",
                              marginRight: 15,
                            }}
                          />
                        </>
                      )}
                    </div>
                  </div>
                  <div className={videoType == 0 ? "col-md-6" : "d-none"}>
                    <div className="form-group">
                      <label className="mb-2 text-gray">Link</label>
                      <input
                        type="text"
                        className="form-control"
                        required=""
                        placeholder="Video link "
                        value={videoPath}
                        onChange={(e) => {
                          setVideoPath(e.target.value);
                          if (!e.target.value) {
                            return setError({
                              ...errors,
                              video: "Video is Required!",
                            });
                          } else {
                            return setError({
                              ...errors,
                              video: "",
                            });
                          }
                        }}
                      />
                      {errors.video && (
                        <div className="ml-2 mt-1">
                          {errors.video && (
                            <div className="pl-1 text__left">
                              <span className="text-red">
                                {errors.video}
                              </span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className={videoType ? "mt-5 pt-5" : "mt-5"}>
                    <button
                      type="button"
                      className="btn btn-outline-info ml-2 btn-round float__right icon_margin"
                      onClick={() => {
                        history.push("/admin/video/fake");
                      }}
                    >
                      Close
                    </button>
                    <button
                      type="button"
                      className="btn btn-round float__right btn-danger"
                      onClick={(e) => handleSubmit(e)}
                    >
                      Submit
                    </button>
                  </div>
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
  getFakeUser,
  getFakeUserList,
  insertVideo,
  editVideo,
})(FakeVideoPage);
