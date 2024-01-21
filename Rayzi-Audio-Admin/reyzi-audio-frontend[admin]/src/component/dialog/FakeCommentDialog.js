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
import { CLOSE_COMMENT_DIALOG } from "../../store/fakeComment/type";

//action
import {
  insertFakeComment,
  updateFakeComment,
} from "../../store/fakeComment/action";

import { permissionError } from "../../util/Alert";

const FakeCommentDialog = (props) => {
  const dispatch = useDispatch();

  const { dialog: open, dialogData } = useSelector((state) => state.Comment);
  const hasPermission = useSelector((state) => state.admin.admin.flag);

  const [mongoId, setMongoId] = useState("");
  const [comment, setComment] = useState("");

  useEffect(() => {
    if (dialogData) {
      setMongoId(dialogData._id);
      setComment(dialogData.comment);
    }
  }, [dialogData]);

  useEffect(
    () => () => {
      setMongoId("");
      setComment("");
    },
    [open]
  );

  const closePopup = () => {
    dispatch({ type: CLOSE_COMMENT_DIALOG });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!hasPermission) return permissionError();

    const data = {
      comment: comment,
    };
    if (mongoId) {
      props.updateFakeComment(data, mongoId);
    } else {
      props.insertFakeComment(data);
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
          <span className="text-danger font-weight-bold h4"> Comment </span>
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
                  <label className="mb-2 text-gray">Comment</label>
                  <input
                    type="text"
                    className="form-control"
                    required=""
                    placeholder="comment"
                    value={comment}
                    onChange={(e) => {
                      setComment(e.target.value);
                    }}
                  />
                </div>
                <div className="mt-5">
                  <button
                    type="button"
                    className="btn btn-outline-info ml-2 btn-round float__right icon_margin"
                    onClick={closePopup}
                  >
                    Close
                  </button>
                  {!mongoId ? (
                    <button
                    type="button"
                    className="btn btn-round float__right btn-danger"
                    onClick={handleSubmit}
                  >
                    Submit
                  </button>
                  ):(
                    <button
                    type="button"
                    className="btn btn-round float__right btn-danger"
                    onClick={handleSubmit}
                  >
                    Update
                  </button>
                  )}
                  
                </div>
              </form>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default connect(null, { updateFakeComment, insertFakeComment })(
  FakeCommentDialog
);
