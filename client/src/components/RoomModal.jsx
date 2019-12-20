import React, { useState } from "react";
// import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Button from "@material-ui/core/Button";

// const useStyles = makeStyles({});

function RoomModal({
  submitButtonFunc,
  onClose,
  open,
  title,
  context,
  buttonText
}) {
  // const classes = useStyles();
  const [roomId, setRoomId] = useState("");

  const handleRoomId = e => {
    const { value } = e.target;

    let newValue = value.replace(/\s/g, "");
    setRoomId(newValue);
  };

  const handleCloseModal = () => {
    setRoomId("");
    onClose();
  };
  return (
    <Dialog
      onClose={handleCloseModal}
      aria-labelledby="simple-dialog-title"
      open={open}
      fullWidth
    >
      <DialogTitle id="simple-dialog-title">{title}</DialogTitle>
      <form
        onSubmit={e => {
          e.preventDefault();
          submitButtonFunc(roomId);
        }}
      >
        <DialogContent>
          <TextField
            id="standard-full-width"
            label={context}
            style={{ margin: 8 }}
            fullWidth
            margin="normal"
            onChange={handleRoomId}
            value={roomId}
            required
            InputLabelProps={{
              shrink: true
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseModal}
            variant="contained"
            color="secondary"
          >
            Cancel
          </Button>
          <Button type="submit" variant="contained" color="primary" autoFocus>
            {buttonText}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default RoomModal;
