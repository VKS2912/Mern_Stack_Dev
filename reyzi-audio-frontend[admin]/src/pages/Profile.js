import React, { useEffect, useState } from "react";
//axios
import axios from "axios";
//redux
import { connect, useSelector } from "react-redux";

import Face from "../assets/images/card.jpeg";
//action
import {
  getProfile,
  updateNameEmail,
  changePassword,
} from "../store/admin/action";
//toast
import { Toast } from "../util/Toast";
//config
import { baseURL, key } from "../util/Config";
//routing
import { Link } from "react-router-dom";

import { permissionError } from "../util/Alert";

const Profile = (props) => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");

  const [imageData, setImageData] = useState(null);
  const [imagePath, setImagePath] = useState(null);

  const [oldPassword, setOldPassword] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [passwordError, setPasswordError] = useState({
    old: "",
    new: "",
    confirm: "",
  });

  const hasPermission = useSelector((state) => state.admin.admin.flag);

  const admin = useSelector((state) => state.admin.admin);

  const [infoError, setInfoError] = useState({
    name: "",
    email: "",
  });

  useEffect(() => {
    props.getProfile(); // eslint-disable-next-line
  }, []);

  useEffect(() => {
    setName(admin.name);
    setEmail(admin.email);
    setImagePath(baseURL + admin?.image);
  }, [admin]);

  const handleEditProfile = () => {
    if (!name || !email) {
      const error = {};
      if (!email) error.email = "Email is Required!";
      if (!name) error.name = "Name is Required!";

      return setInfoError({ ...error });
    }

    if (!hasPermission) return permissionError();

    props.updateNameEmail({ name, email });
  };

  const handleEditImage = () => {
    document.getElementById("profileImage").click();
  };

  const handleChangeImage = (e) => {
    if (e.target.files[0]) {
      setImageData(e.target.files[0]);
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        setImagePath(reader.result);
      });
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleUpdateImage = () => {
    if (!hasPermission) return permissionError();
    const formData = new FormData();

    formData.append("image", imageData);

    axios
      .patch("admin/updateImage", formData)
      .then((res) => {
        if (res.data.status) {
          Toast("success", "Profile Image updated successfully!");
        } else {
          Toast("error", res.data.message);
        }
      })
      .catch((error) => Toast("error", error.message));
  };

  const handleChangePassword = (e) => {
    e.preventDefault();

    if (!password || !oldPassword || !confirmPassword) {
      const errors = {};

      if (!oldPassword) {
        errors.old = "Password is Required!";
      }
      if (!password) {
        errors.new = "New password is Required!";
      }
      if (!confirmPassword) {
        errors.confirm = "Confirm password is Required!";
      }

      return setPasswordError({ ...errors });
    }
    if (password !== confirmPassword) {
      return setPasswordError({
        ...passwordError,
        confirm: "New & Confirm password doesn't match!",
      });
    }
    if (!hasPermission) return permissionError();

    const data = {
      newPass: password,
      oldPass: oldPassword,
      confirmPass: confirmPassword,
    };

    props.changePassword(data);
  };

  

  return (
    <>
      <div className="page-heading">
        <div className="page-title">
          <div className="row">
            <div className="col-12 col-md-6 order-md-1 order-last">
              <h3 className="mb-3 text-white">Profile</h3>
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
                  <li className="breadcrumb-item active" aria-current="page">
                    profile
                  </li>
                </ol>
              </nav>
            </div>
          </div>
        </div>

        <section id="basic-vertical-layouts">
          <div className="row match-height">
            <div className="col-md-8 col-12">
              <div className="card">
                <div className="card-header">
                  <h4 className="card-title mt-3">Admin Information</h4>
                </div>
                <div className="card-content">
                  <div className="card-body">
                    <form autoComplete="off">
                      <div className="form-body">
                        <div className="row">
                          <div className="col-12">
                            <div className="form-group">
                              <label for="first-name-vertical">Name</label>
                              <input
                                type="text"
                                id="first-name-vertical"
                                className="form-control"
                                name="name"
                                value={name}
                                onChange={(e) => {
                                  setName(e.target.value);
                                  if (!e.target.value) {
                                    return setInfoError({
                                      ...infoError,
                                      name: "Name is Required!",
                                    });
                                  } else {
                                    return setInfoError({
                                      ...infoError,
                                      name: "",
                                    });
                                  }
                                }}
                              />
                            </div>
                          </div>
                          <div className="ml-2 mb-3 mt-2">
                            {infoError.name && (
                              <div className="pl-1 text-left pb-1">
                                <span className="text-red">
                                  {infoError.name}
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="col-12">
                            <div className="form-group">
                              <label for="email-id-vertical">Email</label>
                              <input
                                type="email"
                                id="email-id-vertical"
                                className="form-control"
                                name="email-id"
                                value={email}
                                onChange={(e) => {
                                  setEmail(e.target.value);
                                  if (!e.target.value) {
                                    return setInfoError({
                                      ...infoError,
                                      email: "Email is Required!",
                                    });
                                  } else {
                                    return setInfoError({
                                      ...infoError,
                                      email: "",
                                    });
                                  }
                                }}
                              />
                            </div>
                          </div>
                          <div className="ml-2 mb-3 mt-2">
                            {infoError.email && (
                              <div className="pl-1 text-left pb-1">
                                <span className="text-red">
                                  {infoError.email}
                                </span>
                              </div>
                            )}
                          </div>

                          <div className="col-12 d-flex justify-content-end">
                            <button
                              type="button"
                              className="btn btn-danger me-1 mb-1"
                              onClick={handleEditProfile}
                            >
                              Edit Info
                            </button>
                          </div>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-4 col-12">
              <div className="card">
                <div className="card-header">
                  <h4 className="card-title mt-3">Update Profile Image</h4>
                </div>
                <div className="card-content">
                  <div className="card-body">
                    <form className="form form-vertical">
                      <div className="form-body">
                        <div className="row">
                          <div
                            className="avatar avatar-xl"
                            onClick={handleEditImage}
                          >
                            <input
                              name="image"
                              id="profileImage"
                              type="file"
                              hidden="hidden"
                              accept="image/*"
                              onChange={handleChangeImage}
                            ></input>
                            <div className="container mt-2">
                              <img
                                src={imagePath}
                                alt=""
                                className="m-auto image mb-2"
                                style={{
                                  width: "140px",
                                  height: "140px",
                                  objectFit: "cover ",
                                  borderRadius: "20px",
                                }}
                              />
                              <div className="middle">
                                <i class="fas fa-edit fa-lg text-primary"></i>
                              </div>
                            </div>
                          </div>
                          <div className="col-12 d-flex justify-content-end">
                            <button
                              type="button"
                              className="btn btn-danger me-1 mt-3"
                              onClick={handleUpdateImage}
                            >
                              Edit Image
                            </button>
                          </div>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section id="basic-vertical-layouts">
          <div className="row match-height">
            <div className="col-md-12 col-12">
              <div className="card">
                <div className="card-header">
                  <h4 className="card-title mt-3">Change Password</h4>
                </div>
                <div className="card-content">
                  <div className="card-body">
                    <form className="form form-vertical">
                      <div className="form-body">
                        <div className="row">
                          <div className="col-12">
                            <div className="form-group">
                              <label for="first-name-vertical">
                                Old Password
                              </label>
                              <input
                                type="password"
                                id="first-name-vertical"
                                className="form-control"
                                name="oldPassword"
                                value={oldPassword}
                                onChange={(e) => {
                                  setOldPassword(e.target.value);
                                  if (!e.target.value) {
                                    return setPasswordError({
                                      ...passwordError,
                                      old: "Password is Required!",
                                    });
                                  } else {
                                    return setPasswordError({
                                      ...passwordError,
                                      old: "",
                                    });
                                  }
                                }}
                              />
                            </div>
                          </div>
                          <div className="ml-2 mb-3 mt-2">
                            {passwordError.old && (
                              <div className="pl-1 text-left pb-1">
                                <span className="text-red">
                                  {passwordError.old}
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="col-12">
                            <div className="form-group">
                              <label for="first-name-vertical">
                                New Password
                              </label>
                              <input
                                type="password"
                                id="first-name-vertical"
                                className="form-control"
                                name="newPassword"
                                value={password}
                                onChange={(e) => {
                                  setPassword(e.target.value);
                                  if (!e.target.value) {
                                    return setPasswordError({
                                      ...passwordError,
                                      new: "New Password is Required!",
                                    });
                                  } else {
                                    return setPasswordError({
                                      ...passwordError,
                                      new: "",
                                    });
                                  }
                                }}
                              />
                            </div>
                          </div>
                          <div className="ml-2 mb-3 mt-2">
                            {passwordError.new && (
                              <div className="pl-1 text-left pb-1">
                                <span className="text-red">
                                  {passwordError.new}
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="col-12">
                            <div className="form-group">
                              <label for="first-name-vertical">
                                Confirm Password
                              </label>
                              <input
                                type="password"
                                id="first-name-vertical"
                                className="form-control"
                                name="confirmPassword"
                                value={confirmPassword}
                                onChange={(e) => {
                                  setConfirmPassword(e.target.value);
                                  if (!e.target.value) {
                                    return setPasswordError({
                                      ...passwordError,
                                      confirm: "Confirm Password is Required!",
                                    });
                                  } else {
                                    return setPasswordError({
                                      ...passwordError,
                                      confirm: "",
                                    });
                                  }
                                }}
                              />
                            </div>
                          </div>
                          <div className="ml-2 mb-3 mt-2">
                            {passwordError.confirm && (
                              <div className="pl-1 text-left pb-1">
                                <span className="text-red">
                                  {passwordError.confirm}
                                </span>
                              </div>
                            )}
                          </div>

                          <div className="col-12 d-flex justify-content-end">
                            <button
                              type="button"
                              className="btn btn-danger me-1 mb-1"
                              onClick={handleChangePassword}
                            >
                              Submit
                            </button>
                          </div>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default connect(null, { getProfile, updateNameEmail, changePassword })(
  Profile
);
