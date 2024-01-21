//react
import React from "react";

//Image
import ProfilePic from "../assets/images/profile-image.png";

const UnlockScreenPage = () => {
  return (
    <>
      <div class="login-page">
        <div class="container">
          <div class="row justify-content-md-center">
            <div class="col-md-12 col-lg-4">
              <div class="card login-box-container">
                <div class="card-body">
                  <div class="authent-logo">
                    <img src={ProfilePic} width="60" alt="" />
                  </div>
                  <div class="authent-text">
                    <p>Welcome back!</p>
                    <p>Enter your password to unlock.</p>
                  </div>
                  <form>
                    <div class="mb-3">
                      <div class="form-floating">
                        <input
                          type="password"
                          class="form-control"
                          id="floatingPassword"
                          placeholder="Password"
                        />
                        <label for="floatingPassword">Password</label>
                      </div>
                    </div>
                    <div class="d-grid">
                      <button type="submit" class="btn btn-secondary m-b-xs">
                        Unlock
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

export default UnlockScreenPage;
