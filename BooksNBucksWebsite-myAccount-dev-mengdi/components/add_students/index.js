import React, { useState } from "react";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { Box } from "@mui/system";
import { Button } from "@mui/material";
import TextField from "@mui/material/TextField";
import { styled } from "@mui/system";
import { addStudent } from "../../helpers/backend_helper";
import LoadingButton from "@mui/lab/LoadingButton";
import { notification } from "antd";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";

export default function AddStudents() {
  const [addOpen, setAddOpen] = useState(false);
  const [formCode, setFormCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  function handleAddStudent() {
    setLoading(true);
    setError(false);
    setErrorMsg("");
    addStudent({ code: formCode }).then(({ error, data }) => {
      if (error === false) {
        //console.log(data);
        if (
          data == "Your code has expired!" ||
          data == "Already added the student!"
        ) {
          setLoading(false);
          setError(true);
          setErrorMsg(data);
        } else {
          setLoading(false);
          notification.open({
            message: "Success",
            description: "Successfully added the student!",
            icon: <CheckCircleOutlineRoundedIcon color="success" />,
          });
          handleClose();
        }
      } else {
        setError(true);
        setErrorMsg("Incorrect code!");
        setLoading(false);
      }
    });
  }

  const handleCodeChange = (event) => {
    setFormCode(event.target.value);
  };

  const handleClickOpen = () => {
    setAddOpen(true);
  };
  const AddBox = styled(TextField)(() => ({
    "& input": {
      paddingLeft: "30px",
    },
    "& fieldset": {
      borderRadius: "30px",
    },
  }));

  const StyledButton = styled(Button)(() => ({
    borderRadius: "30px",
  }));

  const handleClose = () => {
    setAddOpen(false);
  };
  return (
    <>
      <StyledButton
        variant="contained"
        sx={{
          marginLeft: "10px",
        }}
        startIcon={<AddCircleOutlineIcon />}
        onClick={handleClickOpen}
      >
        Add Students
      </StyledButton>
      <Dialog
        open={addOpen}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Add a student"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Please paste in the add code (ask for your student to generate it in
            the student protal)
          </DialogContentText>
          <Box
            component="form"
            sx={{
              "& > :not(style)": { width: 1 },
              marginTop: 3,
            }}
            noValidate
            autoComplete="off"
          >
            <AddBox
              value={formCode}
              onChange={handleCodeChange}
              id="code"
              label="Code"
              variant="outlined"
              error={error}
              helperText={errorMsg}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <LoadingButton
            loading={loading}
            variant="contained"
            onClick={handleAddStudent}
            sx={{ borderRadius: "30px" }}
          >
            Add
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </>
  );
}
