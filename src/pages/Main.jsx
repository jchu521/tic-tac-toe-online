import React from "react";

import Button from "@material-ui/core/Button";
import RoomModal from "../components/RoomModal";
import { Grid, Typography } from "@material-ui/core";
import JoinIcon from "@material-ui/icons/Search";
import AddIcon from "@material-ui/icons/Add";
import { withRouter } from "react-router-dom";

function Main({ history }) {
  const [open, setOpen] = React.useState(false);
  const [title, setTitle] = React.useState("Create Room");
  const [context, setContext] = React.useState("Enter Room Name:");
  const [buttonText, setButtonText] = React.useState("Create");
  const [isCreate, setIsCreate] = React.useState(true);

  const handleCreateRoomModal = () => {
    setOpen(true);
    setTitle("Create Room");
    setContext("Enter Room Name:");
    setButtonText("Create");
    setIsCreate(true);
  };

  const handleJoinRoomModal = () => {
    setOpen(true);
    setTitle("Join Room");
    setContext("Enter Room Name:");
    setButtonText("Join");
    setIsCreate(false);
  };

  const handleCreateRoom = async roomName => {
    history.push({
      pathname: "/room",
      search: `?id=${roomName}`,
      state: {
        player: "Player1",
        roomName
      }
    });
    // let result = await axios
    //   .post(`http://localhost:5000/room/${roomName}`)
    //   .then(res => {
    //     if (res.data.success) {
    //       history.push({
    //         pathname: "/room",
    //         search: `?id=${roomName}`,
    //         state: {
    //           player: "Player1",
    //           roomName
    //         }
    //       });
    //       return res.data;
    //     } else {
    //       return res.data;
    //     }
    //   })
    //   .catch(err => console.log(err));

    // console.log(result);
  };

  const handleJoinRoom = roomName => {
    history.push({
      pathname: "/room",
      search: `?id=${roomName}`,
      state: {
        player: "Player2",
        roomName
      }
    });
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Grid container spacing={4}>
      <Grid item xs={12}>
        <Typography variant="h2">Tic Tac Toe</Typography>
      </Grid>
      <Grid item xs={12}>
        <Button
          onClick={handleCreateRoomModal}
          variant="contained"
          color="primary"
          style={{ width: 200 }}
          startIcon={<AddIcon />}
        >
          Create Room
        </Button>
      </Grid>
      <Grid item xs={12}>
        <Button
          onClick={handleJoinRoomModal}
          variant="contained"
          color="secondary"
          style={{ width: 200 }}
          startIcon={<JoinIcon />}
        >
          Join Room
        </Button>
      </Grid>
      <RoomModal
        open={open}
        onClose={handleClose}
        title={title}
        context={context}
        submitButtonFunc={isCreate ? handleCreateRoom : handleJoinRoom}
        buttonText={buttonText}
      />
    </Grid>
  );
}

export default withRouter(Main);
