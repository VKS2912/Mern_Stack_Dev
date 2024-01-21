import React, { useEffect, useState } from "react";
import { connect, useSelector } from "react-redux";
import { Link } from "react-router-dom";

//Multi Select Dropdown
import Multiselect from "multiselect-react-dropdown";

// action
import {
  getSetting,
  updateSetting,
  handleSwitch,
} from "../store/setting/action";

import { permissionError } from "../util/Alert";

const Setting = (props) => {
  const hasPermission = useSelector((state) => state.admin.admin.flag);

  const [mongoId, setMongoId] = useState("");
  const [referralBonus, setReferralBonus] = useState(0);
  const [loginBonus, setLoginBonus] = useState(0);
  const [agoraKey, setAgoraKey] = useState("");
  const [agoraCertificate, setAgoraCertificate] = useState("");
  const [maxSecondForVideo, setMaxSecondForVideo] = useState(0);
  const [privacyPolicyLink, setPrivacyPolicyLink] = useState("");
  const [privacyPolicyText, setPrivacyPolicyText] = useState("");
  // const [chatCharge, setChatCharge] = useState("");
  const [callCharge, setCallCharge] = useState(0);
  const [googlePlayEmail, setGooglePlayEmail] = useState("");
  const [googlePlayKey, setGooglePlayKey] = useState("");
  const [stripePublishableKey, setStripePublishableKey] = useState("");
  const [stripeSecretKey, setStripeSecretKey] = useState("");
  const [currency, setCurrency] = useState("$");
  const [rCoinForCaseOut, setRCoinForCaseOut] = useState(0);
  const [rCoinForDiamond, setRCoinForDiamond] = useState(0);

  const [googlePlaySwitch, setGooglePlaySwitch] = useState(false);
  const [stripeSwitch, setStripeSwitch] = useState(false);
  const [isAppActive, setIsAppActive] = useState(false);

  const [minRCoinForCaseOut, setMinRCoinForCaseOut] = useState(0);
  const [paymentGateway, setPaymentGateway] = useState([]);
  const [selectedValue, setSelectedValue] = useState([]);
  const [errors, setError] = useState({
    referralBonus: "",
    loginBonus: "",
    maxSecondForVideo: "",
    callCharge: "",
    rCoinForCaseOut: "",
    rCoinForDiamond: "",
    minRCoinForCaseOut: "",
  });

  useEffect(() => {
    props.getSetting(); // eslint-disable-next-line
  }, []);

  const setting = useSelector((state) => state.setting.setting);

  useEffect(() => {
    setError({
      referralBonus: "",
      loginBonus: "",
      maxSecondForVideo: "",
      callCharge: "",
      rCoinForCaseOut: "",
      rCoinForDiamond: "",
      minRCoinForCaseOut: "",
    });
    if (setting) {
      const data = setting?.paymentGateway?.map((data) => {
        return {
          name: data,
        };
      });

      setMongoId(setting._id);
      setReferralBonus(setting.referralBonus);
      setAgoraKey(setting.agoraKey);
      setAgoraCertificate(setting.agoraCertificate);
      setMaxSecondForVideo(setting.maxSecondForVideo);
      setPrivacyPolicyLink(setting.privacyPolicyLink);
      setPrivacyPolicyText(setting.privacyPolicyText);
      // setChatCharge(setting.chatCharge);
      setCallCharge(setting.callCharge);
      setGooglePlayEmail(setting.googlePlayEmail);
      setGooglePlayKey(setting.googlePlayKey);
      setStripePublishableKey(setting.stripePublishableKey);
      setStripeSecretKey(setting.stripeSecretKey);
      setCurrency(setting.currency);
      setRCoinForCaseOut(setting.rCoinForCashOut);
      setRCoinForDiamond(setting.rCoinForDiamond);
      setGooglePlaySwitch(setting.googlePlaySwitch);
      setStripeSwitch(setting.stripeSwitch);
      setIsAppActive(setting.isAppActive);
      setLoginBonus(setting.loginBonus);
      setMinRCoinForCaseOut(setting.minRcoinForCashOut);
      setPaymentGateway(setting.paymentGateway);

      setSelectedValue(data);
    }
  }, [setting]);

  const handleSubmit = () => {
    if (!hasPermission) return permissionError();

    const referralBonusValid = isNumeric(referralBonus);
    if (!referralBonusValid) {
      return setError({ ...errors, referralBonus: "Invalid Referral Bonus!!" });
    }
    const loginBonusValid = isNumeric(loginBonus);
    if (!loginBonusValid) {
      return setError({ ...errors, loginBonus: "Invalid Login Bonus!!" });
    }
    const maxSecondForVideoValid = isNumeric(maxSecondForVideo);
    if (!maxSecondForVideoValid) {
      return setError({
        ...errors,
        maxSecondForVideo: "Invalid Value!!",
      });
    }
    const callChargeValid = isNumeric(callCharge);
    if (!callChargeValid) {
      return setError({
        ...errors,
        callCharge: "Invalid Call Charge!!",
      });
    }
    const rCoinForCaseOutValid = isNumeric(rCoinForCaseOut);
    if (!rCoinForCaseOutValid) {
      return setError({
        ...errors,
        rCoinForCaseOut: "Invalid Value!!",
      });
    }
    const rCoinForDiamondValid = isNumeric(rCoinForDiamond);
    if (!rCoinForDiamondValid) {
      return setError({
        ...errors,
        rCoinForDiamond: "Invalid Value!!",
      });
    }

    const minRCoinForCaseOutValid = isNumeric(minRCoinForCaseOut);
    if (!minRCoinForCaseOutValid) {
      return setError({
        ...errors,
        minRCoinForCaseOut: "Invalid Value!!",
      });
    }

    const data = {
      referralBonus,
      loginBonus,
      agoraKey,
      agoraCertificate,
      maxSecondForVideo: maxSecondForVideo === "" ? 0 : maxSecondForVideo,
      privacyPolicyLink,
      privacyPolicyText,
      // chatCharge: chatCharge === "" ? 0 : chatCharge,
      chatCharge: 0,
      callCharge: callCharge === "" ? 0 : callCharge,
      googlePlayEmail,
      googlePlayKey,
      stripePublishableKey,
      stripeSecretKey,
      currency,
      rCoinForCaseOut: rCoinForCaseOut === "" ? 0 : rCoinForCaseOut,
      rCoinForDiamond: rCoinForDiamond === "" ? 1 : rCoinForDiamond,
      paymentGateway,
      minRcoinForCaseOut: minRCoinForCaseOut,
    };

    props.updateSetting(mongoId, data);
  };

  const handleSwitch_ = (type) => {
    if (!hasPermission) return permissionError();

    props.handleSwitch(mongoId, type);
  };

  //onselect function of selecting multiple values
  function onSelect(selectedList, selectedItem) {
    paymentGateway.push(selectedItem.name);
  }

  //onRemove function for remove multiple values
  function onRemove(selectedList, removedItem) {
    setPaymentGateway(selectedList.map((data) => data.name));
  }

  const isNumeric = (value) => {
    const val = value === "" ? 0 : value;
    const validNumber = /^\d+$/.test(val);
    return validNumber;
  };

  const option = [{ name: "UPI" }, { name: "Paytm" }, { name: "Banking" }];

  return (
    <>
      <div className="page-title">
        <div className="row">
          <div className="col-12 col-md-6 order-md-1 order-last">
            <h3 className="mb-3 text-white">Setting</h3>
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
        <div class="col-md-6 col-12">
          <div class="card">
            <div class="card-body">
              <div class="row">
                <h5 class="card-title ">Other Setting</h5>

                <form>
                  <div class="mb-3 row">
                    <div class="col-md-6">
                      <label for="referralBonus" class="form-label">
                        Referral Bonus
                      </label>
                      <input
                        type="number"
                        class="form-control"
                        id="referralBonus"
                        value={referralBonus}
                        onChange={(e) => setReferralBonus(e.target.value)}
                      />
                      {errors.referralBonus && (
                        <div className="ml-2 mt-1">
                          {errors.referralBonus && (
                            <div className="pl-1 text__left">
                              <span className="text-red">
                                {errors.referralBonus}
                              </span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    <div class="col-md-6">
                      <label for="loginBonus" class="form-label">
                        Login Bonus
                      </label>
                      <input
                        type="number"
                        class="form-control"
                        id="loginBonus"
                        value={loginBonus}
                        onChange={(e) => setLoginBonus(e.target.value)}
                      />
                      {errors.loginBonus && (
                        <div className="ml-2 mt-1">
                          {errors.loginBonus && (
                            <div className="pl-1 text__left">
                              <span className="text-red">
                                {errors.loginBonus}
                              </span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  <div class="mb-3">
                    <label for="videoSecond" class="form-label">
                      Maximum Seconds for Video
                    </label>
                    <input
                      type="number"
                      class="form-control"
                      id="videoSecond"
                      value={maxSecondForVideo}
                      onChange={(e) => setMaxSecondForVideo(e.target.value)}
                    />
                    {errors.maxSecondForVideo && (
                      <div className="ml-2 mt-1">
                        {errors.maxSecondForVideo && (
                          <div className="pl-1 text__left">
                            <span className="text-red">
                              {errors.maxSecondForVideo}
                            </span>
                          </div>
                        )}
                      </div>
                    )}
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
        <div class="col-md-6 col-12">
          <div class="card">
            <div class="card-body">
              <div class="row">
                <h5 class="card-title d-flex justify-content-between mb-3">
                  Is App Active
                  <label class="switch">
                    <input
                      type="checkbox"
                      checked={isAppActive}
                      onChange={() => handleSwitch_("app active")}
                    />
                    <span class="slider">
                      <p
                        style={{
                          fontSize: 12,
                          marginLeft: `${isAppActive ? "7px" : "35px"}`,
                          color: `${isAppActive ? "#fff" : "#000"}`,
                          marginTop: "6px",
                        }}
                      >
                        {isAppActive ? "Yes" : "No"}
                      </p>
                    </span>
                  </label>
                </h5>

                <form>
                  <div class="mb-3">
                    <label for="policyLink" class="form-label">
                      Privacy Policy Link
                    </label>
                    <input
                      type="text"
                      class="form-control"
                      id="policyLink"
                      value={privacyPolicyLink}
                      onChange={(e) => setPrivacyPolicyLink(e.target.value)}
                    />
                  </div>
                  <div class="mb-3">
                    <label for="policyText" class="form-label">
                      Privacy Policy Text
                    </label>
                    <input
                      type="text"
                      class="form-control"
                      id="policyText"
                      value={privacyPolicyText}
                      onChange={(e) => setPrivacyPolicyText(e.target.value)}
                    />
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
      <h3 className="mb-3 text-white">Coin Setting</h3>
      <div class="row">
        <div class="col-md-6 col-12">
          <div class="card">
            <div class="card-body">
              <div class="row">
                <h5 class="card-title ">Charges</h5>

                <form>
                  <div className="row">
                    {/* <div className="col-md-6">
                      {" "}
                      <div class="mb-3">
                        <label for="chatCharge" class="form-label">
                          Chat Charge
                        </label>
                        <input
                          type="number"
                          class="form-control"
                          id="chatCharge"
                          value={chatCharge}
                          onChange={(e) => setChatCharge(e.target.value)}
                        />
                      </div>
                    </div> */}
                    <div className="col-md-12">
                      <div class="mb-3">
                        <label for="callCharge" class="form-label">
                          Call Charge
                        </label>
                        <input
                          type="number"
                          class="form-control"
                          id="callCharge"
                          value={callCharge}
                          onChange={(e) => setCallCharge(e.target.value)}
                        />
                        {errors.callCharge && (
                          <div className="ml-2 mt-1">
                            {errors.callCharge && (
                              <div className="pl-1 text__left">
                                <span className="text-red">
                                  {errors.callCharge}
                                </span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="col-md-12">
                      <div class="mb-3">
                        <label for="callCharge" class="form-label">
                          Currency
                        </label>
                        <select
                          class="form-select form-control"
                          aria-label="Default select example"
                          value={currency}
                          onChange={(e) => {
                            setCurrency(e.target.value);
                          }}
                        >
                          <option value="$" selected>
                            $
                          </option>
                          <option value="₹">₹</option>
                          {/* <option value="£">£</option> */}
                        </select>
                      </div>
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
        <div class="col-md-6 col-12">
          <div class="card">
            <div class="card-body">
              <h5 class="card-title">Coin Setup</h5>
              <form>
                <div class="mb-3 row">
                  <div className="col-5">
                    <label for="rCoin" class="form-label">
                      RCoin Rate (for cash out)
                    </label>
                    <input
                      type="text"
                      class="form-control"
                      id="rCoin"
                      value={
                        currency === "$"
                          ? "1 Dollar"
                          : currency === "₹" && "1 Rupee"
                        // : "1 GBP"
                      }
                      disabled
                    />
                  </div>
                  <div className="col-1 mt-5">=</div>
                  <div className="col-6">
                    <label for="rCoin" class="form-label">
                      How Many RCoin
                    </label>
                    <input
                      type="number"
                      class="form-control"
                      id="rCoin"
                      value={rCoinForCaseOut}
                      onChange={(e) => setRCoinForCaseOut(e.target.value)}
                    />
                    {errors.rCoinForCaseOut && (
                      <div className="ml-2 mt-1">
                        {errors.rCoinForCaseOut && (
                          <div className="pl-1 text__left">
                            <span className="text-red">
                              {errors.rCoinForCaseOut}
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                <div class="mb-3 row">
                  <div className="col-5">
                    <label for="rCoin" class="form-label">
                      Diamond
                    </label>
                    <input
                      type="text"
                      class="form-control"
                      id="rCoin"
                      value="1 Diamond"
                      disabled
                    />
                  </div>
                  <div className="col-1 mt-5">=</div>
                  <div className="col-6">
                    <label for="rCoin" class="form-label">
                      How Many RCoin
                    </label>
                    <input
                      type="number"
                      class="form-control"
                      id="rCoin"
                      value={rCoinForDiamond}
                      onChange={(e) => setRCoinForDiamond(e.target.value)}
                    />
                    {errors.rCoinForDiamond && (
                      <div className="ml-2 mt-1">
                        {errors.rCoinForDiamond && (
                          <div className="pl-1 text__left">
                            <span className="text-red">
                              {errors.rCoinForDiamond}
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </form>
              <div className="d-flex justify-content-end">
                <button
                  type="button"
                  class="btn btn-danger "
                  onClick={handleSubmit}
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <h3 className="mb-3 text-white">Payment Setting</h3>
      <div class="row">
        <div class="col-md-6 col-12">
          <div class="card">
            <div class="card-body">
              <div class="row">
                <h5 class="card-title d-flex justify-content-between">
                  Google Play
                  <label class="switch">
                    <input
                      type="checkbox"
                      checked={googlePlaySwitch}
                      onChange={() => handleSwitch_("googlePlay")}
                    />
                    <span class="slider">
                      <p
                        style={{
                          fontSize: 12,
                          marginLeft: `${googlePlaySwitch ? "7px" : "35px"}`,
                          color: `${googlePlaySwitch ? "#fff" : "#000"}`,
                          marginTop: "6px",
                        }}
                      >
                        {googlePlaySwitch ? "Yes" : "No"}
                      </p>
                    </span>
                  </label>
                </h5>

                <form>
                  <div class="mb-3">
                    <label for="googlePlayEmail" class="form-label">
                      Google Play Email
                    </label>
                    <input
                      type="text"
                      class="form-control"
                      id="googlePlayEmail"
                      value={googlePlayEmail}
                      onChange={(e) => setGooglePlayEmail(e.target.value)}
                    />
                  </div>
                  <div class="mb-3">
                    <label for="key" class="form-label">
                      Key
                    </label>
                    <input
                      type="text"
                      class="form-control"
                      id="key"
                      value={googlePlayKey}
                      onChange={(e) => setGooglePlayKey(e.target.value)}
                    />
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
        <div class="col-md-6 col-12">
          <div class="card">
            <div class="card-body">
              <h5 class="card-title d-flex justify-content-between">
                Stripe
                <label class="switch">
                  <input
                    type="checkbox"
                    checked={stripeSwitch}
                    onChange={() => handleSwitch_("stripe")}
                  />
                  <span class="slider">
                    <p
                      style={{
                        fontSize: 12,
                        marginLeft: `${stripeSwitch ? "7px" : "35px"}`,
                        color: `${stripeSwitch ? "#fff" : "#000"}`,
                        marginTop: "6px",
                      }}
                    >
                      {stripeSwitch ? "Yes" : "No"}
                    </p>
                  </span>
                </label>
              </h5>
              <form>
                <div class="mb-3">
                  <label for="publishableKey" class="form-label">
                    Publishable Key
                  </label>
                  <input
                    type="text"
                    class="form-control"
                    id="publishableKey"
                    value={stripePublishableKey}
                    onChange={(e) => setStripePublishableKey(e.target.value)}
                  />
                </div>
                <div class="mb-3">
                  <label for="secretKey" class="form-label">
                    Secret Key
                  </label>
                  <input
                    type="text"
                    class="form-control"
                    id="secretKey"
                    value={stripeSecretKey}
                    onChange={(e) => setStripeSecretKey(e.target.value)}
                  />
                </div>
              </form>
              <div className="d-flex justify-content-end">
                <button
                  type="button"
                  class="btn btn-danger "
                  onClick={handleSubmit}
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-md-6">
          <h3 className="mb-3 text-white">Agora Setting</h3>
          <div class="row">
            <div class="col-md-12 col-12">
              <div class="card">
                <div class="card-body">
                  <div class="row">
                    <form>
                      <div class="mb-3">
                        <label for="googlePlayEmail" class="form-label">
                          Agora Key
                        </label>
                        <input
                          type="text"
                          class="form-control"
                          id="googlePlayEmail"
                          value={agoraKey}
                          onChange={(e) => setAgoraKey(e.target.value)}
                        />
                      </div>
                      <div class="mb-3">
                        <label for="key" class="form-label">
                          Agora Certificates
                        </label>
                        <input
                          type="text"
                          class="form-control"
                          id="key"
                          value={agoraCertificate}
                          onChange={(e) => setAgoraCertificate(e.target.value)}
                        />
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
        </div>
        <div className="col-md-6">
          <h3 className="mb-3 text-white">Redeem Setting</h3>
          <div class="row">
            <div class="col-md-12 col-12">
              <div class="card">
                <div class="card-body">
                  <div class="row">
                    <form>
                      <div class="mb-3">
                        <label for="googlePlayEmail" class="form-label">
                          Payment Gateway
                        </label>
                        <Multiselect
                          options={option} // Options to display in the dropdown
                          selectedValues={selectedValue} // Preselected value to persist in dropdown
                          onSelect={onSelect} // Function will trigger on select event
                          onRemove={onRemove} // Function will trigger on remove event
                          displayValue="name" // Property name to display in the dropdown options
                        />
                      </div>

                      <div class="mb-3">
                        <label for="minRCoinForCaseOut" class="form-label">
                          Minimum RCoin for cash out
                        </label>
                        <input
                          type="number"
                          class="form-control"
                          id="minRCoinForCaseOut"
                          value={minRCoinForCaseOut}
                          onChange={(e) =>
                            setMinRCoinForCaseOut(parseInt(e.target.value))
                          }
                        />
                        {errors.minRCoinForCaseOut && (
                          <div className="ml-2 mt-1">
                            {errors.minRCoinForCaseOut && (
                              <div className="pl-1 text__left">
                                <span className="text-red">
                                  {errors.minRCoinForCaseOut}
                                </span>
                              </div>
                            )}
                          </div>
                        )}
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
        </div>
      </div>
    </>
  );
};

export default connect(null, { getSetting, updateSetting, handleSwitch })(
  Setting
);
