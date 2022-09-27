import React, { useEffect } from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { AppBar, Button } from "@mui/material";
import { Toolbar } from "@mui/material";
import styles from "./index.module.css";
import { IconButton } from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { useRouter } from "next/router";
import { updataePurchaseStatus } from "../../helpers/backend_helper";
import { Badge } from "@mui/material";
import Preloader from "../common/preloader";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import { notification } from "antd";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3, maxWidth: "600px" }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `vertical-tab-${index}`,
    "aria-controls": `vertical-tabpanel-${index}`,
  };
}

export default function Message(props) {
  const [value, setValue] = React.useState(0);
  const [loading, setLoading] = React.useState(false);
  const router = useRouter();

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const updateStatus = (id, newStatus) => {
    setLoading(true);
    updataePurchaseStatus({ purchase_id: id, status: newStatus }).then(
      ({ error, data }) => {
        if (error === false) {
          if (newStatus == "Approved") {
            notification.open({
              message: "Success",
              description: "Successfully approved!",
              icon: <CheckCircleOutlineRoundedIcon color="success" />,
            });
            props.setRefresh(!props.refresh);
          } else {
            notification.open({
              message: "Success",
              description: "Successfully rejected!",
              icon: <CheckCircleOutlineRoundedIcon color="success" />,
            });
            props.setRefresh(!props.refresh);
          }
          setLoading(false);
        } else {
          setLoading(false);
          notification.open({
            message: "Error",
            description: "Encountered an error",
            icon: <CancelRoundedIcon color="error" />,
          });
        }
      }
    );
  };

  if (loading) {
    return <Preloader />;
  }

  return (
    <Box
      sx={{
        maxHeight: "600px",
        width: "800px",
        borderRadius: "20px",
        overflow: "hidden",
      }}
    >
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Message
          </Typography>
          <IconButton onClick={props.handleMessageClose}>
            <CloseRoundedIcon sx={{ color: "white" }} />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Box
        sx={{
          flexGrow: 1,
          bgcolor: "background.paper",
          display: "flex",
          width: 1,
        }}
        className={styles.tabs}
      >
        <Tabs
          orientation="vertical"
          variant="scrollable"
          value={value}
          onChange={handleChange}
          aria-label="Vertical tabs example"
          sx={{ borderRight: 1, borderColor: "divider", width: "200px" }}
        >
          {props.messageArray.map((record, index) => {
            let label =
              record.purchased_by.first_name +
              " " +
              record.purchased_by.last_name +
              "'s purchase requests.";
            return <Tab label={label} {...a11yProps(index)} />;
          })}
        </Tabs>
        {props.messageArray.map((record, index) => {
          return (
            <TabPanel value={value} index={index} sx={{ width: "500px" }}>
              <Typography variant="h5" sx={{ mb: 3 }}>
                {record.purchased_by.first_name} requested to purchase{" "}
                {record.product.name}.
              </Typography>
              <Typography variant="h6" sx={{ mb: 3 }}>
                Cost: {record.cost} points
              </Typography>
              <img
                src={record.product.image}
                alt={record.product.name}
                className={styles.msgImg}
              />
              <Button
                variant="outlined"
                sx={{
                  borderRadius: "20px",
                  border: "1px solid #E02B4C!important",
                }}
                onClick={() => {
                  updateStatus(record._id, "Rejected");
                }}
              >
                Reject
              </Button>
              <Button
                variant="contained"
                sx={{ borderRadius: "20px", ml: 2 }}
                onClick={() => {
                  updateStatus(record._id, "Approved");
                }}
              >
                Approve
              </Button>
            </TabPanel>
          );
        })}
      </Box>
    </Box>
  );
}
