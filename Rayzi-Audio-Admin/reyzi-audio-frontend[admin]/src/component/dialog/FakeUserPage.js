/* eslint-disable no-mixed-operators */
import React, { useEffect, useState } from "react";

// jqury

import $ from "jquery";

// routing
import { Link, useHistory } from "react-router-dom";

// redux
import { connect, useSelector } from "react-redux";

//action
import { getCountry, insertUser, editUser } from "../../store/FakeUser/Action";

import { permissionError } from "../../util/Alert";
import { baseURL } from "../../util/Config";

const FakeUserPage = (props) => {
  const history = useHistory();
  const hasPermission = useSelector((state) => state.admin.admin.flag);

  const detail = JSON.parse(localStorage.getItem("fakeUser"));

  const [name, setName] = useState("");
  const [userName, setuserName] = useState("");
  const [gender, setGender] = useState("");
  const [age, setAge] = useState(0);
  const [image, setImage] = useState([]);
  const [imagePath, setImagePath] = useState("");
  const [imageType, setImageType] = useState("0");
  const [country, setCountry] = useState("");
  const [bio, setBio] = useState("");
  const [mongoId, setMongoId] = useState("");
  const [video, setVideo] = useState([]);
  const [videoType, setVideoType] = useState("0");
  const [videoPath, setVideoPath] = useState("");

  const [errors, setError] = useState({
    name: "",
    userName: "",
    gender: "",
    age: "",
    imagePath: "",
    country: "",
    bio: "",
    videoPath: "",
    video: "",
    image: "",
  });
  // const countries = useSelector((state) => state.fakeUser.country);

  useEffect(() => {
    if (detail) {
      setName(detail.name);
      setuserName(detail.username);
      setGender(detail.gender);
      setImage(detail.image);
      // setImageType(detail.image.includes("/storage") ? "image" : "link");
      setAge(detail.age);
      setCountry(detail.country);
      setBio(detail.bio);
      // detail.image.includes("/storage") && setImagePath(detail.image);
      setMongoId(detail._id);
      setVideo(detail.link);
    }
  }, []);

  const HandleInputImage = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
      setImagePath(URL.createObjectURL(e.target.files[0]));
    }
  };

  const HandleInputVideo = (e) => {
    if (e.target.files[0]) {
      setVideo(e.target.files[0]);
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        setVideoPath(reader.result);
      });
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  // set default image

  $(document).ready(function () {
    $("img").bind("error", function () {
      // Set the default image
      $(this).attr("src", `${baseURL}` + "storage/male.png");
    });
  });

  const handleSubmit = (e) => {


    if (
      !name ||
      !userName ||
      !gender ||
      !age ||
      !bio ||
      !country ||
      !image ||
      !video
    ) {
      const errors = {};
      if (!name) errors.name = "Name is Required!";
      if (!userName) errors.userName = "userName is Required!";
      if (!gender) errors.gender = "Gender is Required!";
      if (!age) errors.age = "Age is Required!";
      if (!bio) errors.bio = "Bio is Required!";
      if (!country) errors.country = "Country is Required!";
      if (image?.length === 0 || !image)
        errors.image = "User Image is Required!";
      if (video?.length === 0 || !video)
        errors.video = "User Video is Required!";

      return setError({ ...errors });
    } else {
      if (!hasPermission) return permissionError();
      const formData = new FormData();
      formData.append("image", image);
      formData.append("name", name);
      formData.append("username", userName);
      formData.append("gender", gender);
      formData.append("country", country);
      formData.append("bio", bio);
      formData.append("age", age);
      formData.append("link", video);
      formData.append("imageType", imageType);
      formData.append("linkType", videoType);

      if (mongoId) {
        props.editUser(mongoId, formData);
      } else {
        props.insertUser(formData);
      }

      setTimeout(() => {
        history.push("/admin/fakeUser");
      }, 3000);
    }
  };

  return (
    <>
      <div className="page-title">
        <div className="row">
          <div className="col-12 col-md-6 order-md-1 order-last">
            <h3 className="mb-3 text-muted">Fake User Dialog</h3>
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
                  <Link to="/admin/fake" className="text-danger">
                    Fake User
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
                      <label className="mb-2 text-gray">Name</label>
                      <input
                        type="text"
                        className="form-control"
                        required=""
                        placeholder="Name"
                        value={name}
                        onChange={(e) => {
                          setName(e.target.value);
                          if (!e.target.value) {
                            return setError({
                              ...errors,
                              name: "name is Required!",
                            });
                          } else {
                            return setError({
                              ...errors,
                              name: "",
                            });
                          }
                        }}
                      />
                      {errors.name && (
                        <div className="ml-2 mt-1">
                          {errors.name && (
                            <div className="pl-1 text__left">
                              <span className="text-red">{errors.name}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label className="text-gray mb-2">Country</label>

                      <>
                        <input
                          type="text"
                          class="form-control"
                          // aria-label="example"
                          value={country}
                          onChange={(e) => {
                            setCountry(e.target.value);
                            if (e.target.value === "") {
                              return setError({
                                ...errors,
                                country: "Please Enter a country!",
                              });
                            } else {
                              return setError({
                                ...errors,
                                country: "",
                              });
                            }
                          }}
                        />
                        {/* <option value="Select country" selected>
                            Select country
                          </option>
                          {countries.map((country) => {
                            return (
                              <option value={country.countryName}>
                                {country.countryName}
                              </option>
                            );
                          })}
                        </select> */}
                        {errors.country && (
                          <div className="ml-2 mt-1">
                            {errors.country && (
                              <div className="pl-1 text__left">
                                <span className="text-red">
                                  {errors.country}
                                </span>
                              </div>
                            )}
                          </div>
                        )}
                      </>
                    </div>
                  </div>
                </div>

                <div className="row mt-3">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label className="mb-2 text-gray">userName</label>
                      <input
                        type="text"
                        className="form-control"
                        required=""
                        placeholder="userName"
                        value={userName}
                        onChange={(e) => {
                          setuserName(e.target.value);
                          if (!e.target.value) {
                            return setError({
                              ...errors,
                              userName: "userName is Required!",
                            });
                          } else {
                            return setError({
                              ...errors,
                              userName: "",
                            });
                          }
                        }}
                      />
                      {errors.userName && (
                        <div className="ml-2 mt-1">
                          {errors.name && (
                            <div className="pl-1 text__left">
                              <span className="text-red">
                                {errors.userName}
                              </span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label className="mb-2 text-gray">Age</label>
                      <input
                        type="number"
                        className="form-control"
                        required=""
                        placeholder="18"
                        value={age}
                        onChange={(e) => {
                          setAge(e.target.value);
                          if (!e.target.value) {
                            return setError({
                              ...errors,
                              age: "Age is Required!",
                            });
                          } else {
                            return setError({
                              ...errors,
                              age: "",
                            });
                          }
                        }}
                      />
                      {errors.age && (
                        <div className="ml-2 mt-1">
                          {errors.age && (
                            <div className="pl-1 text__left">
                              <span className="text-red">{errors.age}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="row mt-4">
                  <div className="col-md-6 d-flex justify-content-start">
                    <label className="mb-2 text-gray">Image Type : </label>
                    <div class="form-check">
                      <input
                        class="form-check-input mx-2"
                        type="radio"
                        name="imageType"
                        id="image"
                        value="1"
                        onClick={(e) => {
                          setImageType(e.target.value);
                        }}
                        checked={imageType === "1" ? true : false}
                      />
                      <label class="form-check-label" for="image">
                        Image
                      </label>
                    </div>
                    <div class="form-check">
                      <input
                        class="form-check-input mx-2"
                        type="radio"
                        name="imageType"
                        id="link"
                        value="0"
                        checked={imageType === "0" ? true : false}
                        onClick={(e) => {
                          setImageType(e.target.value);
                        }}
                      />
                      <label class="form-check-label" for="link">
                        Link
                      </label>
                    </div>
                  </div>
                  <div className="col-md-6 justify-content-start">
                    <div className="d-flex">
                      <label className="mb-2 text-gray">Gender : </label>
                      <div className="d-flex">
                        <div class="form-check">
                          <input
                            class="form-check-input mx-2"
                            type="radio"
                            name="gender"
                            id="male"
                            value="male"
                            checked={gender === "male" ? true : false}
                            onChange={(e) => {
                              setGender(e.target.value);
                              if (!e.target.value) {
                                return setError({
                                  ...errors,
                                  gender: "Gender is Required!",
                                });
                              } else {
                                return setError({
                                  ...errors,
                                  gender: "",
                                });
                              }
                            }}
                          />
                          <label class="form-check-label" for="male">
                            Male
                          </label>
                        </div>
                        <div class="form-check">
                          <input
                            class="form-check-input mx-2"
                            type="radio"
                            name="gender"
                            id="female"
                            value="female"
                            checked={gender === "female" ? true : false}
                            onChange={(e) => {
                              setGender(e.target.value);
                              if (!e.target.value) {
                                return setError({
                                  ...errors,
                                  gender: "Gender is Required!",
                                });
                              } else {
                                return setError({
                                  ...errors,
                                  gender: "",
                                });
                              }
                            }}
                          />
                          <label class="form-check-label" for="female">
                            Female
                          </label>
                        </div>
                      </div>
                    </div>

                    {errors.gender && (
                      <div className="ml-2 mt-1">
                        {errors.gender && (
                          <div className="pl-1 text__left">
                            <span className="text-red">{errors.gender}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="row mt-4">
                  <div className={imageType === "1" ? "col-md-6" : "d-none"}>
                    <div className="form-group ">
                      <label className="mb-2 text-gray">Image</label>
                      <input
                        type="file"
                        className="form-control form-control-sm"
                        accept="image/*"
                        required=""
                        onChange={HandleInputImage}
                      />
                      {errors.image && (
                        <div className="ml-2 mt-1">
                          {errors.image && (
                            <div className="pl-1 text__left">
                              <span className="text-red">{errors.image}</span>
                            </div>
                          )}
                        </div>
                      )}
                      {imagePath && (
                        <>
                          <img
                            height="60px"
                            width="60px"
                            alt="app"
                            src={imagePath}
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
                  <div className={imageType === "0" ? "col-md-6" : "d-none"}>
                    <div className="form-group">
                      <label className="mb-2 text-gray">Link</label>
                      <input
                        type="text"
                        className="form-control"
                        required=""
                        placeholder="Image link"
                        value={image}
                        onChange={(e) => {
                          setImage(e.target.value);
                          if (!e.target.value) {
                            return setError({
                              ...errors,
                              image: "Image is Required!",
                            });
                          } else {
                            return setError({
                              ...errors,
                              image: "",
                            });
                          }
                        }}
                      />
                      {errors.bio && (
                        <div className="ml-2 mt-1">
                          {errors.bio && (
                            <div className="pl-1 text__left">
                              <span className="text-red">{errors.image}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group ">
                      <label className="mb-2 text-gray">Bio</label>
                      <input
                        type="text"
                        className="form-control"
                        required=""
                        placeholder="Bio"
                        value={bio}
                        onChange={(e) => {
                          setBio(e.target.value);
                          if (!e.target.value) {
                            return setError({
                              ...errors,
                              bio: "Bio is Required!",
                            });
                          } else {
                            return setError({
                              ...errors,
                              bio: "",
                            });
                          }
                        }}
                      />
                      {errors.bio && (
                        <div className="ml-2 mt-1">
                          {errors.bio && (
                            <div className="pl-1 text__left">
                              <span className="text-red">{errors.bio}</span>
                            </div>
                          )}
                        </div>
                      )}
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
                        checked={videoType === "1" ? true : false}
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
                        checked={videoType === "0" ? true : false}
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
                  <div className={videoType === "1" ? "col-md-6" : "d-none"}>
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
                  <div className={videoType === "0" ? "col-md-6" : "d-none"}>
                    <div className="form-group">
                      <label className="mb-2 text-gray">Link</label>
                      <input
                        type="text"
                        className="form-control"
                        required=""
                        placeholder="Video linkVideo"
                        value={video}
                        onChange={(e) => {
                          setVideo(e.target.value);
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
                              <span className="text-red">{errors.video}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className={imagePath ? "mt-5 pt-5" : "mt-5"}>
                    <button
                      type="button"
                      className="btn btn-outline-info ml-2 btn-round float__right icon_margin"
                      onClick={() => {
                        history.push("/admin/fakeUser");
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
                    ) : (
                      <button
                        type="button"
                        className="btn btn-round float__right btn-danger"
                        onClick={handleSubmit}
                      >
                        Update
                      </button>
                    )}
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

export default connect(null, { getCountry, insertUser, editUser })(
  FakeUserPage
);
