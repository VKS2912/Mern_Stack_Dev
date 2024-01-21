import React, { useEffect, useState } from "react";

//jquery
import $ from "jquery";

//redux
import { connect, useSelector } from "react-redux";

//action
import { getFakePost, deletePost, insertPost } from "../../store/post/action";

//routing
import { Link, useHistory } from "react-router-dom";

//pagination
import Pagination from "../../pages/Pagination";

// dayjs
import dayjs from "dayjs";

// base url
import { baseURL } from "../../util/Config";

//alert
import { warning, alert, permissionError } from "../../util/Alert";

//MUI icon
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

//image
import noImage from "../../assets/images/noImage.png";

//Date Range Picker
import { DateRangePicker } from "react-date-range";

//Calendar Css
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file

const FakePost = (props) => {
  const history = useHistory();

  const hasPermission = useSelector((state) => state.admin.admin.flag);
  const { post, totalPost } = useSelector((state) => state.post);

  const [data, setData] = useState([]);
  const [activePage, setActivePage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [date, setDate] = useState([]);
  const [sDate, setsDate] = useState("ALL");
  const [eDate, seteDate] = useState("ALL");

  useEffect(() => {
    $("#card").click(() => {
      $("#datePicker").removeClass("show");
    });
  }, []);

  useEffect(() => {
    props.getFakePost(null, activePage, rowsPerPage, sDate, eDate, "Fake"); // eslint-disable-next-line
  }, [activePage, rowsPerPage, sDate, eDate]);

  useEffect(() => {
    setData(post);
  }, [post]);

  useEffect(() => {
    if (date.length === 0) {
      setDate([
        {
          startDate: new Date(),
          endDate: new Date(),
          key: "selection",
        },
      ]);
    }
    $("#datePicker").removeClass("show");
    setData(post);
  }, [date, post]);

  const handlePageChange = (pageNumber) => {
    setActivePage(pageNumber);
  };

  const handleRowsPerPage = (value) => {
    setActivePage(1);
    setRowsPerPage(value);
  };
  const handleDelete = (postId) => {
    const data = warning();
    data
      .then((isDeleted) => {
        if (isDeleted) {
          if (!hasPermission) return permissionError();
          props.deletePost(postId);
          alert("Deleted!", `Post has been deleted!`, "success");
        }
      })
      .catch((err) => console.log(err));
  };

  const getAllPost = () => {
    setActivePage(1);
    setsDate("ALL");
    seteDate("ALL");
    $("#datePicker").removeClass("show");
    props.getFakePost(null, activePage, rowsPerPage, sDate, eDate, "Fake");
  };

  const collapsedDatePicker = () => {
    $("#datePicker").toggleClass("collapse");
  };

  const handleOpen = () => {
    localStorage.removeItem("fakePost");
    history.push("/admin/post/dialog");
  };

  const handleEdit = (data) => {
    localStorage.setItem("fakePost", JSON.stringify(data));
    history.push("/admin/post/dialog");
  };
  return (
    <>
      <div className="page-title">
        <div className="row">
          <div className="col-12 col-md-6 order-md-1 order-last">
            <h3 className="mb-3 text-white">Fake Social Post</h3>
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
                  Fake Post
                </li>
              </ol>
            </nav>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col">
          <div class="card" id="card">
            <div className="card-header pb-0">
              <div className="row my-3">
                <div className="col-xs-12 col-sm-12 col-md-6 col-lg-8 float-left my-3">
                  <div className="text-left align-sm-left d-md-flex d-lg-flex justify-content-start">
                    {/* <button
                      className="btn btn-info"
                      style={{ marginRight: 5 }}
                      onClick={getAllPost}
                    >
                      All
                    </button>
                    <button
                      className="collapsed btn btn-info ml-5"
                      value="check"
                      data-toggle="collapse"
                      data-target="#datePicker"
                      onClick={collapsedDatePicker}
                    >
                      Analytics
                      <ExpandMoreIcon />
                    </button>
                    <p style={{ paddingLeft: 10 }} className="my-2 ">
                      {sDate !== "ALL" && sDate + " to " + eDate}
                    </p> */}
                  </div>
                </div>
                <div className="col-xs-12 col-sm-12 col-md-6 col-lg-4 align-right">
                  <div className="text-right align-sm-right d-md-flex d-lg-flex justify-content-end">
                    <button
                      type="button"
                      className="btn  btn-primary btn-sm"
                      onClick={handleOpen}
                      id="bannerDialog"
                    >
                      <i className="fa fa-plus"></i>
                      <span className="icon_margin">New</span>
                    </button>
                  </div>
                </div>
                <div
                  id="datePicker"
                  className="collapse mt-5 pt-5"
                  aria-expanded="false"
                >
                  <div className="container table-responsive">
                    <div key={JSON.stringify(date)}>
                      <DateRangePicker
                        onChange={(item) => {
                          setDate([item.selection]);
                          const dayStart = dayjs(
                            item.selection.startDate
                          ).format("M/DD/YYYY");
                          const dayEnd = dayjs(item.selection.endDate).format(
                            "M/DD/YYYY"
                          );
                          setActivePage(1);
                          setsDate(dayStart);
                          seteDate(dayEnd);
                          props.getPost(
                            null,
                            activePage,
                            rowsPerPage,
                            sDate,
                            eDate,
                            "fake"
                          );
                        }}
                        showSelectionPreview={true}
                        moveRangeOnFirstSelection={false}
                        ranges={date}
                        direction="horizontal"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="card-body card-overflow">
              <table class="table table-striped">
                <thead>
                  <tr>
                    <th>No.</th>
                    <th>Post</th>
                    <th>Location</th>
                    <th>Like</th>
                    <th>Comment</th>
                    <th>Created At</th>
                    <th>Detail</th>
                    <th>Edit</th>
                    <th>Delete</th>
                  </tr>
                </thead>
                <tbody>
                  {data.length > 0 ? (
                    data.map((data, index) => {
                      return (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>
                            <img
                              height="50px"
                              width="50px"
                              alt="app"
                              src={baseURL + data?.post}
                              style={{
                                boxShadow: "0 5px 15px 0 rgb(105 103 103 / 0%)",
                                border: "2px solid #fff",
                                borderRadius: 10,
                                float: "left",
                                objectFit: "cover",
                              }}
                            />
                          </td>
                          <td>{data.location}</td>
                          <td className="text-danger">{data.like}</td>
                          <td className="text-success">{data.comment}</td>
                          <td>{data.date}</td>
                          <td>
                            <button
                              type="button"
                              className="btn btn-sm btn-info"
                              onClick={() => {
                                localStorage.setItem(
                                  "PostDetail",
                                  JSON.stringify(data)
                                );
                                history.push("/admin/post/detail");
                              }}
                            >
                              Detail
                            </button>
                          </td>
                          <td>
                            <button
                              type="button"
                              className="btn btn-sm text-white"
                              onClick={() => handleEdit(data)}
                              style={{ backgroundColor: "#fc9494" }}
                            >
                              Edit
                            </button>
                          </td>
                          <td>
                            <button
                              type="button"
                              className="btn btn-sm btn-danger"
                              onClick={() => handleDelete(data._id)}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="10" align="center">
                        Nothing to show!!
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
              <Pagination
                activePage={activePage}
                rowsPerPage={rowsPerPage}
                userTotal={totalPost}
                handleRowsPerPage={handleRowsPerPage}
                handlePageChange={handlePageChange}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default connect(null, { getFakePost, deletePost, insertPost })(FakePost);
