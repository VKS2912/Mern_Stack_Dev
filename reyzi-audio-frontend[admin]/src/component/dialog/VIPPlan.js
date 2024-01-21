import React, { useEffect, useState } from "react";

//redux
import { connect, useDispatch, useSelector } from "react-redux";

//MUI
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Tooltip,
} from "@material-ui/core";
import { Cancel } from "@material-ui/icons";

//types
import { CLOSE_VIP_PLAN_DIALOG } from "../../store/vipPlan/types";

//action
import { createNewVIPPlan, editVIPPlan } from "../../store/vipPlan/action";

import { permissionError } from "../../util/Alert";

const VIPPlanDialog = (props) => {
  const dispatch = useDispatch();

  const { dialog: open, dialogData } = useSelector((state) => state.vipPlan);

  const hasPermission = useSelector((state) => state.admin.admin.flag);

  const [mongoId, setMongoId] = useState("");
  const [validity, setValidity] = useState("");
  const [validityType, setValidityType] = useState("");
  const [dollar, setDollar] = useState("");
  const [rupee, setRupee] = useState("");
  const [tag, setTag] = useState("");
  const [productKey, setProductKey] = useState("");
  const [name, setName] = useState("");

  const [errors, setError] = useState({
    validity: "",
    dollar: "",
    rupee: "",
    tag:"",
    productKey: "",
  });

  useEffect(() => {
    if (dialogData) {
      setMongoId(dialogData._id);
      setValidity(dialogData.validity);
      setValidityType(dialogData.validityType);
      setDollar(dialogData.dollar);
      setRupee(dialogData.rupee);
      setTag(dialogData.tag);
      setProductKey(dialogData.productKey);
      setName(dialogData.name);
    }
  }, [dialogData]);

  useEffect(
    () => () => {
      setError({
        validity: "",
        dollar: "",
        rupee: "",
        productKey: "",
        name: "",
        tag:""
      });
      setMongoId("");
      setValidity("");
      setValidityType("");
      setTag("");
      setDollar("");
      setRupee("");
      setProductKey("");
      setName("");
    },
    [open]
  );

  useEffect(() => {
    window.onbeforeunload = closePopup();
  }, []);

  const closePopup = () => {
    dispatch({ type: CLOSE_VIP_PLAN_DIALOG });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validity || !dollar || !rupee || !productKey) {
      const error = {};

      if (!validity) error.validity = "Validity is required!";
      if (!dollar) error.dollar = "Dollar is required!";
      if (!rupee) error.rupee = "Rupee is required!";
      if (!productKey) error.productKey = "Product Key is required!";

      return setError({ ...error });
    }

    const validityValid = isNumeric(validity);
    if (!validityValid) {
      return setError({ ...errors, validity: "Invalid Validity!!" });
    }
    const dollarValid = isNumeric(dollar);
    if (!dollarValid) {
      return setError({ ...errors, dollar: "Invalid Dollar!!" });
    }
    const rupeeValid = isNumeric(rupee);
    if (!rupeeValid) {
      return setError({ ...errors, rupee: "Invalid Rupee!!" });
    }
    const validateTag =
    tag.toString().includes("-") || tag.toString().includes(".");

  if (validateTag) {
    return setError({ ...errors, tag: "Invalid Validity!!" });
  }

    const data = {
      validity,
      validityType: validityType ? validityType : "day",
      dollar,
      rupee,
      tag,
      productKey,
      name,
    };
    if (!hasPermission) return permissionError();
    if (mongoId) {
      props.editVIPPlan(mongoId, data);
    } else {
      props.createNewVIPPlan(data);
    }
  };

  const isNumeric = (value) => {
    const val = value === "" ? 0 : value;
    const validNumber = /^\d+(\.\d{1,2})?$/.test(val);
    return validNumber;
  };

  return (
    <>
      <Dialog
        open={open}
        aria-labelledby="responsive-dialog-title"
        onClose={closePopup}
        disableBackdropClick
        disableEscapeKeyDown
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle id="responsive-dialog-title">
          <span className="text-danger font-weight-bold h4"> Plan </span>
        </DialogTitle>

        <IconButton
          style={{
            position: "absolute",
            right: 0,
          }}
        >
          <Tooltip title="Close">
            <Cancel className="text-danger" onClick={closePopup} />
          </Tooltip>
        </IconButton>
        <DialogContent>
          <div className="modal-body pt-1 px-1 pb-3">
            <div className="d-flex flex-column">
              <form>
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label className="text-gray mb-2">Validity</label>
                      <input
                        type="number"
                        className="form-control"
                        required=""
                        placeholder="1"
                        min="0"
                        value={validity}
                        onChange={(e) => {
                          setValidity(e.target.value);
                          if (!e.target.value) {
                            return setError({
                              ...errors,
                              validity: "Validity is Required!",
                            });
                          } else {
                            return setError({
                              ...errors,
                              validity: "",
                            });
                          }
                        }}
                      />
                      {errors.validity && (
                        <div className="ml-2 mt-1">
                          {errors.validity && (
                            <div className="pl-1 text__left">
                              <span className="text-red">
                                {errors.validity}
                              </span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label className="text-gray mb-2">Validity Type</label>
                      <select
                        class="form-select form-control"
                        aria-label="Default select example"
                        value={validityType}
                        onChange={(e) => {
                          setValidityType(e.target.value);
                        }}
                      >
                        <option value="day" selected>
                          Day
                        </option>
                        <option value="month">Month</option>
                        <option value="year">Year</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="form-group mt-4">
                  <label className="mb-2 text-gray">Product Key</label>
                  <input
                    type="text"
                    className="form-control"
                    required=""
                    placeholder="android.test.purchased"
                    value={productKey}
                    onChange={(e) => {
                      setProductKey(e.target.value);
                      if (!e.target.value) {
                        return setError({
                          ...errors,
                          productKey: "Product Key is Required !",
                        });
                      } else {
                        return setError({
                          ...errors,
                          productKey: "",
                        });
                      }
                    }}
                  />
                  {errors.productKey && (
                    <div className="ml-2 mt-1">
                      {errors.productKey && (
                        <div className="pl-1 text__left">
                          <span className="text-red">{errors.productKey}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group mt-4">
                      <label className="text-gray mb-2">Dollar</label>
                      <input
                        type="number"
                        className="form-control"
                        required=""
                        min="0"
                        placeholder="10"
                        value={dollar}
                        onChange={(e) => {
                          setDollar(e.target.value);
                          if (!e.target.value) {
                            return setError({
                              ...errors,
                              dollar: "Dollar is Required !",
                            });
                          } else {
                            return setError({
                              ...errors,
                              dollar: "",
                            });
                          }
                        }}
                      />
                      {errors.dollar && (
                        <div className="ml-2 mt-1">
                          {errors.dollar && (
                            <div className="pl-1 text__left">
                              <span className="text-red">{errors.dollar}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group mt-4">
                      <label className="text-gray mb-2">Rupee</label>
                      <input
                        type="number"
                        className="form-control"
                        required=""
                        placeholder="100"
                        min="0"
                        value={rupee}
                        onChange={(e) => {
                          setRupee(e.target.value);
                          if (!e.target.value) {
                            return setError({
                              ...errors,
                              rupee: "Rupee is Required !",
                            });
                          } else {
                            return setError({
                              ...errors,
                              rupee: "",
                            });
                          }
                        }}
                      />
                      {errors.rupee && (
                        <div className="ml-2 mt-1">
                          {errors.rupee && (
                            <div className="pl-1 text__left">
                              <span className="text-red">{errors.rupee}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="row mt-4">
                  <div className="col-md-6">
                    <div className="form-group mt-4">
                      <label className="text-gray mb-2">Tag</label>
                      <input
                        type="text"
                        className="form-control"
                        required=""
                        min="0"
                        placeholder="20% OFF"
                        value={tag}
                        onChange={(e) => {
                          setTag(e.target.value);
                        }}
                      />
                        {errors.tag && (
                        <div className="ml-2 mt-1">
                          {errors.tag && (
                            <div className="pl-1 text__left">
                              <span className="text-red">{errors.tag}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group mt-4">
                      <label className="text-gray mb-2">Name</label>
                      <input
                        type="text"
                        className="form-control"
                        required=""
                        placeholder="Plan Name"
                        value={name}
                        onChange={(e) => {
                          setName(e.target.value);
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-5">
                  <button
                    type="button"
                    className="btn btn-outline-info ml-2 btn-round float__right icon_margin"
                    onClick={closePopup}
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    className="btn btn-round float__right btn-danger"
                    onClick={handleSubmit}
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default connect(null, { createNewVIPPlan, editVIPPlan })(VIPPlanDialog);
