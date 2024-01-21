/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { Chart as ChartJS } from "chart.js/auto";
import { Line, Doughnut, Chart } from "react-chartjs-2";

//dayjs
import dayjs from "dayjs";

//datepicker
import DateRangePicker from "react-bootstrap-daterangepicker";
import "bootstrap-daterangepicker/daterangepicker.css";

// action
import { getDashboard, getAnalytic } from "../store/dashboard/action";
import { getSetting } from "../store/setting/action";
import { connect, useSelector } from "react-redux";

// Register the date adapter

const Dashboard = (props) => {
  let label = [];
  let data = [];
  let data1 = [];
  const [type, setType] = useState("USER");

  const dashboard = useSelector((state) => state.dashboard.dashboard);
  const analytic = useSelector((state) => state.dashboard.analytic);
  const setting = useSelector((state) => state.setting.setting);

  var date = new Date();
  var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
  var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);

  const startDate = dayjs(firstDay).format("YYYY-MM-DD");
  const endDate = dayjs(lastDay).format("YYYY-MM-DD");
  const [sDate, setSDate] = useState(startDate);
  const [eDate, setEDate] = useState(endDate);
  const [analyticData, setAnalyticData] = useState([]);

  useEffect(() => {
    props.getDashboard();
    props.getSetting();
    props.getAnalytic("USER", sDate, eDate); //eslint-disable-next-line
  }, []);

  useEffect(() => {
    setAnalyticData(analytic);
  }, [analytic]);

  if (analyticData.length > 0) {
    if (type === "REVENUE" && analyticData.length === 1) {
      //eslint-disable-next-line
      analyticData[0]?.coinRevenue?.map((date) => {
        label.push(date._id);
      });
      //eslint-disable-next-line
      analyticData[0]?.vipRevenue?.map((date) => {
        label.push(date._id);
      });
      const uniqLabel = [...new Set(label)];
      //eslint-disable-next-line
      uniqLabel.map((data__) => {
        const count = analyticData[0]?.coinRevenue?.find(
          (element) => element._id === data__
        );
        if (count) {
          data.push(setting.currency === "$" ? count.dollar : count.rupee);
        } else {
          data.push(0);
        }
        const count_ = analyticData[0]?.vipRevenue?.find(
          (element) => element._id === data__
        );
        if (count_) {
          data1.push(setting.currency === "$" ? count_.dollar : count_.rupee);
        } else {
          data1.push(0);
        }
      });
    } else {
      //eslint-disable-next-line
      analyticData.map((data_) => {
        label.push(data_._id);
        data.push(data_.count);
      });
    }
  }

  const handleAnalytic = (type) => {
    setSDate(startDate);
    setEDate(endDate);
    setType(type);
    if (type !== "ACTIVE USER") {
      props.getAnalytic(type, startDate, endDate);
    }
  };
const labelFormate=label?.map(item=>dayjs(item).format("DD-MM-YYYY"))
console.log("labelFormate",labelFormate);
  const chartData = {
    labels: labelFormate,
    datasets: [
      {
        label: type?.toUpperCase(),
        data: data,
        fill: true,
        backgroundColor: "rgba(255, 99, 132, 0.1)",
        borderColor: "rgb(255, 99, 132)",
        lineTension: 0.5,
      },
    ],
  };
  const multiLineChartData = {
    labels: labelFormate,
    datasets: [
      {
        label: "Coin Revenue",
        data: data,
        fill: true,
        backgroundColor: "rgba(255, 99, 132, 0.1)",
        borderColor: "rgb(255, 99, 132)",
        lineTension: 0.5,
      },
      {
        label: "VIP Revenue",
        data: data1,
        fill: true,
        backgroundColor: "rgb(205,235,255,0.1)",
        borderColor: "#68B9F0",
        lineTension: 0.5,
      },
    ],
  };
  

  const optionsLine = {
  responsive: true,
  scales: {
    // x: {
    //   type: 'time',
    //   time: {
    //       parser: 'dd-mm-yyyy',
    //     tooltipFormat: 'dd-mm-yyyy',
    //     unit: 'day',
    //   },
    //   title: {
    //     display: true,
    //     text: 'Date',
    //   },
    // },
    y: {
      // Other Y-axis configuration options go here
    },
  },
};
// chartData.labels = chartData.labels.map((date) =>
//   dayjs(date).format('DD-MM-YYYY')
// );

