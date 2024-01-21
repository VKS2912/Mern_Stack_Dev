import React, { useEffect, useState } from "react";

//redux
import { connect, useDispatch, useSelector } from "react-redux";

//action
import {
  getLevel,
  deleteLevel,
  AccessibleFunctionLevel,
} from "../../store/level/action";

//routing
import { Link } from "react-router-dom";
//MUI
import { TablePagination, Tooltip } from "@material-ui/core";
// type
import { OPEN_LEVEL_DIALOG } from "../../store/level/types";

// dialog
import LevelDialog from "../dialog/Level";

//sweet alert
import { alert, warning, permissionError } from "../../util/Alert";
import { baseURL } from "../../util/Config";

import arraySort from "array-sort";

//image
import noImage from "../../assets/images/noImage.png";

const TablePaginationActions = React.lazy(() => import("./TablePagination"));

const LevelTable = (props) => {
  const dispatch = useDispatch();
  const [coinSort, setCoinSort] = useState(false);
  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const hasPermission = useSelector((state) => state.admin.admin.flag);

  useEffect(() => {
    props.getLevel(); // eslint-disable-next-line
  }, []);

  const level = useSelector((state) => state.level.level);

  useEffect(() => {
    setData(level);
  }, [level]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearch = (e) => {
    const value = e.target.value.toUpperCase()
      ? e.target.value.trim().toUpperCase()
      : e.target.value.trim();
    if (value) {
      const data = level.filter((data) => {
        return (
          data?.name?.toUpperCase()?.indexOf(value) > -1 ||
          data?.coin?.toString()?.indexOf(value) > -1
        );
      });
      setData(data);
    } else {
      return setData(level);
    }
  };

  const handleDelete = (levelId) => {
    const data = warning();
    data
      .then((isDeleted) => {
        if (isDeleted) {
          if (!hasPermission) return permissionError();
          props.deleteLevel(levelId);
          alert("Deleted!", `Level has been deleted!`, "success");
        }
      })
      .catch((err) => console.log(err));
  };

  const handleEdit = (data) => {
    dispatch({ type: OPEN_LEVEL_DIALOG, payload: data });
  };

  const handleOpen = () => {
    dispatch({ type: OPEN_LEVEL_DIALOG });
  };

  const handleCoinSort = () => {
    setCoinSort(!coinSort);
    arraySort(data, "coin", { reverse: coinSort });
  };

  const handleAccessFunction = (id, name) => {
    const data = {
      levelId: id,
      fieldName: name,
    };
    props.AccessibleFunctionLevel(data);
  };

  return (
    <>
      <div className="page-title">
        <div className="row">
          <div className="col-12 col-md-6 order-md-1 order-last">
            <h3 className="mb-3 text-white">Level</h3>
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
                  Level
                </li>
              </ol>
            </nav>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col">
          <div class="card">
            <div className="card-header pb-0">
              <div className="row my-3">
                <div className="col-xs-12 col-sm-12 col-md-6 col-lg-8 float-left">
                  <button
                    type="button"
                    className="btn waves-effect waves-light btn-danger btn-sm float-left"
                    onClick={handleOpen}
                    id="bannerDialog"
                  >
                    <i className="fa fa-plus"></i>
                    <span className="icon_margin">New</span>
                  </button>
                </div>
                <div className="col-xs-12 col-sm-12 col-md-6 col-lg-4 float-right mt-3 mt-lg-0 mt-xl-0">
                  <form action="">
                    <div className="input-group mb-3 border rounded-pill">
                      <div className="input-group-prepend border-0">
                        <div id="button-addon4" className="btn text-danger">
                          <i className="fas fa-search mt-2"></i>
                        </div>
                      </div>
                      <input
                        type="search"
                        placeholder="What're you searching for?"
                        aria-describedby="button-addon4"
                        className="form-control bg-none border-0 rounded-pill searchBar"
                        onChange={handleSearch}
                      />
                    </div>
                  </form>
                </div>
              </div>
            </div>
            <div class="card-body card-overflow">
              <div class="d-sm-flex align-items-center justify-content-between mb-4"></div>

              <table class="table table-striped">
                <thead className="text-white">
                  <tr>
                    <th>No.</th>
                    <th>Image</th>
                    <th>Level Name</th>
                    <th onClick={handleCoinSort} style={{ cursor: "pointer" }}>
                      Coin {coinSort ? " ▼" : " ▲"}
                    </th>
                    <th>Accessible Function</th>
                    <th>Edit</th>
                    <th>Delete</th>
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
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>
                            <img
                              height="50px"
                              width="50px"
                              alt="app"
                              src={data.image ? baseURL + data.image : noImage}
                              style={{
                                boxShadow:
                                  "0 5px 15px 0 rgb(105 103 103 / 00%)",
                                border: "2px solid #fff",
                                borderRadius: 10,
                                display: "block",
                              }}
                              className="mx-auto"
                            />
                          </td>
                          <td>{data.name}</td>
                          <td>{data.coin}</td>
                          <td>
                            <div class="form-check">
                              <input
                                type="checkbox"
                                class="form-check-input"
                                id="liveStreaming"
                                checked={
                                  Object.keys(data.accessibleFunction).includes(
                                    "liveStreaming"
                                  ) && data.accessibleFunction.liveStreaming
                                }
                                onClick={() => {
                                  handleAccessFunction(
                                    data._id,
                                    "liveStreaming"
                                  );
                                }}
                              />
                              <label
                                class="form-check-label"
                                for="liveStreaming"
                              >
                                LiveStreaming
                              </label>
                            </div>

                            <div class="form-check">
                              <input
                                type="checkbox"
                                class="form-check-input"
                                id="freeCall"
                                checked={
                                  Object.keys(data.accessibleFunction).includes(
                                    "freeCall"
                                  ) && data.accessibleFunction.freeCall
                                }
                                onClick={() => {
                                  handleAccessFunction(data._id, "freeCall");
                                }}
                              />
                              <label class="form-check-label" for="freeCall">
                                Free Call
                              </label>
                            </div>

                            <div class="form-check">
                              <input
                                type="checkbox"
                                class="form-check-input"
                                id="cashOut"
                                checked={
                                  Object.keys(data.accessibleFunction).includes(
                                    "cashOut"
                                  ) && data.accessibleFunction.cashOut
                                }
                                onClick={() => {
                                  handleAccessFunction(data._id, "cashOut");
                                }}
                              />
                              <label class="form-check-label" for="cashOut">
                                Redeem [cashout]
                              </label>
                            </div>

                            <div class="form-check">
                              <input
                                type="checkbox"
                                class="form-check-input"
                                id="uploadPost"
                                checked={
                                  Object.keys(data.accessibleFunction).includes(
                                    "uploadPost"
                                  ) && data.accessibleFunction.uploadPost
                                }
                                onClick={() => {
                                  handleAccessFunction(data._id, "uploadPost");
                                }}
                              />
                              <label class="form-check-label" for="uploadPost">
                                Upload Social Post
                              </label>
                            </div>
                            <div class="form-check">
                              <input
                                type="checkbox"
                                class="form-check-input"
                                id="uploadVideo"
                                checked={
                                  Object.keys(data.accessibleFunction).includes(
                                    "uploadVideo"
                                  ) && data.accessibleFunction.uploadVideo
                                }
                                onClick={() => {
                                  handleAccessFunction(data._id, "uploadVideo");
                                }}
                              />
                              <label class="form-check-label" for="uploadVideo">
                                Upload Video
                              </label>
                            </div>
                          </td>
                          <td>
                            <Tooltip title="Edit">
                              <button
                                type="button"
                                className="btn btn-sm btn-primary"
                                onClick={() => handleEdit(data)}
                              >
                                <i className="fa fa-edit"></i>
                              </button>
                            </Tooltip>
                          </td>
                          <td>
                            <Tooltip title="Delete">
                              <button
                                type="button"
                                className="btn btn-danger btn-sm"
                                onClick={() => handleDelete(data._id)}
                              >
                                <i className="fas fa-trash-alt"></i>
                              </button>
                            </Tooltip>
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
              <TablePagination
                id="pagination"
                component="div"
                rowsPerPageOptions={[
                  5,
                  10,
                  25,
                  100,
                  { label: "All", value: -1 },
                ]}
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
            </div>
          </div>
        </div>
      </div>
      <LevelDialog />
    </>
  );
};

export default connect(null, {
  getLevel,
  deleteLevel,
  AccessibleFunctionLevel,
})(LevelTable);
