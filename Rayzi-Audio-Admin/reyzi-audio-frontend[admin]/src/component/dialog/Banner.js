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
import { CLOSE_BANNER_DIALOG } from "../../store/banner/types";

//action
import { createNewBanner, editBanner } from "../../store/banner/action";
import { baseURL } from "../../util/Config";
import { permissionError } from "../../util/Alert";

const BannerDialog = (props) => {
  const dispatch = useDispatch();

  const { dialog: open, dialogData } = useSelector((state) => state.banner);
  const hasPermission = useSelector((state) => state.admin.admin.flag);

  const [mongoId, setMongoId] = useState("");
  const [link, setLink] = useState("");
  const [imageData, setImageData] = useState(null);
  const [imagePath, setImagePath] = useState(null);

  const [errors, setError] = useState({
    link:"",
    image: ""
  });

  useEffect(() => {
    if (dialogData) {
      setMongoId(dialogData._id);
      setLink(dialogData.URL);
      setImagePath(baseURL + dialogData.image);
    }
  }, [dialogData]);

  useEffect(
    () => () => {
      setError({
        link:"",
        image: ""
      });
      setMongoId("");
      setLink("");
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
    dispatch({ type: CLOSE_BANNER_DIALOG });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!link || !mongoId ? !imageData : !imagePath) {
      const errors = {};
      if (!link) errors.link = "Link is Required!";
      if (!mongoId) {
        if (!imageData || !imagePath)  {
          errors.image = "Banner Photo is Required!"
        }else{
          errors.image = ""
        }
      }
      return setError({ ...errors });
    }
    const urlRegex = /^(ftp|http|https):\/\/[^ "]+$/;
    if (!urlRegex.test(link)) {
      const errors = { link: "Invalid URL!" };
      return setError({ ...errors });
    }
    
    if (!hasPermission) return permissionError();
    const formData = new FormData();

    formData.append("image", imageData);
    formData.append("URL", link);
    if (mongoId) {
      props.editBanner(mongoId, formData);
    } else {
      props.createNewBanner(formData);
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
        <DialogTitle id="responsive-dialog-title">
          <span className="text-danger font-weight-bold h4"> Banner </span>
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
                  <label className="mb-2 text-gray">Link</label>
                  <input
                    type="text"
                    className="form-control"
                    required=""
                    placeholder="https://www.google.com"
                    value={link}
                    onChange={(e) => {
                      setLink(e.target.value);

                      if (!e.target.value) {
                        return setError({
                          ...errors,
                          link: "Link is Required!",
                        });
                      } else {
                        return setError({
                          ...errors,
                          link: "",
                        });
                      }
                    }}
                  />
                   {errors.link && (
                    <div className="ml-2 mt-1">
                      {errors.link && (
                        <div className="pl-1 text__left">
                          <span className="text-red">{errors.link}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <div className="form-group mt-4">
                  <label className="mb-2 text-gray">Banner Image</label>
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

export default connect(null, { createNewBanner, editBanner })(BannerDialog);