// multiLineChartData.labels = multiLineChartData.labels.map((date) =>
//   dayjs(date).format('DD-MM-YYYY')
// );

  const pieChartData = {
    maintainAspectRatio: false,
    responsive: false,
    labels: ["Total User", "Active User"],
    datasets: [
      {
        data: [dashboard.totalUser, dashboard.activeUser],
        backgroundColor: ["#e8538f", "#fc9494",],
        hoverBackgroundColor: ["#e8538f", "#fc9494"],
      },
    ],
  };

  //Apply button function for analytic
  const handleApply = (event, picker) => {
    picker.element.val(
      picker.startDate.format("YYYY-MM-DD") +
        " - " +
        picker.endDate.format("YYYY-MM-DD")
    );
    const dayStart = dayjs(picker.startDate).format("YYYY-MM-DD");

    const dayEnd = dayjs(picker.endDate).format("YYYY-MM-DD");

    setSDate(dayStart);
    setEDate(dayEnd);

    props.getAnalytic(type, dayStart, dayEnd);
  };

  //Cancel button function for analytic
  const handleCancel = (event, picker) => {
    picker.element.val("");

    props.getAnalytic(type, startDate, endDate);
  };

  return (
    <>
      <div className="page-title">
        <div className="row">
          <div className="col-12 col-md-6 order-md-1 order-last">
            <h3 className="mb-3 text-white">Dashboard</h3>
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
              </ol>
            </nav>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-lg-12 col-md-2 col-sm-12">
          <div class="row">
            <div class="col-lg-3">
              <div class="card stats-card">
                <div
                  class="card-body pointer-cursor"
                  
                  onClick={() => handleAnalytic("USER")}
                >
                  <div class="stats-info">
                    <h5 class="card-title">
                      {dashboard.totalUser ? dashboard.totalUser : 0}
                      {/* <span class="stats-change stats-change-danger">-8%</span> */}
                    </h5>
                    <p class="stats-text">Total User</p>
                  </div>
                  <div class="stats-icon change-danger">
                    <i class="material-icons">people_alt</i>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-lg-3">
              <div class="card stats-card">
                <div
                  class="card-body pointer-cursor"
                  onClick={() => handleAnalytic("LIVE USER")}
                >
                  <div class="stats-info">
                    <h5 class="card-title">
                      {dashboard.liveUser ? dashboard.liveUser : 0}
                      {/* <span class="stats-change stats-change-danger">-8%</span> */}
                    </h5>
                    <p class="stats-text">Total Live User</p>
                  </div>
                  <div class="stats-icon change-success">
                    <i class="material-icons">perm_identity</i>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-lg-3">
              <div class="card stats-card">
                <div
                  class="card-body pointer-cursor"
                  onClick={() => handleAnalytic("ACTIVE USER")}
                >
                  <div class="stats-info">
                    <h5 class="card-title">
                      {dashboard.activeUser ? dashboard.activeUser : 0}
                    </h5>
                    <p class="stats-text">Total Active User</p>
                  </div>
                  <div class="stats-icon change-pink">
                    <i class="material-icons">group</i>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-lg-3">
              <div class="card stats-card">
                <div
                  class="card-body pointer-cursor"
                  onClick={() => handleAnalytic("VIP")}
                >
                  <div class="stats-info">
                    <h5 class="card-title">
                      {dashboard.vipUser ? dashboard.vipUser : 0}
                    </h5>
                    <p class="stats-text">Total VIP User</p>
                  </div>
                  <div class="stats-icon change-danger">
                    <i class="material-icons">settings_accessibility</i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-lg-12 col-md-2 col-sm-12">
          <div class="row">
            <div class="col-lg-3">
              <div class="card stats-card">
                <div
                  class="card-body pointer-cursor"
                  onClick={() => handleAnalytic("REVENUE")}
                >
                  <div class="stats-info">
                    <h5 class="card-title">
                      {dashboard.revenue
                        ? setting.currency === "$"
                          ? dashboard.revenue?.dollar
                          : dashboard.revenue?.rupee
                        : 0}
                      {setting.currency}
                      {/* <span class="stats-change stats-change-danger">-8%</span> */}
                    </h5>
                    <p class="stats-text">Total Revenue</p>
                  </div>
                  <div class="stats-icon change-success">
                    <i class="material-icons">account_balance_wallet</i>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-lg-3">
              <div class="card stats-card">
                <div
                  class="card-body pointer-cursor"
                  onClick={() => handleAnalytic("POST")}
                >
                  <div class="stats-info">
                    <h5 class="card-title">
                      {dashboard.post ? dashboard.post : 0}
                    </h5>
                    <p class="stats-text">Total Post</p>
                  </div>
                  <div class="stats-icon change-pink">
                    <i class="material-icons">post_add</i>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-lg-3">
              <div class="card stats-card">
                <div
                  class="card-body pointer-cursor"
                  onClick={() => handleAnalytic("VIDEO")}
                >
                  <div class="stats-info">
                    <h5 class="card-title">
                      {dashboard.video ? dashboard.video : 0}
                    </h5>
                    <p class="stats-text">Total Video</p>
                  </div>
                  <div class="stats-icon change-danger">
                    <i class="material-icons">voice_chat</i>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-lg-3">
              <div class="card stats-card">
                <div
                  class="card-body pointer-cursor"
                  onClick={() => handleAnalytic("REPORT")}
                >
                  <div class="stats-info">
                    <h5 class="card-title">
                      {dashboard.report ? dashboard.report : 0}
                    </h5>
                    <p class="stats-text">Total Report User</p>
                  </div>
                  <div class="stats-icon change-success">
                    <i class="material-icons">next_plan</i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* chart */}
      <h4 className="text-white">{type?.toUpperCase()}</h4>
      {type === "ACTIVE USER" ? (
        <div class="pie mt-3">
          <Doughnut data={pieChartData} options={{ responsive: true }} />
        </div>
      ) : type === "REVENUE" ? (
        data.length > 1 ? (
          <div class="pie mt-3">
            <div className="d-flex justify-content-end">
              <DateRangePicker
                initialSettings={{
                  autoUpdateInput: false,
                  locale: {
                    cancelLabel: "Clear",
                  },
                  startDate:  dayjs(startDate).format("M/DD/YYYY"),
                  endDate:  dayjs(endDate).format("M/DD/YYYY"),
                  maxDate: new Date(),
                }}
                onApply={handleApply}
                onCancel={handleCancel}
              >
                <input
                  type="text"
                  class="form-control float-left"
                  placeholder="Select Date"
                  style={{ width: 180, fontWeight: 700 }}
                />
              </DateRangePicker>
            </div>
            <Line data={multiLineChartData} options={optionsLine} />
          </div>
        ) : (
          <p className="text-center">Chart not Available</p>
        )
      ) : data.length > 1 ? (
        <div class="rows mt-3">
          <div className="d-flex justify-content-end">
            <DateRangePicker
              initialSettings={{
                autoUpdateInput: false,
                locale: {
                  cancelLabel: "Clear",
                },
                startDate: dayjs(startDate).format("M/DD/YYYY"),
                endDate: dayjs(endDate).format("M/DD/YYYY"),
                maxDate: new Date(),
              }}
              onApply={handleApply}
              onCancel={handleCancel}
            >
              <input
                type="text"
                class="form-control float-left"
                placeholder="Select Date"
                style={{ width: 180, fontWeight: 700 }}
              />
            </DateRangePicker>
          </div>
          <Line data={chartData} options={optionsLine} />
        </div>
      ) : (
        <p className="text-center">Chart not Available</p>
      )}
    </>
  );
};

export default connect(null, { getDashboard, getSetting, getAnalytic })(
  Dashboard
);
