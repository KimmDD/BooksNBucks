import { useContext, useEffect, useState } from "react";
import { styled, useTheme, Theme, CSSObject } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import SchoolRoundedIcon from "@mui/icons-material/SchoolRounded";
import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";
import Fab from "@mui/material/Fab";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import ExitToAppRoundedIcon from "@mui/icons-material/ExitToAppRounded";
import Link from "next/link";
import styles from "./parent.module.css";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useRouter } from "next/router";
import Modal from "@mui/material/Modal";
import Message from "../components/message";
import { Badge } from "@mui/material";
import { signOut } from "../helpers/hooks";
import { UserContext } from "../contexts/user";
import {
  fetchProfile,
  fetchMyStudents,
  fetchPendingPurchases,
} from "../helpers/backend_helper";
import PreLoader from "../components/common/preloader";
import { Dialog, DialogTitle, DialogActions, Button } from "@mui/material";

const parentTheme = createTheme({
  palette: {
    primary: {
      main: "#E02B4C !important",
      light: "#FFC7D1 !important",
      dark: "BA0828 !important",
      contrastText: "#fff !important",
    },
    secondary: {
      main: "#ebebeb !important",
      contrastText: "#6D7477 !important",
    },
    text: {
      primary: "#1F2122 !important",
      secondary: "6D7477 !important",
    },
    background: {
      paper: "#FFFFFE !important",
      default: "#f2f3f5 !important",
    },
  },
  typography: {
    htmlFontSize: 16,
    fontFamily: "'Nunito', sans-serif",
    fontSize: 14,
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 700,
    h1: {
      fontSize: "3rem",
      fontWeight: 700,
    },
    h2: {
      fontSize: "2.5rem",
      fontWeight: 700,
    },
    h3: {
      fontSize: "2rem",
      fontWeight: 700,
    },
  },
});

const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: "56px",
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

