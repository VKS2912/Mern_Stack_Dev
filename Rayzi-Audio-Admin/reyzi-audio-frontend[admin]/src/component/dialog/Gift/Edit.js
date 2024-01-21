/* eslint-disable no-mixed-operators */
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
import { CLOSE_GIFT_DIALOG } from "../../../store/gift/types";

//action
import { editGift } from "../../../store/gift/action";
import { getCategory } from "../../../store/giftCategory/action";

// server path
import { baseURL } from "../../../util/Config";

import { permissionError } from "../../../util/Alert";

const GiftDialog = (props) => {
  const dispatch = useDispatch();

  const { dialog: open, dialogData } = useSelector((state) => state.gift);

  const GiftClick = localStorage.getItem("GiftClick");

  const [mongoId, setMongoId] = useState("");
  const [coin, setCoin] = useState("");
  const [category, setCategory] = useState("");
  const [imageData, setImageData] = useState(null);
  const [imagePath, setImagePath] = useState(null);

  const categoryDetail = JSON.parse(localStorage.getItem("Category"));

  const hasPermission = useSelector((state) => state.admin.admin.flag);

  useEffect(() => {
    props.getCategory(); // eslint-disable-next-line
  }, []);

  const categories = useSelector((state) => state.giftCategory.giftCategory);

  const [errors, setError] = useState({
    image: "",
    coin: "",
    category: "",
  });

  useEffect(() => {
    if (dialogData) {
      setMongoId(dialogData._id);
      setCoin(dialogData.coin);
      setCategory(
        GiftClick === null ? dialogData.category._id : dialogData.category
      );
      setImagePath(baseURL + dialogData.image);
    }
  }, [dialogData, GiftClick]);

  useEffect(
    () => () => {
      setError({
        image: "",
        coin: "",
        category: "",
      });
      setCategory("");
      setCoin("");
      setImageData(null);
      setImagePath(null);
    },
    [open]
  );

  const HandleInputImage = (e) => {
    if (e.target.files[0]) {
      setImageData(e.target.files[0]);
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        setImagePath(reader.result);
      });
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const closePopup = () => {
    dispatch({ type: CLOSE_GIFT_DIALOG });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      (!imageData && !imagePath) ||
      !coin ||
      (GiftClick !== null && (!category || category === "Select Category"))
    ) {
      const errors = {};

      if (!coin) errors.coin = "Coin is Required!";

      if (!imageData && !imagePath) errors.image = "Please select an Image!";

      if (GiftClick !== null && (category === "Select Category" || !category)) {
        errors.category = "Please select a Category!";
      }
    }
    const coinValid = isNumeric(coin);
    if (!coinValid) {
      return setError({ ...errors, coin: "Invalid Coin!!" });
    }
    const validateCoin =
    coin.toString().includes("-") || coin.toString().includes(".");

  if (validateCoin) {
    return setError({ ...errors, coin: "Invalid Validity!!" });
  }
    const formData = new FormData();

    formData.append("image", imageData);
    formData.append("coin", coin);
    GiftClick !== null && formData.append("category", category);

    if (!hasPermission) return permissionError();

    props.editGift(formData, mongoId);
  };

  const isNumeric = (value) => {
    const val = value === "" ? 0 : value;
    const validNumber = /^\d+$/.test(val);
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
        maxWidth="xs"
      >
        <DialogTitle id="responsive-dialog-title">
          <span className="text-danger font-weight-bold h4"> Gift </span>
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
                  <label className="mb-2 text-gray">Coin</label>
                  <input
                    type="number"
                    className="form-control"
                    required=""
                    min="0"
                    placeholder="20"
                    value={coin}
                    onChange={(e) => {
                      setCoin(e.target.value);
                      if (!e.target.value) {
                        return setError({
                          ...errors,
                          coin: "Coin is Required!",
                        });
                      } else {
                        return setError({
                          ...errors,
                          coin: "",
                        });
                      }
                    }}
                  />
                  {errors.coin && (
                    <div className="ml-2 mt-1">
                      {errors.coin && (
                        <div className="pl-1 text__left">
                          <span className="text-red">{errors.coin}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <div className="form-group mt-4">
                  <label className="text-gray mb-2">Category</label>
                  {GiftClick === null ? (
                    <input
                      type="text"
                      className="form-control"
                      required=""
                      
                      placeholder="Category Name"
                      disabled
                      value={categoryDetail.name}
                    />
                  ) : (
                    <>
                      <select
                        class="form-select form-control"
                        aria-label="Default select example"
                        value={category}
                        onChange={(e) => {
                          setCategory(e.target.value);
                          if (e.target.value === "Select Category") {
                            return setError({
                              ...errors,
                              category: "Please select a Category!",
                            });
                          } else {
                            return setError({
                              ...errors,
                              category: "",
                            });
                          }
                        }}
                      >
                        <option value="Select Category" selected>
                          Select Category
                        </option>
                        {categories.map((category) => {
                          return (
                            <option value={category._id}>
                              {category.name}
                            </option>
                          );
                        })}
                      </select>
                      {errors.category && (
                        <div className="ml-2 mt-1">
                          {errors.category && (
                            <div className="pl-1 text__left">
                              <span className="text-red">
                                {errors.category}
                              </span>
                            </div>
                          )}
                        </div>
                      )}
                    </>
                  )}
                </div>
                <div className="form-group mt-4">
                  <label className="mb-2 text-gray">Select Image or GIF</label>
                  <input
                    type="file"
                    className="form-control form-control-sm"
                    accept="image/*"
                    required=""
                    onChange={HandleInputImage}
                  />
                  {errors.image && (
                    <div className="ml-2 mt-1">
                      {errors.image && (
                        <div className="pl-1 text__left">
                          <span className="text-red">{errors.image}</span>
                        </div>
                      )}
                    </div>
                  )}
                  {imagePath && (
                    <>
                      <img
                        height="70px"
                        width="70px"
                        alt="app"
                        src={imagePath}
                        style={{
                          boxShadow: "0 5px 15px 0 rgb(105 103 103 / 0%)",
                          // border: "2px solid #fff",
                          borderRadius: 10,
                          marginTop: 10,
                          float: "left",
                          objectFit: "cover",
                        }}
                      />
                    </>
                  )}
                </div>
                <div className={imagePath ? "mt-5 pt-5" : "mt-5"}>
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

export default connect(null, { editGift, getCategory })(GiftDialog);
