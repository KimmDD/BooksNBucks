import React, { useEffect } from "react";
import ParentLayout from "../../layouts/parent";
import { Box } from "@mui/system";
import { Typography } from "@mui/material";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import { Button } from "@mui/material";
import { useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import {
  fetchMyStudents,
  fetchPendingPurchases,
  fetchParentProfile,
} from "../../helpers/backend_helper";
import PreLoader from "../../components/common/preloader";
import DashbaordStudent from "../../components/dashboard_student";
import SimpleAddStudents from "../../components/simple_add_students";

function parentDashboard(props) {
  const [gradeAlert, setGradeAlert] = useState(true);
  const router = useRouter();
  const [messageArray, setMessageArray] = useState([]);
  const [firstname, setFirstname] = useState("");
  const [refresh, setRefresh] = useState(false);

  const getParentProfile = () => {
    setLoading(true);
    fetchParentProfile().then(({ error, data }) => {
      if (error === false) {
        setFirstname(data.first_name);
        if (
          data.cell_phone == "" &&
          data.home_phone == "" &&
          data.relationship == ""
        ) {
          setNeedsUpdate(true);
        } else {
          setNeedsUpdate(false);
        }
      } else {
        setLoading(false);
        alert("cannot get parent profile!");
      }
    });
  };

  const getMessage = () => {
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
  function handleGradeClose() {
    setGradeAlert(false);
  }
  function handleGradeView() {
    props.setTabValue("grades");
    router.push("/parent/students");
  }
  function handlePointView() {
    props.setTabValue("award");
    router.push("/parent/students");
  }
  function handleAttendanceView() {
    props.setTabValue("attendence");
    router.push("/parent/students");
  }

  const [requestAlert, setRequestAlert] = useState(true);
  function handleRequestClose() {
    setRequestAlert(false);
  }
  function handleRequestView() {
    props.setTabValue("purchase");
    router.push("/parent/students");
  }

  const [myStudents, setMyStudents] = React.useState([]);
  const [loading, setLoading] = useState(true);
  const [needsUpdate, setNeedsUpdate] = useState(true);

  const getStudents = () => {
    setLoading(true);
    fetchMyStudents().then(({ error, data }) => {
      if (error === false) {
        let student_array = data.my_students.map((student) => {
          return student._id;
        });
        setMyStudents(student_array);
        setLoading(false);
      } else {
        setLoading(false);
        alert("cannot get student!");
      }
    });
  };

  useEffect(() => {
    getStudents();
    getMessage();
    getParentProfile();
  }, []);

  if (loading) {
    return <PreLoader />;
  }

  if (myStudents.length == 0) {
    return (
      <ParentLayout>
        <Box sx={{ marginTop: "20px" }}>
          <Typography variant="h1">Welcome {firstname}!</Typography>
        </Box>
        <Stack sx={{ width: "100%", mt: 2 }} spacing={2}>
          <Alert
            severity="warning"
            action={<SimpleAddStudents getStudents={getStudents} />}
            variant="standard"
          >
            Add your students to view their information on your Dashboard
          </Alert>
          {needsUpdate && (
            <Alert
              severity="info"
              action={
                <Button
                  sx={{ color: "#E02B4C" }}
                  color="inherit"
                  size="small"
                  onClick={() => {
                    router.push("/parent/my_account/");
                  }}
                >
                  View
                </Button>
              }
              variant="standard"
            >
              Update your account information
            </Alert>
          )}
        </Stack>
        <Box
          sx={{ wdith: 1, display: "flex", justifyContent: "center", mt: 5 }}
        >
          <Box>
            <Image
              src="/images/duck.png"
              alt="Cute Duck"
              width={200}
              height={200}
            />
            <Typography component="div">
              No information to display yet
            </Typography>
          </Box>
        </Box>
      </ParentLayout>
    );
  }
  return (
    <ParentLayout>
      <Box sx={{ marginTop: "20px" }}>
        <Typography variant="h1">Welcome {firstname}!</Typography>

        {/* Alert Part */}
        <Stack sx={{ width: "100%", mt: 2 }} spacing={2}>
          {needsUpdate && (
            <Alert
              severity="info"
              action={
                <Button
                  sx={{ color: "#E02B4C" }}
                  color="inherit"
                  size="small"
                  onClick={() => {
                    router.push("/parent/my_account/");
                  }}
                >
                  View
                </Button>
              }
              variant="standard"
            >
              Update your account and notification settings
            </Alert>
          )}
          {messageArray.map((alert) => {
            return (
              <Alert
                severity="error"
                action={
                  <>
                    <Button
                      sx={{ color: "#E02B4C" }}
                      color="inherit"
                      size="small"
                      onClick={() => {
                        props.setStudentId(alert.purchased_by._id);
                        handleRequestView();
                      }}
                    >
                      View
                    </Button>
                  </>
                }
              >
                {alert.purchased_by.first_name +
                  " " +
                  alert.purchased_by.last_name}
                ’s request to purchase {alert.product.name}.
              </Alert>
            );
          })}
        </Stack>
        {myStudents.map((student) => {
          return (
            <DashbaordStudent
              id={student}
              tabValue={props.tabValue}
              setTabValue={props.setTabValue}
              studentId={props.studentId}
              setStudentId={props.setStudentId}
            />
          );
        })}
      </Box>
    </ParentLayout>
  );
}

export default parentDashboard;
