import React from "react";

// images
import Card1 from "../../assets/images/card.jpeg";
import Card2 from "../../assets/images/card2.jpg";

// routing
import { Link } from "react-router-dom";

// alert
import { warning } from "../../util/Alert";

// jquery
import $ from "jquery";

// redux
import { useDispatch, useSelector } from "react-redux";

// types
import { UNSET_ADMIN } from "../../store/admin/types";

//serverpath
import { baseURL } from "../../util/Config";
import { connect } from "react-redux";

import {getProfile} from "../../store/admin/action"
import { useEffect } from "react";

const Topnav = (props) => {
  const dispatch = useDispatch();
  const admin = useSelector((state) => state.admin.admin);

  useEffect(() => {
    props.getProfile()
  },[])

  const handleDrawer = () => {
    $(".profile-drop-menu").toggleClass("show");
  };

  const closePopup = () => {
    $("body").removeClass("activity-sidebar-show");
  };

  const handleLogout = () => {
    const data = warning();
    data.then((isLogout) => {
      if (isLogout) {
        dispatch({ type: UNSET_ADMIN });
        window.location.href = "/";
      }
    });
  };

  return (
    <>
      <div class="page-header">
        <nav class="navbar navbar-expand-lg d-flex justify-content-between">
          <div class="header-title flex-fill">
            <a href={() => false} id="sidebar-toggle">
              <i data-feather="arrow-left"></i>
            </a>
          </div>
          <div class="flex-fill" id="headerNav">
            <ul class="navbar-nav">
              {/* <li class="nav-item">
                <a
                  class="nav-link activity-trigger"
                  href={() => false}
                  id="activity-sidebar-toggle"
                >
                  <i data-feather="grid"></i>
                </a>
              </li> */}
              <li class="nav-item dropdown mb-2" onClick={handleDrawer}>
                <a
                  class="nav-link profile-dropdown"
                  href={() => false}
                  id="profileDropDown"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <img
                    src={admin?.image ? baseURL+admin?.image : Card1}
                    alt=""
                    style={{ width: "30px", height: "30px" }}
                  />
                </a>
                <div
                  class="dropdown-menu dropdown-menu-end profile-drop-menu"
                  aria-labelledby="profileDropDown"
                  style={{ right: 0, left: "auto" }}
                >
                  <Link
                    class="dropdown-item"
                    to="/admin/profile"
                    onClick={handleDrawer}
                  >
                    <i data-feather="user"></i>Profile
                  </Link>
                  {/* <a class="dropdown-item" href={() => false}>
                    <i data-feather="inbox"></i>Messages
                  </a>
                  <a class="dropdown-item" href={() => false}>
                    <i data-feather="edit"></i>Activities
                    <span class="badge rounded-pill bg-success">12</span>
                  </a>
                  <a class="dropdown-item" href={() => false}>
                    <i data-feather="check-circle"></i>Tasks
                  </a> */}
                  <div class="dropdown-divider"></div>
                  <Link
                    class="dropdown-item"
                    to="/admin/setting"
                    onClick={handleDrawer}
                  >
                    <i data-feather="settings"></i>Settings
                  </Link>
                  {/* <a class="dropdown-item" href={() => false}>
                    <i data-feather="unlock"></i>Lock
                  </a> */}
                  <a
                    href={() => false}
                    class="dropdown-item"
                    onClick={handleLogout}
                  >
                    <i data-feather="log-out"></i>Logout
                  </a>
                </div>
              </li>
            </ul>
          </div>
        </nav>
      </div>

      <div class="activity-sidebar-overlay"></div>
      {/* <div class="activity-sidebar">
        <span id="activity-sidebar-close" onClick={closePopup}>
          <i class="material-icons">close</i>
        </span>
        <div class="activity-header">
          <h5>Activity Logs</h5>
        </div>
        <div class="activity-body">
          <ul class="activity-list list-unstyled">
            <li class="activity-item">
              <div class="activity-icon">
                <i class="material-icons">add</i>
              </div>
              <div class="activity-text">
                Ann Green uploaded new item
                <span>
                  This item has to be reviewed, moderators will check it soon.
                </span>
              </div>
              <div class="activity-helper">45min ago</div>
            </li>
            <li class="activity-item activity-info">
              <div class="activity-icon">
                <i class="material-icons">code</i>
              </div>
              <div class="activity-text">
                John Doe made changes to create-invoice.js
                <span>
                  57 lines of code added, 0 removals, 0 errors, 6 warnings
                </span>
              </div>
              <div class="activity-helper">3h ago</div>
            </li>
            <li class="activity-item activity-danger">
              <div class="activity-icon">
                <i class="material-icons">error_outline</i>
              </div>
              <div class="activity-text">
                Can't retrieve data from server
                <span>Server is not responding, please contact provider</span>
              </div>
              <div class="activity-helper">6h ago</div>
            </li>
            <li class="activity-item">
              <div class="activity-icon">
                <i class="material-icons">done</i>
              </div>
              <div class="activity-text">
                Files Uploaded
                <span>2 new files uploaded</span>
                <div class="mail-attachment-files">
                  <div class="card">
                    <img src={Card1} class="card-img-top" alt="..." />
                    <div class="card-body">
                      <h5 class="card-title">image.jpg</h5>
                      <p class="card-text text-secondary">305 KB</p>
                    </div>
                  </div>
                  <div class="card">
                    <img src={Card2} class="card-img-top" alt="..." />
                    <div class="card-body">
                      <h5 class="card-title">image2.jpg</h5>
                      <p class="card-text text-secondary">400 KB</p>
                    </div>
                  </div>
                </div>
              </div>
              <div class="activity-helper">8h ago</div>
            </li>
          </ul>
        </div>
      </div> */}
    </>
  );
};

export default connect(null ,{getProfile})(Topnav);
