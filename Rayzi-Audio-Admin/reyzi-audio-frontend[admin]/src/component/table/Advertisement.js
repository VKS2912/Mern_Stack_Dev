import React, { useEffect, useState } from "react";
import { connect, useSelector } from "react-redux";
import { Link } from "react-router-dom";

// action
import { getSetting } from "../../store/setting/action";
import {
  getAdvertisement,
  editAdvertisement,
  showAdvertisement,
} from "../../store/advertisement/action";

import { permissionError } from "../../util/Alert";

const Advertisement = (props) => {
  const hasPermission = useSelector((state) => state.admin.admin.flag);

  const [mongoId, setMongoId] = useState("");
  const [native, setNative] = useState(null);
  const [banner, setBanner] = useState(null);
  const [reward, setReward] = useState(null);
  const [interstitial, setInterstitial] = useState(null);
  const [freeDiamondForAd, setFreeDiamondForAd] = useState(0);
  const [maxAdPerDay, setMaxAdPerDay] = useState(0);
  const [show, setShow] = useState(false);

  const [errors, setError] = useState({
    freeDiamondForAd: "",
    maxAdPerDay: "",
  });

  useEffect(() => {
    props.getSetting();
    props.getAdvertisement(); // eslint-disable-next-line
  }, []);

  const setting = useSelector((state) => state.setting.setting);
  const google = useSelector((state) => state.advertisement.google);

  useEffect(() => {
    if (setting) {
      setFreeDiamondForAd(setting?.freeDiamondForAd);
      setMaxAdPerDay(setting?.maxAdPerDay);
    }
  }, [setting]);

  useEffect(() => {
    setError({
      freeDiamondForAd: "",
      maxAdPerDay: "",
    });
    if (google) {
      setMongoId(google?._id);
      setNative(google?.native);
      setBanner(google?.banner);
      setInterstitial(google?.interstitial);
      setReward(google?.reward);
      setShow(google?.show);
    }
  }, [google]);

  const handleSubmit = () => {
    if (!hasPermission) return permissionError();

    const diamondValid = isNumeric(freeDiamondForAd);
    if (!diamondValid) {
      return setError({ ...errors, freeDiamondForAd: "Invalid Diamond!!" });
    }
    const maxAdValid = isNumeric(maxAdPerDay);
    if (!maxAdValid) {
      return setError({ ...errors, maxAdPerDay: "Invalid Value!!" });
    }

    const data = {
      native,
      reward,
      interstitial,
      banner,
      freeDiamondForAd,
      maxAdPerDay,
      settingId: setting ? setting._id : "",
    };

    props.editAdvertisement(mongoId, data);
  };

  const handleGoogleShow = () => {
    props.showAdvertisement(mongoId);
  };

  const isNumeric = (value) => {
    const val = value === "" ? 0 : value;
    const validNumber = /^\d+$/.test(val);
    return validNumber;
  };

  return (
    <>
      <div className="page-title">
        <div className="row">
          <div className="col-12 col-md-6 order-md-1 order-last">
            <h3 className="text-white">Google Advertisement</h3>
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
                  Setting
                </li>
              </ol>
            </nav>
          </div>
        </div>
      </div>

      <div className="row">
        <div class="col-md-12 col-12">
          <div class="card">
            <div class="card-body">
              <div class="row">
                <h5 class="card-title d-flex justify-content-between mb-3">
                  Google Ad Show
                  <label class="switch">
                    <input
                      type="checkbox"
                      checked={show}
                      onChange={handleGoogleShow}
                    />
                    <span class="slider">
                      <p
                        style={{
                          fontSize: 12,
                          marginLeft: `${show ? "7px" : "35px"}`,
                          color: `${show ? "#fff" : "#000"}`,
                          marginTop: "6px",
                        }}
                      >
                        {show ? "Yes" : "No"}
                      </p>
                    </span>
                  </label>
                </h5>
                <form>
                  {/* <div class="mb-3">
                    <label for="native" class="form-label">
                      Native
                    </label>
                    <input
                      type="text"
                      class="form-control"
                      id="native"
                      value={native}
                      onChange={(e) => setNative(e.target.value)}
                    />
                  </div> */}
                  <div class="mb-3">
                    <label for="reward" class="form-label">
                      Reward
                    </label>
                    <input
                      type="text"
                      class="form-control"
                      id="reward"
                      value={reward}
                      onChange={(e) => setReward(e.target.value)}
                    />
                  </div>
                  {/* <div class="mb-3">
                    <label for="interstitial" class="form-label">
                      Interstitial
                    </label>
                    <input
                      type="text"
                      class="form-control"
                      id="interstitial"
                      value={interstitial}
                      onChange={(e) => setInterstitial(e.target.value)}
                    />
                  </div> */}
                  {/* <div class="mb-3">
                    <label for="banner" class="form-label">
                      Banner
                    </label>
                    <input
                      type="text"
                      class="form-control"
                      id="banner"
                      value={banner}
                      onChange={(e) => setBanner(e.target.value)}
                    />
                  </div> */}
                  <div class="mb-3 row">
                    <div class="col-md-6">
                      <label for="freeDiamondForAd" class="form-label">
                        Free diamond for Advertisement
                      </label>
                      <input
                        type="Number"
                        class="form-control"
                        id="freeDiamondForAd"
                        value={freeDiamondForAd}
                        onChange={(e) => setFreeDiamondForAd(e.target.value)}
                      />
                      {errors.freeDiamondForAd && (
                        <div className="ml-2 mt-1">
                          {errors.freeDiamondForAd && (
                            <div className="pl-1 text__left">
                              <span className="text-red">
                                {errors.freeDiamondForAd}
                              </span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    <div class="col-md-6">
                      <label for="maxAdPerDay" class="form-label">
                        Maximum Advertisement per day
                      </label>
                      <input
                        type="Number"
                        class="form-control"
                        id="maxAdPerDay"
                        value={maxAdPerDay}
                        onChange={(e) => setMaxAdPerDay(e.target.value)}
                      />
                      {errors.maxAdPerDay && (
                        <div className="ml-2 mt-1">
                          {errors.maxAdPerDay && (
                            <div className="pl-1 text__left">
                              <span className="text-red">
                                {errors.maxAdPerDay}
                              </span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="d-flex justify-content-end">
                    <button
                      type="button"
                      class="btn btn-danger "
                      onClick={handleSubmit}
                    >
                      Submit
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default connect(null, {
  getSetting,
  getAdvertisement,
  editAdvertisement,
  showAdvertisement,
})(Advertisement);
