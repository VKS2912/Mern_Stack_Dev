//react
import React, { useState } from "react";

// routing
import { Link } from "react-router-dom"

// action
import { sendEmail } from "../store/admin/action";
//redux
import { connect } from "react-redux";

const ForgotPassword = (props) => {

  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return setError("Email is Required!");
    props.sendEmail({ email });

    setTimeout(() => {
      setEmail("");
    }, 3000);
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
                    <p class="text-danger mb-4 h5">Forgot Password</p>
                    <p>If you have forgotten your password you can reset it here!</p>
                  </div>
                  <form autoComplete="off">
                    <div class="mb-3">
                      <div class="form-floating">
                        <input
                          type="email"
                          class="form-control"
                          id="floatingInput"
                          placeholder="name@example.com"
                          value={email}
                          onChange={(e) => {
                            setEmail(e.target.value);
                            if (!e.target.value) {
                              return setError("Email is Required !");
                            } else {
                              return setError("");
                            }
                          }}
                        />
                        <label for="floatingPassword">Email</label>
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
                    <div class="d-grid">
                      <button type="submit" class="btn btn-danger m-b-xs" onClick={handleSubmit}>
                        Send
                      </button>
                      <Link to="/"><p class="text-info mt-2"><i class="fas fa-arrow-left"></i>&nbsp;&nbsp;Take me back to Login!</p></Link>
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

export default connect(null, { sendEmail })(ForgotPassword);
