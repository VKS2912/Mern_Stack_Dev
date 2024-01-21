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
import { CLOSE_LEVEL_DIALOG } from "../../store/level/types";

//action
import { createNewLevel, editLevel } from "../../store/level/action";
import { baseURL } from "../../util/Config";
import { permissionError } from "../../util/Alert";

const LevelDialog = (props) => {
  const dispatch = useDispatch();

  const { dialog: open, dialogData } = useSelector((state) => state.level);

  const hasPermission = useSelector((state) => state.admin.admin.flag);

  const [mongoId, setMongoId] = useState("");
  const [name, setName] = useState("");
  const [coin, setCoin] = useState("");
  const [imageData, setImageData] = useState(null);
  const [imagePath, setImagePath] = useState(null);

  const [errors, setError] = useState({
    name: "",
    coin: "",
    image: "",
  });

  useEffect(() => {
    if (dialogData) {
      setMongoId(dialogData._id);
      setName(dialogData.name);
      setCoin(dialogData.coin);
      setImagePath(baseURL + dialogData.image);
    }
  }, [dialogData]);

  useEffect(
    () => () => {
      setError({
        name: "",
      });
      setMongoId("");
      setName("");
      setCoin("");
      setImageData(null);
      setImagePath(null);
    },
    [open]
  );


  useEffect(() => {
    window.onbeforeunload = closePopup();
  }, []);
  
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
    dispatch({ type: CLOSE_LEVEL_DIALOG });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name || !coin) {
      const errors = {};
      if (!name) errors.name = "Level Name is Required!";
      if (!coin) errors.coin = "Coin is Required!";
      if (!imageData || !imagePath)
        return setError({ ...errors, image: "Please select an Image!" });

      return setError({ ...errors });
    }

    const coinValid = isNumeric(coin);
    if (!coinValid) {
      return setError({ ...errors, coin: "Invalid Coin!!" });
    }

    const formData = new FormData();

    formData.append("name", name);
    formData.append("coin", coin);
    formData.append("image", imageData);

    if (!hasPermission) return permissionError();

    if (mongoId) {
      if (!imageData && !imagePath)
        return setError({ ...errors, image: "Please select an Image!" });
      props.editLevel(mongoId, formData);
    } else {
      if (!imageData || !imagePath)
        return setError({ ...errors, image: "Please select an Image!" });
      props.createNewLevel(formData);
    }
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
          <span className="text-danger font-weight-bold h4"> Level </span>
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
                  <label className="mb-2 text-gray">Name</label>
                  <input
                    type="text"
                    className="form-control"
                    required=""
                    placeholder="Level Name"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (!e.target.value) {
                        return setError({
                          ...errors,
                          name: "Level Name is Required!",
                        });
                      } else {
                        return setError({
                          ...errors,
                          name: "",
                        });
                      }
                    }}
                  />
                  {errors.name && (
                    <div className="ml-2 mt-1">
                      {errors.name && (
                        <div className="pl-1 text__left">
                          <span className="text-red">{errors.name}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <div className="form-group mt-4">
                  <label className="mb-2 text-gray">Coin</label>
                  <input
                    type="number"
                    className="form-control"
                    required=""
                    placeholder="500"
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
                  <label className="mb-2 text-gray">Image</label>
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
                          boxShadow: "0 5px 15px 0 rgb(105 103 103 / 10%)",
                          border: "2px solid #fff",
                          borderRadius: 10,
                          marginTop: 10,
                          float: "left",
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

export default connect(null, { createNewLevel, editLevel })(LevelDialog);
