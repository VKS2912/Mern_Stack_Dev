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
import { CLOSE_CATEGORY_DIALOG } from "../../store/giftCategory/types";

import { permissionError } from "../../util/Alert";

//action
import {
  createNewCategory,
  editCategory,
} from "../../store/giftCategory/action";
import { baseURL } from "../../util/Config";

const GiftCategoryDialog = (props) => {
  const dispatch = useDispatch();

  const { dialog: open, dialogData } = useSelector(
    (state) => state.giftCategory
  );

  const hasPermission = useSelector((state) => state.admin.admin.flag);

  const [mongoId, setMongoId] = useState("");
  const [name, setName] = useState("");
  const [imageData, setImageData] = useState(null);
  const [imagePath, setImagePath] = useState(null);

  const [errors, setError] = useState({
    image: "",
    name: "",
  });

  useEffect(() => {
    if (dialogData) {
      setMongoId(dialogData._id);
      setName(dialogData.name);
      setImagePath(baseURL + dialogData.image);
    }
  }, [dialogData]);

  useEffect(
    () => () => {
      setError({
        image: "",
        name: "",
      });
      setMongoId("");
      setName("");
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
    dispatch({ type: CLOSE_CATEGORY_DIALOG });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const error = {};
    if (!mongoId && (!name || !imagePath)) {
      if (!name) error.name = "Name is Required!";
      if (!imageData || !imagePath) error.image = "Image is Required!";

      return setError({ ...error });
    }
    if (mongoId && (!name || !imagePath)) {
      if (!name) error.name = "Name is Required!";
      if (!imageData && !imagePath) error.image = "Image is Required!";
      return setError({ ...error });
    }

    const formData = new FormData();

    formData.append("image", imageData);
    formData.append("name", name);

    if (!hasPermission) return permissionError();
    if (mongoId) {
      props.editCategory(mongoId, formData);
    } else {
      props.createNewCategory(formData);
    }
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
        <DialogTitle id="responsive-dialog-title"><span className="text-danger font-weight-bold h4" > Category </span></DialogTitle>

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
                    placeholder="Magic"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (!e.target.value) {
                        return setError({
                          ...errors,
                          name: "Name is Required!",
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
                  <label className="mb-2 text-gray">Image</label>
                  <input
                    type="file"
                    className="form-control form-control-sm"
                    // accept="image/*"
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
                          // boxShadow: "0 5px 15px 0 rgb(105 103 103 / 50%)",
                          // border: "2px solid #fff",
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

export default connect(null, { createNewCategory, editCategory })(
  GiftCategoryDialog
);
