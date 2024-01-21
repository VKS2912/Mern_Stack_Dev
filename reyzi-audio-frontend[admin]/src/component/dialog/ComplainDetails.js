import React, { useEffect } from "react";

//redux
import { useDispatch, useSelector } from "react-redux";

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
import { CLOSE_COMPLAIN_DIALOG } from "../../store/complain/types";
import { baseURL } from "../../util/Config";

const ComplainDetails = (props) => {
  const dispatch = useDispatch();

  const { dialog: open, dialogData } = useSelector((state) => state.complain);

    useEffect(() => {
    window.onbeforeunload = closePopup();
  }, []);

  const closePopup = () => {
    dispatch({ type: CLOSE_COMPLAIN_DIALOG });
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
          <span className="text-danger font-weight-bold h4">
            Complain Details
          </span>
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
                <table>
                  <tr>
                    <td className="py-2 mb-2 text-info">User Name</td>
                    <td className="py-2 mb-2 text-gray">&nbsp;:&nbsp;</td>
                    <td className="py-2 mb-2 text-gray">
                      {dialogData?.userId.name}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 mb-2 text-info">User's RCoin</td>
                    <td className="py-2 mb-2 text-gray">&nbsp;:&nbsp;</td>
                    <td className="py-2 mb-2 text-gray">
                      {dialogData?.userId.rCoin}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 mb-2 text-info">User's Country</td>
                    <td className="py-2 mb-2 text-gray">&nbsp;:&nbsp;</td>
                    <td className="py-2 mb-2 text-gray">
                      {dialogData?.userId.country}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 mb-2 text-info">Complain image </td>
                    <td className="py-2 mb-2 text-gray">&nbsp;:&nbsp;</td>
                    <td className="py-2 mb-2 text-gray">
                      <img
                        height="50px"
                        width="50px"
                        alt="app"
                        src={baseURL + dialogData?.image}
                        style={{
                          boxShadow: "0 5px 15px 0 rgb(105 103 103 / 0%)",
                          border: "2px solid #fff",
                          borderRadius: 10,
                          float: "left",
                          objectFit: "cover",
                        }}
                      />
                    </td>
                  </tr>

                  <tr>
                    <td className="py-2 mb-2 text-info">Contact </td>
                    <td className="py-2 mb-2 text-gray">&nbsp;:&nbsp;</td>
                    <td className="py-2 mb-2 text-gray">
                      {dialogData?.contact}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 mb-2 text-info">Complain Message </td>
                    <td className="py-2 mb-2 text-gray">&nbsp;:&nbsp;</td>
                    <td className="py-2 mb-2 text-gray">
                      {dialogData?.message}
                    </td>
                  </tr>
                </table>

                <div className="mt-5">
                  <button
                    type="button"
                    className="btn btn-outline-info ml-2 btn-round float__right icon_margin"
                    onClick={closePopup}
                  >
                    Close
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

export default ComplainDetails;
