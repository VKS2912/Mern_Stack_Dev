import React, { useEffect, useState } from "react";

//redux
import { connect, useSelector } from "react-redux";

//action
import { getSong, deleteSong } from "../../store/song/action";

//config
import { baseURL } from "../../util/Config";
//routing
import { Link, useHistory } from "react-router-dom";
//MUI
import { TablePagination, Tooltip } from "@material-ui/core";

//sweet alert
import { alert, warning, permissionError } from "../../util/Alert";

//image
import noImage from "../../assets/images/noImage.png";

const TablePaginationActions = React.lazy(() => import("./TablePagination"));

const GiftTable = (props) => {
  const history = useHistory();
  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const hasPermission = useSelector((state) => state.admin.admin.flag);

  useEffect(() => {
    props.getSong(); // eslint-disable-next-line
  }, []);

  const song = useSelector((state) => state.song.song);

  useEffect(() => {
    setData(song);
  }, [song]);

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
      const data = song.filter((data) => {
        return (
          data?.singer?.toUpperCase()?.indexOf(value) > -1 ||
          data?.title?.toUpperCase()?.indexOf(value) > -1
        );
      });
      setData(data);
    } else {
      return setData(song);
    }
  };

  const handleDelete = (songId) => {
    const data = warning();
    data
      .then((isDeleted) => {
        if (isDeleted) {
          if (!hasPermission) return permissionError();
          props.deleteSong(songId);
          alert("Deleted!", `Song has been deleted!`, "success");
        }
      })
      .catch((err) => console.log(err));
  };

  const handleEdit = (data) => {
    localStorage.setItem("SongDetail", JSON.stringify(data));
    history.push("/admin/song/dialog");
    // dispatch({ type: OPEN_GIFT_DIALOG, payload: data });
  };

  return (
    <>
      <div className="page-title">
        <div className="row">
          <div className="col-12 col-md-6 order-md-1 order-last">
            <h3 className="mb-3 text-white">Song</h3>
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
                  Song
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
                    onClick={() => {
                      localStorage.removeItem("SongDetail");
                      history.push("/admin/song/dialog");
                    }}
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
                <thead className="text-center">
                  <tr>
                    <th>No.</th>
                    <th>Image</th>
                    <th>Title</th>
                    <th>Singer</th>
                    <th>Song</th>
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
                          <td style={{display : "flex",alignItems : "center", justifyContent : "center"}}>
                            <img
                              height="50px"
                              width="50px"
                              alt="app"
                              src={data.image ? baseURL + data.image : noImage}
                              style={{
                                boxShadow: "0 5px 15px 0 rgb(105 103 103 / 0%)",
                                border: "2px solid #fff",
                                borderRadius: 10,
                                float: "left",
                              }}
                            />
                          </td>
                          <td>{data.title}</td>
                          <td>{data.singer}</td>
                          <td>
                            <audio controls style={{ height: 42 }}>
                              <source
                                src={baseURL + data.song}
                                type="audio/ogg"
                              />
                            </audio>
                          </td>
                          <td>
                            <Tooltip title="Edit">
                              <button
                                type="button"
                                className="btn btn-sm btn-info"
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
    </>
  );
};

export default connect(null, { getSong, deleteSong })(GiftTable);
