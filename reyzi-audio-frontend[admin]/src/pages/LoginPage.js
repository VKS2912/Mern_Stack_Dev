import React, { useState } from "react";

//routing
import { Link } from "react-router-dom";

//redux
import { connect } from "react-redux";

//action
import { login } from "../store/admin/action";


const LoginPage = (props) => {
  const [email, setEmail] = useState("demo@admin.com");
  const [password, setPassword] = useState("123456");
  const [error, setError] = useState({
    email: "",
    password: "",
  });
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      const error = {};

      if (!email) error.email = "Email is Required!";
      if (!password) error.password = "Password is Required!";

      return setError({ ...error });
    }
    const data = {
      email,
      password,
    };
    props.login(data);
  };
  return (
    <>
      <div className="login-page back__style">
        <div class="container">
          <div class="row justify-content-md-center">
            <div class="col-md-12 col-lg-4">
              <div class="card login-box-container">
                <div class="card-body">
                  <div class="authent-logo mb-4">
                    <span class="text-danger h1">OYOY</span>
                  </div>
                  <div class="authent-text">
                    {/* <p>Welcome to Rayzi</p> */}
                    <p>
                      Enter your email address and password to access admin
                      panel.
                    </p>
                  </div>

                  <form autoComplete="off">
                    <div class="mb-3">
                      <div class="form-floating">
                        <input
                          type="email"
                          class="form-control"
                          id="floatingInput"
                          placeholder="name@example.com"
                          required
                          value={email}
                          onChange={(e) => {
                            setEmail(e.target.value);
                            if (!e.target.value) {
                              return setError({
                                ...error,
                                email: "Email is Required !",
                              });
                            } else {
                              return setError({
                                ...error,
                                email: "",
                              });
                            }
                          }}
                        />
                        <label for="floatingInput">Email address</label>
                      </div>
                      <div class="mt-2 ml-2 mb-3">
                        {error.email && (
                          <div class="pl-1 text-left pb-1">
                            <span className="text-red font-size-lg">
                              {error.email}
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
                          id="floatingPassword"
                          placeholder="Password"
                          value={password}
                          onChange={(e) => {
                            setPassword(e.target.value);
                            if (!e.target.value) {
                              return setError({
                                ...error,
                                password: "Password is Required !",
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
                            <span className="text-red">{error.password}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div class="d-grid">
                      <button
                        type="submit"
                        class="btn btn-danger m-b-xs"
                        onClick={handleSubmit}
                      >
                        Sign In
                      </button>
                    </div>
                  </form>
                  <div class="authent-reg">
                    <p>
                      <Link to="/forgot" class="text-info">
                        Forgot password?
                      </Link>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default connect(null, { login })(LoginPage);
