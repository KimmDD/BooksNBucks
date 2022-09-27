import React, { useEffect } from "react";
import ParentLayout from "../../../layouts/parent";
import styles from "./index.module.css";
import { styled } from "@mui/system";
import { Box } from "@mui/system";
import { Typography } from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { useState } from "react";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import AttendenceTab from "../../../components/student_tabs/AttendenceTab";
import GradesTab from "../../../components/student_tabs/GradesTab";
import PurchaseTab from "../../../components/student_tabs/PurchaseTab";
import AwardTab from "../../../components/student_tabs/AwardTab";
import Avatar from "antd/lib/avatar/avatar";
import { fetchMyStudents } from "../../../helpers/backend_helper";
import { useRouter } from "next/router";
import AddStudents from "../../../components/add_students";

function parentStudents(props) {
  const [myStudents, setMyStudents] = useState([]);
  // const [studentId, setStudentId] = useState();
  const router = useRouter();

  useEffect(() => {
    getStudents();
  }, []);

  const getStudents = () => {
    fetchMyStudents().then(({ error, data }) => {
      if (error === false) {
        console.log(data);
        if (data.my_students.length === 0) {
          alert("No students found!");
          router.push("/parent");
        } else {
          setMyStudents(data.my_students);
          if (props.studentId == 0) {
            props.setStudentId(data.my_students[0]._id);
          }
        }
      } else {
        alert("cannot get student!");
      }
    });
  };

  const handleChange = (event, newValue) => {
    props.setTabValue(newValue);
  };

  const handleNameChange = (event) => {
    props.setStudentId(event.target.value);
  };

  const Dropdown = styled(Select)(() => ({
    "& input": {
      paddingLeft: "20px",
    },
    "& fieldset": {
      borderRadius: "20px",
    },
  }));

  return (
    <ParentLayout>
      <Box sx={{ marginTop: "50px" }}>
        <Box className={styles.student_select_container}>
          <Typography
            variant="small"
            sx={{
              display: "block",
              marginBottom: "5px",
            }}
          >
            You are currently viewing
          </Typography>
          <Box className={styles.student_select}>
            <FormControl sx={{ minWidth: "200px" }}>
              <InputLabel id="name-label">Name</InputLabel>
              <Dropdown
                labelId="name-label"
                hiddenLabel
                id="demo-simple-select"
                label="Name"
                value={props.studentId}
                onChange={handleNameChange}
              >
                {myStudents.map((student) => {
                  let name = student.first_name + " " + student.last_name;
                  return (
                    <MenuItem value={student._id}>
                      <Avatar>
                        {student.first_name[0].toUpperCase() +
                          student.last_name[0].toUpperCase()}
                      </Avatar>
                      <Typography
                        variant="body1"
                        sx={{ display: "inline-block", ml: 1 }}
                      >
                        {name}
                      </Typography>
                    </MenuItem>
                  );
                })}
              </Dropdown>
            </FormControl>
            <Typography variant="h2">Profile</Typography>
            <AddStudents />
          </Box>
        </Box>

        <Box sx={{ width: "100%", marginTop: 3 }}>
          <TabContext value={props.tabValue}>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <TabList onChange={handleChange} centered>
                <Tab label="Grades" value="grades" />
                <Tab label="Attendance" value="attendence" />
                <Tab label="Award History" value="award" />
                <Tab label="Purchase History" value="purchase" />
              </TabList>
            </Box>
            <TabPanel value="grades">
              <GradesTab id={props.studentId} />
            </TabPanel>
            <TabPanel value="attendence">
              <AttendenceTab id={props.studentId} />
            </TabPanel>
            <TabPanel value="award">
              <AwardTab id={props.studentId} />
            </TabPanel>
            <TabPanel value="purchase">
              <PurchaseTab id={props.studentId} />
            </TabPanel>
          </TabContext>
        </Box>
      </Box>
    </ParentLayout>
  );
}

export default parentStudents;
