import React, { useState, useEffect } from "react";

//react-router
import { connect, useSelector } from "react-redux";

import { Link, useHistory } from "react-router-dom";

//action
import { userHistory } from "../store/user/action";
import { coinPlanHistory } from "../store/coinPlan/action";
import { vipPlanHistory } from "../store/vipPlan/action";

//dayjs
import dayjs from "dayjs";

//moment
import moment from "moment";

//jquery
import $ from "jquery";

//MUI icon
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

//Date Range Picker
import { DateRangePicker } from "react-date-range";
//Calendar Css
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file

//pagination
import Pagination from "./Pagination";

//purchase plan history table
import PurchaseCoinPlan from "../component/table/history/PurchaseCoinPlan";
import PurchaseVipPlan from "../component/table/history/PurchaseVipPlan";

//image
import ads from "../assets/images/ads.png";
import diamond from "../assets/images/diamond.png";
import gift from "../assets/images/ic_gift.png";
import moneybag from "../assets/images/moneybag.png";
import male from "../assets/images/male.png";
import videocall from "../assets/images/videocall.png";
import withdraw from "../assets/images/withdraw.png";

const UserHistory = (props) => {
  const history_ = useHistory();

  const [date, setDate] = useState([]);
  const [sDate, setsDate] = useState("ALL");
  const [eDate, seteDate] = useState("ALL");
  const [historyType, setHistoryType] = useState("diamond");

  const [activePage, setActivePage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [data, setData] = useState([]);

  const {
    totalHistoryUser,
    history,
    income,
    outgoing,
    liveStreamingIncome,
    totalCallCharge,
  } = useSelector((state) => state.user);

  const { history: coinPlanHistory, totalPlan } = useSelector(
    (state) => state.coinPlan
  );
  const { history: vipPlanHistory, totalPlan: totalVipPlan } = useSelector(
    (state) => state.vipPlan
  );

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    $("#card").click(() => {
      $("#datePicker").removeClass("show");
    });
  }, []);

  useEffect(() => {
    if (historyType !== "coinPlan" && historyType !== "vipPlan") {
      const data = {
        userId: user._id,
        type: historyType,
        start: activePage,
        limit: rowsPerPage,
      };
      if (sDate !== "ALL" && eDate !== "ALL") {
        data.startDate = sDate;
        data.endDate = eDate;
      }
      props.userHistory(data);
    } else if (historyType === "coinPlan") {
      props.coinPlanHistory(user._id, activePage, rowsPerPage, sDate, eDate);
    } else if (historyType === "vipPlan") {
      props.vipPlanHistory(user._id, activePage, rowsPerPage, sDate, eDate);
    }

    // eslint-disable-next-line
  }, [activePage, rowsPerPage, historyType]);

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
    if (historyType !== "coinPlan" && historyType !== "vipPlan") {
      setData(history);
    } else if (historyType === "coinPlan") {
      setData(coinPlanHistory);
    } else if (historyType === "vipPlan") {
      setData(vipPlanHistory);
    } //eslint-disable-next-line
  }, [date, history, coinPlanHistory, vipPlanHistory]);

  useEffect(() => {
    if (historyType !== "coinPlan" && historyType !== "vipPlan") {
      setData(history);
    } else if (historyType === "coinPlan") {
      setData(coinPlanHistory);
    } else if (historyType === "vipPlan") {
      setData(vipPlanHistory);
    } //eslint-disable-next-line
  }, [history, coinPlanHistory, vipPlanHistory]);

  const getAllUser = () => {
    setActivePage(1);
    setsDate("ALL");
    seteDate("ALL");
    $("#datePicker").removeClass("show");
    if (historyType !== "coinPlan" && historyType !== "vipPlan") {
      const data = {
        userId: user._id,
        type: historyType,
        start: activePage,
        limit: rowsPerPage,
      };
      props.userHistory(data);
    } else if (historyType === "coinPlan") {
      props.coinPlanHistory(user._id, activePage, rowsPerPage, "ALL", "ALL");
    } else if (historyType === "vipPlan") {
      props.vipPlanHistory(user._id, activePage, rowsPerPage, "ALL", "ALL");
    }
  };

  const collapsedDatePicker = () => {
    $("#datePicker").toggleClass("collapse");
  };

  const handlePageChange = (pageNumber) => {
    setActivePage(pageNumber);
  };

  const handleRowsPerPage = (value) => {
    setRowsPerPage(value);
    setActivePage(1);
  };

  const handleUserInfo = (user) => {
    localStorage.setItem("user", JSON.stringify(user));
    history_.push("/admin/user/detail");
  };

  return (
    <>
      <div className="page-title">
        <div className="row">
          <div className="col-12 col-md-6 order-md-1 order-last">
            <h3 className="mb-3 text-muted">{user?.name}'s History</h3>
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
                <li className="breadcrumb-item">
                  <Link to="/admin/user" className="text-danger">
                    User
                  </Link>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  History
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
                <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12 float-left mb-xl-3 mb-5">
                  <div className="text-left align-sm-left d-md-flex d-lg-flex justify-content-start">
                    <button
                      className="btn btn-info"
                      style={{ marginRight: 5 }}
                      onClick={getAllUser}
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
                    <p style={{ paddingLeft: 4 }} className="my-2 ">
                      {sDate !== "ALL" && sDate + " to " + eDate}
                    </p>
                  </div>
                </div>
                <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12 float-right mt-3 mt-lg-0 mt-xl-0  align-sm-left d-md-flex d-lg-flex justify-content-end">
                  <ul
                    className="list-unstyled align-sm-left d-md-flex d-lg-flex pt-2"
                    id="manageVideoFeed"
                  >
                    <li className="px-2  my-2 my-md-0">
                      <a
                        href={() => false}
                        className="pointer-cursor badge bg-secondary"
                        onClick={() => {
                          setHistoryType("diamond");
                          setActivePage(1);
                          setsDate("ALL");
                          seteDate("ALL");
                        }}
                      >
                        Diamond History
                      </a>
                    </li>

                    <li className="px-2 my-2 my-md-0">
                      <a
                        href={() => false}
                        className="pointer-cursor badge bg-warning"
                        onClick={() => {
                          setHistoryType("rCoin");
                          setActivePage(1);
                          setsDate("ALL");
                          seteDate("ALL");
                        }}
                      >
                        RCoin History
                      </a>
                    </li>
                    <li className="px-2 my-2 my-md-0">
                      <a
                        href={() => false}
                        className="pointer-cursor badge bg-danger"
                        onClick={() => {
                          setHistoryType("call");
                          setActivePage(1);
                          setsDate("ALL");
                          seteDate("ALL");
                        }}
                      >
                        Call History
                      </a>
                    </li>
                    <li className="px-2 my-2 my-md-0">
                      <a
                        href={() => false}
                        className="pointer-cursor badge bg-primary"
                        onClick={() => {
                          setHistoryType("liveStreaming");
                          setActivePage(1);
                          setsDate("ALL");
                          seteDate("ALL");
                        }}
                      >
                        LiveStreaming History
                      </a>
                    </li>
                    <li className="px-2 my-2 my-md-0">
                      <a
                        href={() => false}
                        className="pointer-cursor badge bg-info"
                        onClick={() => {
                          setHistoryType("coinPlan");
                          setActivePage(1);
                          setsDate("ALL");
                          seteDate("ALL");
                        }}
                      >
                        Purchase Coin Plan History
                      </a>
                    </li>
                    <li className="px-2 my-2 my-md-0">
                      <a
                        href={() => false}
                        className="pointer-cursor badge bg-success"
                        onClick={() => {
                          setHistoryType("vipPlan");
                          setActivePage(1);
                          setsDate("ALL");
                          seteDate("ALL");
                        }}
                      >
                        Purchase VIP Plan History
                      </a>
                    </li>
                  </ul>
                </div>
                <div
                  id="datePicker"
                  className="collapse mt-5 pt-3"
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
                          if (
                            historyType !== "coinPlan" &&
                            historyType !== "vipPlan"
                          ) {
                            const data = {
                              userId: user._id,
                              type: historyType,
                              startDate: dayStart,
                              endDate: dayEnd,
                              start: activePage,
                              limit: rowsPerPage,
                            };
                            props.userHistory(data);
                          } else if (historyType === "coinPlan") {
                            props.coinPlanHistory(
                              user._id,
                              activePage,
                              rowsPerPage,
                              dayStart,
                              dayEnd
                            );
                          } else if (historyType === "vipPlan") {
                            props.vipPlanHistory(
                              user._id,
                              activePage,
                              rowsPerPage,
                              dayStart,
                              dayEnd
                            );
                          }
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
            <div class="card-body card-overflow pt-0">
              {(historyType === "diamond" || historyType === "rCoin") && (
                <>
                  <div className="d-flex justify-content-between mt-3">
                    {historyType === "diamond" ? (
                      <h4 className="text-white">Diamond History</h4>
                    ) : (
                      <h4 className="text-warning">RCoin History</h4>
                    )}
                    <span className="text-danger ">
                      Total Income :
                      <span className="text-info">&nbsp;{income}</span>
                      <span className="text-danger" style={{ paddingLeft: 10 }}>
                        Total Outgoing :
                        <span className="text-info">&nbsp;{outgoing}</span>
                      </span>
                    </span>
                  </div>
                  <table class="table table-striped mt-5">
                    <thead>
                      <tr>
                        <th>No</th>
                        <th>Detail</th>
                        <th>Diamond</th>
                        <th>RCoin</th>
                        <th>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.length > 0 ? (
                        data.map((data, index) => {
                          return (
                            <tr key={index}>
                              <td>{index + 1}</td>

                              {data.type === 1 && (
                                <td>
                                  <span>
                                    <img
                                      src={diamond}
                                      alt="icon"
                                      height={20}
                                      width={20}
                                    />
                                  </span>
                                  RCoin converted to diamonds
                                </td>
                              )}
                              {data.type === 2 && <td>Diamond purchase</td>}
                              {data.type === 3 && (
                                <td>
                                  <span>
                                    <img
                                      src={videocall}
                                      alt="icon"
                                      height={20}
                                      width={20}
                                    />
                                  </span>
                                  Call with&nbsp;
                                  <a
                                    href={() => false}
                                    onClick={() => handleUserInfo(data.userId)}
                                    className="pointer-cursor text-danger"
                                  >
                                    @{data.userName}
                                  </a>
                                </td>
                              )}
                              {data.type === 4 && (
                                <td>
                                  <span>
                                    <img
                                      src={ads}
                                      alt="icon"
                                      height={20}
                                      width={20}
                                    />
                                  </span>
                                  Watching ads
                                </td>
                              )}
                              {data.type === 5 && (
                                <td>
                                  <span>
                                    <img
                                      src={moneybag}
                                      alt="icon"
                                      height={20}
                                      width={20}
                                    />
                                  </span>
                                  Login bonus
                                </td>
                              )}
                              {data.type === 6 && (
                                <td>
                                  <span>
                                    <img
                                      src={moneybag}
                                      alt="icon"
                                      height={20}
                                      width={20}
                                    />
                                  </span>
                                  Referral bonus
                                </td>
                              )}
                              {data.type === 7 && (
                                <td>
                                  <span>
                                    <img
                                      src={withdraw}
                                      alt="icon"
                                      height={20}
                                      width={20}
                                    />
                                  </span>
                                  CashOut [Redeem]
                                </td>
                              )}
                              {data.type === 8 && (
                                <td>
                                  <span>
                                    <img
                                      src={male}
                                      alt="icon"
                                      height={20}
                                      width={20}
                                    />
                                  </span>
                                  By Admin
                                </td>
                              )}
                              {data.type === 0 && data.userName === null ? (
                                <td>
                                  <span>
                                    <img
                                      src={gift}
                                      alt="icon"
                                      height={20}
                                      width={20}
                                    />
                                  </span>
                                  Gift Broadcast during livestream by
                                  {user.name ? " " + user.name : " you"}
                                </td>
                              ) : data.income && data.type === 0 ? (
                                <td>
                                  <span>
                                    <img
                                      src={gift}
                                      alt="icon"
                                      height={20}
                                      width={20}
                                    />
                                  </span>
                                  gift received by @{data.userName}
                                </td>
                              ) : (
                                !data.income &&
                                data.type === 0 && (
                                  <td
                                    onClick={() => handleUserInfo(data.userId)}
                                    className="pointer-cursor"
                                  >
                                    <span>
                                      <img
                                        src={gift}
                                        alt="icon"
                                        height={20}
                                        width={20}
                                      />
                                    </span>
                                    gift send to @{data.userName}
                                  </td>
                                )
                              )}

                              {data.diamond ? (
                                data.income ? (
                                  data.diamond !== 0 ? (
                                    <td className="text-success">
                                      +{data.diamond}
                                    </td>
                                  ) : (
                                    <td>{data.diamond}</td>
                                  )
                                ) : data.diamond !== 0 ? (
                                  <td className="text-red">-{data.diamond}</td>
                                ) : (
                                  <td>{data.diamond}</td>
                                )
                              ) : (
                                <td>-</td>
                              )}

                              {data.rCoin ? (
                                data.income ? (
                                  data.rCoin !== 0 ? (
                                    <td className="text-success">
                                      +{data.rCoin}
                                    </td>
                                  ) : (
                                    <td>{data.rCoin}</td>
                                  )
                                ) : data.rCoin !== 0 ? (
                                  <td className="text-red">-{data.rCoin}</td>
                                ) : (
                                  <td>{data.rCoin}</td>
                                )
                              ) : (
                                <td>-</td>
                              )}

                              <td>{data.date}</td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan="5" align="center">
                            Nothing to show!!
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </>
              )}
              {historyType === "call" && (
                <>
                  <div className="d-flex justify-content-between mt-3">
                    <h4 className="text-danger">Call History</h4>
                    <span className="text-danger ">
                      Total Call Charge :
                      <span className="text-info">&nbsp;{totalCallCharge}</span>
                    </span>
                  </div>
                  <table class="table table-striped mt-5">
                    <thead>
                      <tr>
                        <th>No</th>
                        <th>Detail</th>
                        <th>Type</th>
                        <th>Duration</th>
                        <th>Diamond</th>
                        <th>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.length > 0 ? (
                        data.map((data, index) => {
                          return (
                            <tr key={index}>
                              <td>{index + 1}</td>
                              {data.type === "Outgoing" && user.name && (
                                <td>
                                  <span>
                                    <img
                                      src={videocall}
                                      alt="icon"
                                      height={20}
                                      width={20}
                                    />
                                  </span>{" "}
                                  {user.name} Called to&nbsp;
                                  <a
                                    href={() => false}
                                    onClick={() => handleUserInfo(data.userId)}
                                    className="pointer-cursor text-danger"
                                  >
                                    @{data.userName}
                                  </a>
                                </td>
                              )}
                              {data.type === "Outgoing" && !user.name && (
                                <td>
                                  <span>
                                    <img
                                      src={videocall}
                                      alt="icon"
                                      height={20}
                                      width={20}
                                    />
                                  </span>
                                  You Called to &nbsp;
                                  <a
                                    href={() => false}
                                    onClick={() => handleUserInfo(data.userId)}
                                    className="pointer-cursor text-danger"
                                  >
                                    @{data.userName}
                                  </a>
                                </td>
                              )}
                              {data.type === "Incoming" && user.name && (
                                <td>
                                  <a
                                    href={() => false}
                                    onClick={() => handleUserInfo(data.userId)}
                                    className="pointer-cursor text-danger"
                                  >
                                    <span>
                                      <img
                                        src={videocall}
                                        alt="diamond"
                                        height={20}
                                        width={20}
                                      />
                                    </span>{" "}
                                    @{data.userName}
                                  </a>{" "}
                                  Called {user.name}
                                </td>
                              )}
                              {data.type === "Incoming" && !user.name && (
                                <td>
                                  {" "}
                                  <a
                                    href={() => false}
                                    onClick={() => handleUserInfo(data.userId)}
                                    className="pointer-cursor text-danger"
                                  >
                                    <span>
                                      <img
                                        src={gift}
                                        alt="icon"
                                        height={20}
                                        width={20}
                                      />
                                    </span>{" "}
                                    @{data.userName}
                                  </a>{" "}
                                  Called You
                                </td>
                              )}
                              {data.type === "MissedCall" && (
                                <td>
                                  {" "}
                                  <a
                                    href={() => false}
                                    onClick={() => handleUserInfo(data.userId)}
                                    className="pointer-cursor text-danger"
                                  >
                                    📞 @{data.userName}
                                  </a>{" "}
                                  [MissedCall]
                                </td>
                              )}

                              {data.type === "Outgoing" && (
                                <td className="text-info">{data.type}</td>
                              )}
                              {data.type === "Incoming" && (
                                <td className="text-success">{data.type}</td>
                              )}
                              {data.type === "MissedCall" && (
                                <td className="text-red">{data.type}</td>
                              )}
                              <td>
                                {data.callConnect
                                  ? moment
                                      .utc(
                                        moment(new Date(data.callEndTime)).diff(
                                          moment(new Date(data.callStartTime))
                                        )
                                      )
                                      .format("HH:mm:ss")
                                  : "00:00:00"}
                              </td>

                              {data.callConnect && data.type === "Outgoing" ? (
                                <td className="text-red">-{data.diamond}</td>
                              ) : (
                                <td>0</td>
                              )}

                              <td>{data.date}</td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan="6" align="center">
                            Nothing to show!!
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </>
              )}
              {historyType === "liveStreaming" && (
                <>
                  <div className="d-flex justify-content-between mt-3">
                    <h4 className="text-primary">LiveStreaming History</h4>
                    <span className="text-danger ">
                      Total Income :
                      <span className="text-info">
                        &nbsp;{liveStreamingIncome}
                      </span>
                    </span>
                  </div>
                  <table class="table table-striped mt-5">
                    <thead>
                      <tr>
                        <th>No</th>
                        <th>Date</th>
                        <th>Duration</th>
                        <th>Joined User</th>
                        <th>Received Gift</th>
                        <th>Received RCoin</th>
                        <th>Comments</th>
                        <th>Increased Follower</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.length > 0 ? (
                        data.map((data, index) => {
                          return (
                            <tr key={index}>
                              <td>{index + 1}</td>
                              <td>{data.startTime}</td>
                              <td>
                                {data.endTime && data.startTime
                                  ? moment
                                      .utc(
                                        moment(new Date(data.endTime)).diff(
                                          moment(new Date(data.startTime))
                                        )
                                      )
                                      .format("HH:mm:ss")
                                  : "00:00:00"}
                              </td>
                              <td className="text-center text-primary">
                                {data.user}
                              </td>
                              <td className="text-center text-info">
                                {data.gifts}
                              </td>
                              <td className="text-center text-warning">
                                {data.rCoin}
                              </td>
                              <td className="text-center text-success">
                                {data.comments}
                              </td>
                              <td className="text-center text-danger">
                                {data.fans}
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan="8" align="center">
                            Nothing to show!!
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </>
              )}
              {historyType === "coinPlan" && (
                <>
                  <div className="d-flex justify-content-between mt-3">
                    <h4 className="text-primary">Purchase Coin Plan History</h4>
                  </div>
                  <PurchaseCoinPlan data={data} />
                </>
              )}
              {historyType === "vipPlan" && (
                <>
                  <div className="d-flex justify-content-between mt-3">
                    <h4 className="text-primary">Purchase Vip Plan History</h4>
                  </div>
                  <PurchaseVipPlan data={data} />
                </>
              )}
              <Pagination
                activePage={activePage}
                rowsPerPage={rowsPerPage}
                userTotal={
                  historyType === "coinPlan"
                    ? totalPlan
                    : historyType === "vipPlan"
                    ? totalVipPlan
                    : totalHistoryUser
                }
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

export default connect(null, { userHistory, coinPlanHistory, vipPlanHistory })(
  UserHistory
);
