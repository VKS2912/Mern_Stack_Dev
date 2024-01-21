import React from "react";

// routing
import { Link } from "react-router-dom"

const Page404 = () => {
  return (
    <>
      <div class="container">
        <div class="error-container">
          <div class="error-info">
            <h1>404</h1>
            <p>
              It seems that the page you are looking for no longer exists.
              <br />
              Go to the
              <Link to="/"> homepage</Link>.
            </p>
          </div>
          <div class="error-image"></div>
        </div>
      </div>
    </>
  );
};

export default Page404;
