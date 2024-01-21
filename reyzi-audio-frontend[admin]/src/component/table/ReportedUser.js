import React, { useState, useEffect } from "react";

//MUI
import { TablePagination } from "@material-ui/core";

//react-router-dom
import { Link } from "react-router-dom";

//rect-redux
import { connect, useSelector } from "react-redux";

//image
import Male from "../../assets/images/male.png";

//action
import { getReportedUser } from "../../store/reportedUser/action";

//dayjs
import dayjs from "dayjs";
import $ from "jquery";
import { baseURL } from "../../util/Config";



//pagination
const TablePaginationActions = React.lazy(() => import("./TablePagination"));

const ReportedUser = (props) => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const report = useSelector((state) => state.report.reportedUser);

  useEffect(() => {
    props.getReportedUser(); //eslint-disable-next-line
  }, []);

  useEffect(() => {
    setData(report);
  }, [report]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  
  // set default image

  $(document).ready(function () {
    $("img").bind("error", function () {
      // Set the default image
      $(this).attr("src",`${baseURL}storage/male.png`);
    });
  });

  return (
    <>
      <div className="page-title">
        <div className="row">
          <div className="col-12 col-md-6 order-md-1 order-last">
            <h3 className="mb-3 text-white">Reported User</h3>
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
                  Reported User
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
              <table class="table" style={{ borderCollapse: "collapse" }}>
                <thead className="text-center">
                  <tr>
                    <th>No</th>
                    <th>Image</th>
                    <th>Name</th>
                    <th>Diamond</th>
                    <th>RCoin</th>
                    <th>Country</th>
                    <th>Count</th>
                    <th>Info</th>
                  </tr>
                </thead>
                <tbody className="text-center">
                  {data.length > 0 ? (
                    (rowsPerPage > 0
                      ? data.slice(
                          page * rowsPerPage,
                          page * rowsPerPage + rowsPerPage
                        )
                      : data
                    ).map((data, index) => {
                      return (
                        <>
                          <tr
                            data-toggle="collapse"
                            data-target={`#demo${index}`}
                            class="accordion-toggle pointer-cursor"
                          >
                            <td>{index + 1}</td>
                            <td>
                              <img
                                height="50px"
                                width="50px"
                                alt="app"
                                className="mx-auto" 
                                src={data._id?.image ? data._id.image : Male}
                                style={{
                                  boxShadow:
                                    "0 5px 15px 0 rgb(105 103 103 / 0%)",
                                  border: "2px solid #fff",
                                  borderRadius: 10,
                                  objectFit: "cover",
                                  display: "block",
                                }} 
                                 onerror='this.src=,`${baseURL}storage/male.png`"'

                              />
                            </td>
                            <td>{data._id.name}</td>
                            <td class="text-success">{data._id.diamond}</td>
                            <td class="text-warning">{data._id.rCoin}</td>
                            <td class="text-info">{data._id.country ? data?._id?.country : "-"}</td>
                            <td class="text-danger">{data.count}</td>
                            <td className="pointer-cursor">
                              <i className="fas fa-info-circle fa-lg"></i>
                            </td>
                          </tr>
                          <tr>
                            <td colspan="8" class="hiddenRow">
                              <div
                                id={`demo${index}`}
                                class="accordian-body collapse"
                              >
                                <h6 className="text-danger">
                                  Report User Detail
                                </h6>
                                <table className="w-100">
                                  <thead>
                                    <tr>
                                      <th>No</th>
                                      <th>Image</th>
                                      <th>Name</th>
                                      <th>Diamond</th>
                                      <th>RCoin</th>
                                      <th>Country</th>
                                      <th>Description</th>
                                      <th>Arrived on</th>
                                    </tr>
                                  </thead>
                                  <tbody
                                    style={{
                                      maxHeight: 100,
                                      overflowY: "auto",
                                    }}
                                  >
                                    {data.report.length > 0 ? (
                                      data.report.map((report, no) => {
                                        return (
                                          <tr key={no}>
                                            <td>{no + 1}</td>
                                            <td>
                                              <img
                                                height="35px"
                                                width="35px"
                                                alt="app"
                                                src={
                                                  report?.toUserId?.image
                                                    ? report?.toUserId.image
                                                    : Male
                                                }
                                                style={{
                                                  boxShadow:
                                                    "0 5px 15px 0 rgb(105 103 103 / 0%)",
                                                  border: "2px solid #fff",
                                                  borderRadius: 10,

                                                  objectFit: "cover",
                                                }}
                                              />
                                            </td>
                                            <td>{report?.toUserId?.name}</td>
                                            <td class="text-success">
                                              {report?.toUserId?.diamond}
                                            </td>
                                            <td class="text-warning">
                                              {report?.toUserId?.rCoin}
                                            </td>
                                            <td class="text-info">
                                              {report?.toUserId?.country ? report.toUserId?.country : "-"}
                                            </td>
                                            <td>{report?.description}</td>

                                            <td>
                                              {dayjs(
                                                report?.date
                                              ).format("DD MMM, YYYY")}
                                            </td>
                                          </tr>
                                        );
                                      })
                                    ) : (
                                      <tr>
                                        <td colSpan="7" align="center">
                                          Nothing to show!!
                                        </td>
                                      </tr>
                                    )}
                                  </tbody>
                                </table>
                              </div>
                            </td>
                          </tr>
                        </>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="7" align="center">
                        Nothing to show!!
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <TablePagination
        id="pagination"
        component="div"
        rowsPerPageOptions={[5, 10, 25, 100, { label: "All", value: -1 }]}
        count={data.length}
        rowsPerPage={rowsPerPage}
        page={page}
        SelectProps={{
          inputProps: { "aria-label": "rows per page" },
          native: true,
        }}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
        ActionsComponent={TablePaginationActions}
      />
    </>
  );
};

export default connect(null, { getReportedUser })(ReportedUser);
