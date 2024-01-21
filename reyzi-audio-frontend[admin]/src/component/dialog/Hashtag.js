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
import { CLOSE_HASHTAG_DIALOG } from "../../store/hashtag/types";

//action
import { createNewHashtag, editHashtag } from "../../store/hashtag/action";

import { permissionError } from "../../util/Alert";


const HashtagDialog = (props) => {
  const dispatch = useDispatch();

  const { dialog: open, dialogData } = useSelector((state) => state.hashtag);

  const hasPermission = useSelector((state) => state.admin.admin.flag);

  const [mongoId, setMongoId] = useState("");
  const [hashtag, setHashtag] = useState("");

  const [errors, setError] = useState({
    hashtag: "",
  });

  useEffect(() => {
    if (dialogData) {
      setMongoId(dialogData._id);
      setHashtag(dialogData.hashtag);
    }
  }, [dialogData]);

  useEffect(
    () => () => {
      setError({
        hashtag: "",
      });
      setMongoId("");
      setHashtag("");
    },
    [open]
  );

  useEffect(() => {
    window.onbeforeunload = closePopup();
  }, []);

  const closePopup = () => {
    dispatch({ type: CLOSE_HASHTAG_DIALOG });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!hashtag.trim()) return setError({ ...errors, hashtag: "Hashtag is Required!" });

    if (!hasPermission) return permissionError();

    if (mongoId) {
      props.editHashtag(mongoId, { hashtag });
    } else {
      props.createNewHashtag({ hashtag });
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
        <DialogTitle id="responsive-dialog-title"><span className="text-danger font-weight-bold h4" > Banner </span></DialogTitle>

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
                  <label className="mb-2 text-gray">Hashtag</label>
                  {
                    mongoId ?

                      <input
                        type="text"
                        className="form-control"
                        required=""
                        placeholder="Enter Hashtag"
                        value={hashtag}
                        onChange={(e) => {
                          setHashtag(e.target.value);
                          if (!e.target.value) {
                            return setError({
                              ...errors,
                              hashtag: "Hashtag is Required!",
                            });
                          } else {
                            return setError({
                              ...errors,
                              hashtag: "",
                            });
                          }
                        }}
                      /> :
                      <textarea
                        type="text"
                        rows={3}
                        cols={3}
                        className="form-control"
                        required=""
                        placeholder="Enter Hashtag"
                        value={hashtag}
                        onChange={(e) => {
                          setHashtag(e.target.value);
                          if (!e.target.value) {
                            return setError({
                              ...errors,
                              hashtag: "Hashtag is Required!",
                            });
                          } else {
                            return setError({
                              ...errors,
                              hashtag: "",
                            });
                          }
                        }}
                      />
                  }
                  {!mongoId && <><span className="text-danger">Note : </span><span className="text-center">You can add multiple hashtag separate by comma (,)</span></>}
                  {errors.hashtag && (
                    <div className="ml-2 mt-1">
                      {errors.hashtag && (
                        <div className="pl-1 text__left">
                          <span className="text-red">{errors.hashtag}</span>
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

export default connect(null, { createNewHashtag, editHashtag })(HashtagDialog);
