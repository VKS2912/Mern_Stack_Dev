/* eslint-disable no-mixed-operators */
import React, { useEffect, useState } from "react";

//MUI
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Tooltip,
} from "@material-ui/core";
import { Cancel } from "@material-ui/icons";

//redux
import { connect, useDispatch, useSelector } from "react-redux";

// react dropzone
import ReactDropzone from "react-dropzone";

// action
import { createNewSticker, editSticker } from "../../store/sticker/action";

//types
import { CLOSE_STICKER_DIALOG } from "../../store/sticker/types";

import { permissionError } from "../../util/Alert";

//serverPath
import { baseURL } from "../../util/Config";

const StickerDialog = (props) => {
  const dispatch = useDispatch();
  const hasPermission = useSelector((state) => state.admin.admin.flag);

  const { dialog: open, dialogData } = useSelector((state) => state.sticker);

  const [images, setImages] = useState([]);
  const [mongoId, setMongoId] = useState("");

  const [imageData, setImageData] = useState(null);
  const [imagePath, setImagePath] = useState(null);

  const [errors, setError] = useState({
    image: "",
  });

  useEffect(() => {
    setError({
      image: "",
    });

    setImages([]);
  }, []);

  useEffect(() => {
    if (dialogData) {
      setMongoId(dialogData._id);
      setImagePath(baseURL + dialogData.sticker);
    }
  }, [dialogData]);

  useEffect(
    () => () => {
      setError({
        image: "",
      });
      setImages([]);
      setMongoId("");
    },
    [open]
  );

  useEffect(() => {
    window.onbeforeunload = closePopup();
  }, []);

  const onPreviewDrop = (files) => {
    setError({ ...errors, image: "" });
    files.map((file) =>
      Object.assign(file, { preview: URL.createObjectURL(file) })
    );
    setImages(images.concat(files));
  };

  const removeImage = (file) => {
    if (file.preview) {
      const image = images.filter((ele) => {
        return ele.preview !== file.preview;
      });
      setImages(image);
    }
  };

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
    dispatch({ type: CLOSE_STICKER_DIALOG });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!mongoId) {
      if (images.length === 0)
        return setError({ ...errors, image: "Sticker is Required!" });
    } else {
      if (!imageData && !imagePath) {
        return setError({ ...errors, image: "Sticker is Required!" });
      }
    }

    const formData = new FormData();

    if (!hasPermission) return permissionError();
    if (!mongoId) {
      for (let i = 0; i < images.length; i++) {
        formData.append("sticker", images[i]);
      }
      props.createNewSticker(formData);
    } else {
      formData.append("sticker", imageData);
      props.editSticker(formData, mongoId);
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
          <span className="text-danger font-weight-bold h4"> Sticker </span>
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
                {mongoId ? (
                  <div className="form-group">
                    <label className="mb-2 text-gray">Sticker</label>
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
                ) : (
                  <div className="row">
                    <label
                      className="form-control-label text-gray"
                      for="input-username"
                    >
                      Select (Multiple) Image
                    </label>
                    <div className="col-lg-12 text-left">
                      <>
                        <ReactDropzone
                          onDrop={(acceptedFiles) =>
                            onPreviewDrop(acceptedFiles)
                          }
                          accept="image/*"
                        >
                          {({ getRootProps, getInputProps }) => (
                            <section>
                              <div {...getRootProps()}>
                                <input {...getInputProps()} />
                                <div
                                  style={{
                                    height: 130,
                                    width: 130,
                                    border: "2px dashed gray",
                                    textAlign: "center",
                                    marginTop: "10px",
                                  }}
                                >
                                  <i
                                    className="fas fa-plus"
                                    style={{ paddingTop: 30, fontSize: 70 }}
                                  ></i>
                                </div>
                              </div>
                            </section>
                          )}
                        </ReactDropzone>

                        {errors.image && (
                          <div className="ml-2 mt-1">
                            {errors.image && (
                              <div className="pl-1 text__left">
                                <span className="text-red">{errors.image}</span>
                              </div>
                            )}
                          </div>
                        )}
                      </>
                    </div>
                    <div className="col-lg-12 mt-4">
                      {images.length > 0 && (
                        <>
                          {images.map((file, index) => {
                            return (
                              file.type?.split("image")[0] === "" && (
                                <>
                                  <img
                                    height="60px"
                                    width="60px"
                                    alt="app"
                                    src={file.preview}
                                    style={{
                                      boxShadow:
                                        "0 5px 15px 0 rgb(105 103 103 / 00%)",
                                      border: "2px solid #fff",
                                      borderRadius: 10,
                                      marginTop: 10,
                                      float: "left",
                                      objectFit: "contain",
                                      marginRight: 15,
                                    }}
                                  />
                                  <div
                                    class="img-container"
                                    style={{
                                      display: "inline",
                                      position: "relative",
                                      float: "left",
                                    }}
                                  >
                                    <i
                                      class="fas fa-times-circle text-danger"
                                      style={{
                                        position: "absolute",
                                        right: "10px",
                                        top: "4px",
                                        cursor: "pointer",
                                      }}
                                      onClick={() => removeImage(file)}
                                    ></i>
                                  </div>
                                </>
                              )
                            );
                          })}
                        </>
                      )}
                    </div>
                  </div>
                )}

                <div className={mongoId ? "mt-5 pt-5" : "mt-4"}>
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

export default connect(null, { createNewSticker, editSticker })(StickerDialog);
