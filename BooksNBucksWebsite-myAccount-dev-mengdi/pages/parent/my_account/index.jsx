import React, { useEffect } from "react";
import ParentLayout from "../../../layouts/parent";
import styles from "./index.module.css";
import { Box } from "@mui/system";
import Grid from "@mui/material/Grid";
import { Typography, AppBar } from "@mui/material";
import { Toolbar } from "@mui/material";
import { IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import FormControl from "@mui/material/FormControl";
import { styled } from "@mui/system";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import { notification } from "antd";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import { fetchParentProfile } from "../../../helpers/backend_helper";
import { fetchUpdateParentProfile } from "../../../helpers/backend_helper";
import { fetchUpdateParentSetting } from "../../../helpers/backend_helper";
import { fetchMyStudents } from "../../../helpers/backend_helper";
import { addStudent } from "../../../helpers/backend_helper";
import PreLoader from "../../../components/common/preloader";
import { removeStudent } from "../../../helpers/backend_helper";

// Formatting the phone number
function formatPhoneNumber(value) {
  // if input value is falsy eg if the user deletes the input, then just return
  if (!value) return value;

  // clean the input for any non-digit values.
  const phoneNumber = value.replace(/[^\d]/g, "");

  // phoneNumberLength is used to know when to apply our formatting for the phone number
  const phoneNumberLength = phoneNumber.length;

  // we need to return the value with no formatting if its less then four digits
  // this is to avoid weird behavior that occurs if you  format the area code to early
  if (phoneNumberLength < 4) return phoneNumber;

  // if phoneNumberLength is greater than 4 and less the 7 we start to return
  // the formatted number
  if (phoneNumberLength < 7) {
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
  }

  // finally, if the phoneNumberLength is greater then seven, we add the last
  // bit of formatting and return it.
  return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(
    3,
    6
  )}-${phoneNumber.slice(6, 10)}`;
}

function parentStudents() {
  // Set the CSS for AddBox
  const AddBox = styled(TextField)(() => ({
    "& input": {
      paddingLeft: "30px",
    },
    "& fieldset": {
      borderRadius: "30px",
    },
  }));

  // Set the useState for Edit Information Icon
  const [click, setClick] = React.useState(false);
  const handleClickOpen = () => {
    setClick(true);
  };
  const handleClickClose = () => {
    setClick(false);
  };

  // Set the useState for Add Student Icon
  const [addOpen, setAdd] = React.useState(false);
  const handleAddOpen = () => {
    setAdd(true);
  };

  const handleAddClose = () => {
    setAdd(false);
  };

  // Set the useState for Remove Student Icon
  const [RemoveOpen, setRemove] = React.useState(false);
  const handleRemoveOpen = () => {
    setRemove(true);
  };

  const handleRemoveClose = () => {
    setRemove(false);
  };

  // Set the useState for My Account Information
  const [email, setEmail] = React.useState("");
  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [relationship, setRelationship] = React.useState("");
  const [homephone, setHomePhone] = React.useState("");
  const [cellphone, setCellPhone] = React.useState("");
  const [emailNotification, setEmailNotification] = React.useState(true);
  const [weeklyDigest, setweeklyDigest] = React.useState(true);
  const [formCode, setFormCode] = React.useState("");
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState("");
  const [studentId, setStudentId] = React.useState("");

  const [myStudents, setMyStudents] = React.useState([]);
  // const [studentId, setStudentId] = React.useState();

  const handleFirstNameChange = (event) => {
    setFirstName(
      event.target.value.charAt(0).toUpperCase() + event.target.value.slice(1)
    );
  };

  const handleLastNameChange = (event) => {
    setLastName(
      event.target.value.charAt(0).toUpperCase() + event.target.value.slice(1)
    );
  };

  const handleRelationshipChange = (event) => {
    setRelationship(
      event.target.value.charAt(0).toUpperCase() + event.target.value.slice(1)
    );
  };

  const handleHomePhoneChange = (event) => {
    const formattedHomePhoneNumber = formatPhoneNumber(event.target.value);
    setHomePhone(formattedHomePhoneNumber);
  };

  const handleCellPhoneChange = (event) => {
    const formattedCellPhoneNumber = formatPhoneNumber(event.target.value);
    setCellPhone(formattedCellPhoneNumber);
  };

  const handleCodeChange = (event) => {
    setFormCode(event.target.value);
  };

  const getParentProfile = () => {
    setLoading(true);
    fetchParentProfile().then(({ error, data }) => {
      if (error === false) {
        setEmail(data.email);
        setFirstName(data.first_name);
        setLastName(data.last_name);
        setRelationship(data.relationship);
        setCellPhone(data.cell_phone);
        setHomePhone(data.home_phone);
        setEmailNotification(data.email_notification);
        setweeklyDigest(data.weekly_digest);
        setLoading(false);
      } else {
        setLoading(false);
        alert("cannot get parent!");
      }
    });
  };

  const getUpdateParentProfile = () => {
    setLoading(true);
    fetchUpdateParentProfile({
      firstname: firstName,
      lastname: lastName,
      relationship: relationship,
      cellphone: cellphone,
      homephone: homephone,
    }).then(({ data, error }) => {
      if (error === false) {
        notification.open({
          message: "Success",
          description: "Successfully update the information!",
          icon: <CheckCircleOutlineRoundedIcon color="success" />,
        });
        setLoading(false);
        handleClickClose();
      } else {
        setLoading(false);
        alert("Information update failed!");
      }
    });
  };

  const handleEmailNotificationChange = () => {
    setLoading(true);
    fetchUpdateParentSetting({
      emailNotification: !emailNotification,
      weeklyDigest: weeklyDigest,
    }).then(({ data, error }) => {
      if (error === false) {
        notification.open({
          message: "Success",
          description: "Successfully update the setting!",
          icon: <CheckCircleOutlineRoundedIcon color="success" />,
        });
        setLoading(false);
      } else {
        setLoading(false);
        alert("Information update failed!");
      }
    });
    setEmailNotification(!emailNotification);
  };

  const handleWeeklyDigestChange = () => {
    setLoading(true);
    fetchUpdateParentSetting({
      weeklyDigest: !weeklyDigest,
      emailNotification: emailNotification,
    }).then(({ data, error }) => {
      if (error === false) {
        notification.open({
          message: "Success",
          description: "Successfully update the setting!",
          icon: <CheckCircleOutlineRoundedIcon color="success" />,
        });
        setLoading(false);
      } else {
        setLoading(false);
        alert("Information update failed!");
      }
    });
    setweeklyDigest(!weeklyDigest);
  };

  const getStudents = () => {
    setLoading(true);
    fetchMyStudents().then(({ error, data }) => {
      if (error === false) {
        setMyStudents(data.my_students);
        // setStudentId(data.my_students[0]._id);
        setLoading(false);
      } else {
        setLoading(false);
        alert("cannot get student!");
      }
    });
  };

  useEffect(() => {
    getParentProfile();
    getStudents();
  }, []);

  function handleAddStudent() {
    setLoading(true);
    setError(false);
    setErrorMsg("");
    addStudent({ code: formCode }).then(({ error, data }) => {
      if (error === false) {
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
          getStudents();
          handleAddClose();
        }
      } else {
        setError(true);
        setErrorMsg("Incorrect code!");
        setLoading(false);
      }
    });
  }

  function handleRemoveStudent() {
    setLoading(true);
    removeStudent({ _id: studentId }).then(({ error, data }) => {
      if (error === false) {
        setLoading(false);
        notification.open({
          message: "Success",
          description: "Successfully deleted student!",
          icon: <CheckCircleOutlineRoundedIcon color="success" />,
        });
        getStudents();
      } else {
        alert("error!");
        setLoading(close);
      }
    });
    handleRemoveClose();
  }

  if (loading) {
    return <PreLoader />;
  }

  return (
    <ParentLayout>
      <Box sx={{ marginTop: "50px" }}>
        <Typography variant="h1" sx={{ marginLeft: "50px", marginTop: "30px" }}>
          My Account
        </Typography>
        <Grid
          container
          justifyContent="flex-start"
          alignItems="center"
          sx={{ mt: 1 }}
        >
          {/* My Info Part */}
          <Grid item lg={10}>
            <Box
              sx={{
                borderRadius: "20px",
                overflow: "hidden",
                mt: 5,
                ml: 7,
              }}
            >
              <AppBar position="static">
                <Toolbar>
                  <Typography
                    variant="h5"
                    component="div"
                    sx={{
                      color: "white",
                      fontSize: 25,
                      marginTop: "5px",
                      fontWeight: "bold",
                      marginLeft: "5px",
                      flexGrow: 1,
                    }}
                  >
                    My Info
                  </Typography>
                  <IconButton onClick={handleClickOpen}>
                    <EditIcon sx={{ color: "white" }}></EditIcon>
                  </IconButton>
                </Toolbar>
              </AppBar>

              <Box
                sx={{
                  flexGrow: 1,
                  bgcolor: "secondary.main",
                }}
              >
                <Typography
                  variant="h6"
                  sx={{ paddingLeft: "30px", paddingTop: "20px" }}
                >
                  Name: {firstName} {lastName}
                </Typography>
                <Typography
                  variant="h6"
                  sx={{ paddingLeft: "30px", paddingTop: "15px" }}
                >
                  Relationship to Student(s): {relationship}
                </Typography>
                <Typography
                  variant="h6"
                  sx={{ paddingLeft: "30px", paddingTop: "15px" }}
                >
                  Home Phone: {homephone}
                </Typography>
                <Typography
                  variant="h6"
                  sx={{ paddingLeft: "30px", paddingTop: "15px" }}
                >
                  Cell Phone: {cellphone}
                </Typography>
                <Typography
                  variant="h6"
                  sx={{
                    paddingLeft: "30px",
                    paddingTop: "15px",
                    paddingBottom: "20px",
                  }}
                >
                  Email Address: {email}
                </Typography>
              </Box>
            </Box>
          </Grid>

          {/* Edit Information Icon Page */}
          <Modal
            open={click}
            onClose={handleClickClose}
            aria-labelledby="modal-modal-title"
          >
            <Box
              sx={{
                maxHeight: "600px",
                width: "800px",
                borderRadius: "20px",
                overflow: "hidden",
                marginTop: "60px",
                marginLeft: "auto",
                marginRight: "auto",
              }}
            >
              <AppBar position="static">
                <Toolbar>
                  <Typography
                    variant="h5"
                    component="div"
                    sx={{
                      color: "white",
                      fontSize: 25,
                      marginTop: "5px",
                      fontWeight: "bold",
                      marginLeft: "5px",
                      flexGrow: 1,
                    }}
                  >
                    Edit Account Information
                  </Typography>
                  <IconButton onClick={handleClickClose}>
                    <CloseRoundedIcon sx={{ color: "white" }} />
                  </IconButton>
                </Toolbar>
              </AppBar>
              <Box
                sx={{
                  flexGrow: 1,
                  bgcolor: "secondary.main",
                }}
              >
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Box>
                    <Typography
                      variant="h6"
                      sx={{ marginLeft: "30px", paddingTop: "10px" }}
                    >
                      First Name:
                    </Typography>
                    <FormControl
                      sx={{
                        marginLeft: "30px",
                        marginTop: "10px",
                        width: "30ch",
                      }}
                    >
                      <InputLabel htmlFor="component-outlined">
                        First Name
                      </InputLabel>
                      <OutlinedInput
                        id="component-outlined"
                        value={firstName}
                        onChange={handleFirstNameChange}
                        label="FirstName"
                        sx={{ borderRadius: "20px" }}
                      />
                    </FormControl>
                  </Box>

                  <Box>
                    <Typography variant="h6" sx={{ paddingTop: "10px" }}>
                      Last Name:
                    </Typography>
                    <FormControl
                      sx={{
                        marginTop: "10px",
                        marginRight: "50px",
                        width: "30ch",
                      }}
                    >
                      <InputLabel htmlFor="component-outlined">
                        Last Name
                      </InputLabel>
                      <OutlinedInput
                        id="component-outlined"
                        value={lastName}
                        onChange={handleLastNameChange}
                        label="LastName"
                        sx={{ borderRadius: "20px" }}
                      />
                    </FormControl>
                  </Box>
                </Box>

                <Typography
                  variant="h6"
                  sx={{ paddingLeft: "30px", paddingTop: "10px" }}
                >
                  Relationship to Student(s):
                </Typography>
                <FormControl
                  sx={{ marginLeft: "30px", marginTop: "10px", width: "68ch" }}
                >
                  <InputLabel htmlFor="component-outlined">
                    Relationship
                  </InputLabel>
                  <OutlinedInput
                    id="component-outlined"
                    value={relationship}
                    onChange={handleRelationshipChange}
                    label="Relationship"
                    sx={{ borderRadius: "20px" }}
                  />
                </FormControl>

                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Box>
                    <Typography
                      variant="h6"
                      sx={{ paddingLeft: "30px", paddingTop: "10px" }}
                    >
                      Home Phone:
                    </Typography>
                    <FormControl
                      sx={{
                        marginLeft: "30px",
                        marginTop: "10px",
                        width: "30ch",
                      }}
                    >
                      <InputLabel htmlFor="component-outlined">
                        HomePhone
                      </InputLabel>
                      <OutlinedInput
                        id="component-outlined"
                        value={homephone}
                        onChange={handleHomePhoneChange}
                        label="Home Phone"
                        sx={{ borderRadius: "20px" }}
                      />
                    </FormControl>
                  </Box>
                  <Box>
                    <Typography variant="h6" sx={{ paddingTop: "10px" }}>
                      Cell Phone:
                    </Typography>
                    <FormControl
                      sx={{
                        marginRight: "50px",
                        marginTop: "10px",
                        width: "30ch",
                      }}
                    >
                      <InputLabel htmlFor="component-outlined">
                        CellPhone
                      </InputLabel>
                      <OutlinedInput
                        id="component-outlined"
                        value={cellphone}
                        onChange={handleCellPhoneChange}
                        label="Cell Phone"
                        sx={{ borderRadius: "20px" }}
                      />
                    </FormControl>
                  </Box>
                </Box>

                <Typography
                  variant="h6"
                  sx={{ paddingLeft: "30px", paddingTop: "10px" }}
                >
                  Email:
                </Typography>
                <FormControl
                  sx={{ marginLeft: "30px", marginTop: "10px", width: "68ch" }}
                >
                  <InputLabel
                    htmlFor="component-outlined"
                    sx={{ borderRadius: "20px" }}
                  >
                    Email
                  </InputLabel>
                  <OutlinedInput
                    id="component-outlined"
                    disabled
                    value={email}
                    label="email"
                    sx={{ borderRadius: "20px" }}
                  />
                </FormControl>
                <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                  <Button
                    variant="outlined"
                    size="large"
                    onClick={getUpdateParentProfile}
                    sx={{
                      textAlign: "center",
                      marginTop: "20px",
                      marginRight: "10px",
                      marginBottom: "10px",
                      borderRadius: 5,
                    }}
                  >
                    Confirm
                  </Button>
                </Box>
              </Box>
            </Box>
          </Modal>

          {/* Student Part */}
          <Grid item lg={10}>
            <Box
              sx={{
                borderRadius: "20px",
                overflow: "hidden",
                mt: 5,
                ml: 7,
              }}
            >
              <AppBar position="static">
                <Toolbar>
                  <Typography
                    variant="h5"
                    component="div"
                    sx={{
                      color: "white",
                      fontSize: 25,
                      marginTop: "5px",
                      fontWeight: "bold",
                      marginLeft: "5px",
                      flexGrow: 1,
                    }}
                  >
                    Students
                  </Typography>
                  <IconButton onClick={handleAddOpen}>
                    <AddCircleOutlineIcon
                      sx={{ color: "white" }}
                    ></AddCircleOutlineIcon>
                  </IconButton>
                </Toolbar>
              </AppBar>

              <Box
                sx={{
                  flexGrow: 1,
                  bgcolor: "secondary.main",
                }}
              >
                {myStudents.map((student) => {
                  let name = student.first_name + " " + student.last_name;
                  let email = student.email;
                  return (
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                    >
                      <Box
                        sx={{
                          paddingLeft: "30px",
                          paddingTop: "20px",
                          paddingBottom: "20px",
                        }}
                      >
                        <Typography variant="h6">Student: {name}</Typography>
                        <Typography variant="h6">Email: {email}</Typography>
                      </Box>
                      <Box sx={{ marginTop: "35px", marginRight: "20px" }}>
                        <Button
                          variant="contained"
                          onClick={(event) => {
                            setStudentId(event.target.value);
                            handleRemoveOpen();
                          }}
                          sx={{ borderRadius: "20px" }}
                          value={student._id}
                        >
                          Remove
                        </Button>
                      </Box>
                    </Box>
                  );
                })}
              </Box>
            </Box>
          </Grid>

          {/* Remove Student Buttom */}
          <Dialog
            open={RemoveOpen}
            onClose={handleRemoveClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">
              {"Are you sure that you want to remove your student?"}
            </DialogTitle>
            <DialogActions>
              <Button onClick={handleRemoveStudent}>Remove</Button>
              <Button onClick={handleRemoveClose} autoFocus>
                Cancel
              </Button>
            </DialogActions>
          </Dialog>

          {/* Add Student Icon Page */}
          <Dialog
            open={addOpen}
            onClose={handleAddClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">{"Add a student"}</DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                Please enter the code your student provided
              </DialogContentText>
              <Box
                component="form"
                sx={{
                  "& > :not(style)": { width: 1 },
                  marginTop: 1,
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
              <Button loading={loading} onClick={handleAddStudent}>
                Add
              </Button>
            </DialogActions>
          </Dialog>
        </Grid>
      </Box>
    </ParentLayout>
  );
}

export default parentStudents;