function ParentLayout({ children }, props) {
  const [user, setUser] = useState();
  const router = useRouter();
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(true);
  const [messageOpen, setMessageOpen] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [msgNum, setMsgNum] = useState(0);
  const [messageArray, setMessageArray] = useState([]);

  useEffect(() => {
    getProfile();
    getMessage();
  }, [refresh]);

  useEffect(() => {
    setMsgNum(messageArray.length);
  }, [messageArray, refresh]);

  const getMessage = () => {
    setMsgNum(0);
    setMessageArray([]);
    setLoading(true);
    fetchMyStudents().then(({ error, data }) => {
      if (error === false) {
        // console.log(data);
        let studentArray = data.my_students.map((student) => {
          return student._id;
        });
        studentArray.forEach((id) => {
          setLoading(true);
          fetchPendingPurchases({ student_id: id }).then(({ error, data }) => {
            if (error === false) {
              data.forEach((record) => {
                setMessageArray((oldArray) => [...oldArray, record]);
              });
              setLoading(false);
            } else {
              setLoading(false);
              alert("cannot get purchase history!");
            }
          });
        });
        setLoading(false);
      } else {
        setLoading(false);
        alert("cannot get student!");
      }
    });
  };

  const getProfile = () => {
    fetchProfile().then(({ error, data }) => {
      if (error === false) {
        setUser(data);
      } else {
        router.push("/");
      }
    });
  };

  const handleMessageOpen = () => {
    setMessageOpen(true);
  };

  const handleMessageClose = () => {
    setMessageOpen(false);
  };

  const [navStyleOverride, setNavStyleOverride] = useState({
    padding: 0,
    borderRadius: "20px",
    overflow: "hidden",
    margin: "8px 16px",
    width: "85%",
  });

  const handleDrawerOpen = () => {
    setOpen(true);
    setNavStyleOverride({
      padding: 0,
      borderRadius: "20px",
      overflow: "hidden",
      margin: "8px 16px",
      width: "85%",
    });
  };

  const handleDrawerClose = () => {
    setOpen(false);
    setTimeout(() => {
      setNavStyleOverride({
        padding: 0,
        overflow: "hidden",
        borderRadius: "20px",
        margin: "8px 0",
      });
    }, 200);
  };

  const [RemoveOpen, setRemove] = useState(false);
  const handleRemoveOpen = () => {
    setRemove(true);
  };
  const handleRemoveClose = () => {
    setRemove(false);
  };

  if (loading) {
    return <PreLoader />;
  }
  return (
    <UserContext.Provider value={{ ...user, getProfile }}>
      <ThemeProvider theme={parentTheme}>
        <Box sx={{ display: "flex" }}>
          <CssBaseline />
          <Drawer variant="permanent" open={open}>
            <DrawerHeader sx={{ padding: "50px 0 30px 0" }}>
              {open && (
                <>
                  <div className={styles.logoText}>BOOKSNBUCKS&trade;</div>
                  <IconButton onClick={handleDrawerClose}>
                    <ChevronLeftIcon sx={{ color: "white" }} />
                  </IconButton>
                </>
              )}
              {!open && (
                <IconButton
                  color="inherit"
                  aria-label="open drawer"
                  onClick={handleDrawerOpen}
                  sx={{ marginRight: "7px" }}
                >
                  <MenuIcon sx={{ color: "white" }} />
                </IconButton>
              )}
            </DrawerHeader>
            <List sx={{ color: "white" }}>
              <ListItem
                button
                sx={navStyleOverride}
                className={
                  router.pathname === "/parent"
                    ? `${styles.active} ${styles.navItems}`
                    : styles.navItems
                }
              >
                <Link href="/parent">
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <ListItemIcon>
                      <DashboardRoundedIcon sx={{ color: "white" }} />
                    </ListItemIcon>
                    <ListItemText>Dashboard</ListItemText>
                  </div>
                </Link>
              </ListItem>
              <ListItem
                button
                sx={{ padding: 0 }}
                sx={navStyleOverride}
                className={
                  router.pathname === "/parent/students"
                    ? `${styles.active} ${styles.navItems}`
                    : styles.navItems
                }
              >
                <Link href="/parent/students" className={styles.navItems}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <ListItemIcon>
                      <SchoolRoundedIcon sx={{ color: "white" }} />
                    </ListItemIcon>
                    <ListItemText>Students</ListItemText>
                  </div>
                </Link>
              </ListItem>
              <ListItem
                button
                sx={{ padding: 0 }}
                sx={navStyleOverride}
                className={
                  router.pathname === "/parent/my_account"
                    ? `${styles.active} ${styles.navItems}`
                    : styles.navItems
                }
              >
                <Link href="/parent/my_account" className={styles.navItems}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <ListItemIcon>
                      <AccountCircleRoundedIcon sx={{ color: "white" }} />
                    </ListItemIcon>
                    <ListItemText>My Account</ListItemText>
                  </div>
                </Link>
              </ListItem>
            </List>
          </Drawer>
          <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
            {/* <DrawerHeader /> */}
            <Box
              sx={{
                "& > :not(style)": { m: 1 },
                position: "fixed",
                top: "20px",
                right: "20px",
                zIndex: 99999,
              }}
            >
              <Fab
                size="medium"
                color="secondary"
                aria-label="message"
                onClick={handleMessageOpen}
              >
                {msgNum !== 0 ? (
                  <Badge badgeContent={msgNum} color="primary">
                    <EmailRoundedIcon />
                  </Badge>
                ) : (
                  <EmailRoundedIcon />
                )}
              </Fab>
              <Fab
                size="medium"
                color="secondary"
                aria-label="sign out"
                onClick={handleRemoveOpen}
              >
                <ExitToAppRoundedIcon />
              </Fab>
              <Dialog
                open={RemoveOpen}
                onClose={handleRemoveClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
              >
                <DialogTitle id="alert-dialog-title">
                  {"Are you sure that you want to log out?"}
                </DialogTitle>
                <DialogActions>
                  <Button
                    onClick={() => {
                      signOut(router);
                      router.push("/");
                    }}
                  >
                    Log Out
                  </Button>
                  <Button onClick={handleRemoveClose} autoFocus>
                    Cancel
                  </Button>
                </DialogActions>
              </Dialog>
            </Box>
            <Box>{children}</Box>
          </Box>
        </Box>
        <Modal
          open={messageOpen}
          onClose={handleMessageClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Message
            handleMessageClose={handleMessageClose}
            messageArray={messageArray}
            setRefresh={setRefresh}
            refresh={refresh}
          />
        </Modal>
      </ThemeProvider>
    </UserContext.Provider>
  );
}

export default ParentLayout;
