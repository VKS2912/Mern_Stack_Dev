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
import { CLOSE_COIN_PLAN_DIALOG } from "../../store/coinPlan/types";

//action
import { createNewCoinPlan, editCoinPlan } from "../../store/coinPlan/action";

import { permissionError } from "../../util/Alert";

const CoinPlanDialog = (props) => {
  const dispatch = useDispatch();

  const { dialog: open, dialogData } = useSelector((state) => state.coinPlan);
  const hasPermission = useSelector((state) => state.admin.admin.flag);

  const [mongoId, setMongoId] = useState("");
  const [diamonds, setDiamonds] = useState("");
  const [dollar, setDollar] = useState("");
  const [rupee, setRupee] = useState("");
  const [productKey, setProductKey] = useState("");
  const [tag, setTag] = useState("");

  const [errors, setError] = useState({
    diamonds: "",
    dollar: "",
    rupee: "",
    productKey: "",
    tag:""
  });

  useEffect(() => {
    if (dialogData) {
      setMongoId(dialogData._id);
      setDiamonds(dialogData.diamonds);
      setDollar(dialogData.dollar);
      setRupee(dialogData.rupee);
      setTag(dialogData.tag);
      setProductKey(dialogData.productKey);
    }
  }, [dialogData]);

  useEffect(
    () => () => {
      setError({
        diamonds: "",
        dollar: "",
        rupee: "",
        productKey: "",
        tag:""
      });
      setMongoId("");
      setDiamonds("");
      setTag("");
      setDollar("");
      setRupee("");
      setProductKey("");
    },
    [open]
  );

  useEffect(() => {
    window.onbeforeunload = closePopup();
  }, []);

  const closePopup = () => {
    dispatch({ type: CLOSE_COIN_PLAN_DIALOG });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!diamonds || !dollar || !rupee || !productKey || !tag) {
      const error = {};

      if (!diamonds) error.diamonds = "Diamond is required!";
      if (!dollar) error.dollar = "Dollar is required!";
      if (!rupee) error.rupee = "Rupee is required!";
      if (!productKey) error.productKey = "Product Key is required!";

      return setError({ ...error });
    }

    const diamondValid = isNumeric(diamonds);
    if (!diamondValid) {
      return setError({ ...errors, diamonds: "Invalid Diamond!!" });
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
    return setError({ ...errors, tag: "Invalid Rupee!!" });
  }

    const data = {
      diamonds,
      dollar,
      rupee,
      tag,
      productKey,
    };

    if (!hasPermission) return permissionError();
    if (mongoId) {
      props.editCoinPlan(mongoId, data);
    } else {
      props.createNewCoinPlan(data);
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
                <div className="form-group">
                  <label className="mb-2 text-gray">Diamonds</label>
                  <input
                    type="number"
                    className="form-control"
                    required=""
                    value={diamonds}
                    placeholder="10"
                    onChange={(e) => {
                      setDiamonds(
                        (e.target.value = Math.max(0, parseInt(e.target.value))
                          .toString()
                          .slice(0, 10))
                      );
                      if (!e.target.value) {
                        return setError({
                          ...errors,
                          diamonds: "Diamonds is Required !",
                        });
                      } else {
                        return setError({
                          ...errors,
                          diamonds: "",
                        });
                      }
                    }}
                  />
                  {errors.diamonds && (
                    <div className="ml-2 mt-1">
                      {errors.diamonds && (
                        <div className="pl-1 text__left">
                          <span className="text-red">{errors.diamonds}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group mt-4">
                      <label className="mb-2 text-gray">Dollar</label>
                      <input
                        type="number"
                        className="form-control"
                        required=""
                        placeholder="100"
                        value={dollar}
                        onChange={(e) => {
                          setDollar(
                            (e.target.value = Math.max(
                              0,
                              parseInt(e.target.value)
                            )
                              .toString()
                              .slice(0, 4))
                          );
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
                      <label className="mb-2 text-gray">Rupee</label>
                      <input
                        type="number"
                        className="form-control"
                        required=""
                        placeholder="100"
                        value={rupee}
                        onChange={(e) => {
                          setRupee(
                            (e.target.value = Math.max(
                              0,
                              parseInt(e.target.value)
                            )
                              .toString()
                              .slice(0, 4))
                          );
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
                <div className="form-group mt-4">
                  <label className="mb-2 text-gray">Tag</label>
                  <input
                    type="text"
                    className="form-control"
                    required=""
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

export default connect(null, { createNewCoinPlan, editCoinPlan })(
  CoinPlanDialog
);
