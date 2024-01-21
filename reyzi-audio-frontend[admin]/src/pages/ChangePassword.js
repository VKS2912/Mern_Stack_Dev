//react
import React, { useEffect, useState } from "react";

// toast
import { Toast } from "../util/Toast";

// axios
import axios from "axios";

const ChangePassword = (props) => {

  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState({
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    setId(props.match.params.id);
  }, [props.match.params.id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!password || !confirmPassword || password !== confirmPassword) {
      const error = {};

      if (!password) {
        error.password = "Please enter password!";
      }
      if (!confirmPassword) {
        error.confirmPassword = "Please enter confirm password!";
      }
      if (password !== confirmPassword) {
        error.confirmPassword = "Password & Confirm Password does not match";
      }

      return setError({ ...error });
    }
    axios
      .post(`admin/setPassword/${id}`, {
        newPass: password,
        confirmPass: confirmPassword,
      })
      .then((res) => {
        if (res.data.status) {
          Toast("success", "password changed successfully!");
          setTimeout(() => {
            props.history.push("/");
          }, 3000);
        } else {
          Toast("error", res.data.message);
        }
      })
      .catch((error) => {
        Toast("error", error.message);
      });
  };
  return (
    <>
      <div class="login-page back__style">
        <div class="container">
          <div class="row justify-content-md-center">
            <div class="col-md-12 col-lg-4">
              <div class="card login-box-container">
                <div class="card-body">
                  <div class="authent-text">
                    <p class="text-danger mb-4 h5">Change Password</p>
                    <p>If you have forgotten your password you can reset it here!</p>
                  </div>
                  <form autoComplete="off">
                    <div class="mb-3">
                      <div class="form-floating">
                        <input
                          type="password"
                          class="form-control"
                          id="floatingInput"
                          placeholder="password"
                          required
                          value={password}
                          onChange={(e) => {
                            setPassword(e.target.value);
                            if (!e.target.value) {
                              return setError({
                                ...error,
                                password: "Please enter password!",
                              });
                            } else {
                              return setError({
                                ...error,
                                password: "",
                              });
                            }
                          }}
                        />
                        <label for="floatingPassword">Password</label>
                      </div>
                      <div class="mt-2 ml-2 mb-3">
                        {error.password && (
                          <div class="pl-1 text-left pb-1">
                            <span className="text-red font-size-lg">
                              {error.password}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div class="mb-3">
                      <div class="form-floating">
                        <input
                          type="password"
                          class="form-control"
                          id="floatingInput"
                          placeholder="password"
                          required
                          value={confirmPassword}
                          onChange={(e) => {
                            setConfirmPassword(e.target.value);
                            if (!e.target.value) {
                              return setError({
                                ...error,
                                confirmPassword: "Please enter confirm password!",
                              });
                            } else {
                              return setError({
                                ...error,
                                confirmPassword: "",
                              });
                            }
                          }}
                        />
                        <label for="floatingPassword">Confirm Password</label>
                      </div>
                      <div class="mt-2 ml-2 mb-3">
                        {error.confirmPassword && (
                          <div class="pl-1 text-left pb-1">
                            <span className="text-red font-size-lg">
                              {error.confirmPassword}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div class="d-grid">
                      <button type="submit" class="btn btn-danger m-b-xs" onClick={handleSubmit}>
                        Submit
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChangePassword;
