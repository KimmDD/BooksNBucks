import React, { useEffect } from "react";
import { styled } from "@mui/material/styles";
import { grey } from "@mui/material/colors";
import { Box } from "@mui/system";
import { Typography } from "@mui/material";
import Stack from "@mui/material/Stack";
import { useState } from "react";
import Grid from "@mui/material/Grid";
import WorkspacePremiumRoundedIcon from "@mui/icons-material/WorkspacePremiumRounded";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { fetchStudentDashboard } from "../../helpers/backend_helper";
import { fetchMyStudentAward } from "../../helpers/backend_helper";
// import { getSchool } from "../../helpers/backend_helper";
import PreLoader from "../../components/common/preloader";
import { useRouter } from "next/router";

function createData(date, action, received, by) {
  return { date, action, received, by };
}

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

export default function DashboardStudent(props) {
  const [firstname, setFirstName] = useState("a");
  const [lastname, setLastName] = useState("a");
  const [school, setSchool] = useState("");
  const [email, setEmail] = useState("");
  const [point, setPoint] = useState("");
  const [rows, setRows] = useState(["a", "b"]);
  const [studentId, setStudentId] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  console.log(rows);

  const getStudentDashboard = (id) => {
    setLoading(true);
    fetchStudentDashboard({ student_id: id }).then(({ error, data }) => {
      if (error === false) {
        setFirstName(data.first_name);
        setLastName(data.last_name);
        setSchool(data.school.name);
        setEmail(data.email);
        setPoint(data.points);
        setStudentId(data._id);
        setLoading(false);
      } else {
        setLoading(false);
        alert("cannot get student dashboard!");
      }
    });
  };

  const getMyStudentAward = (id) => {
    setLoading(true);
    fetchMyStudentAward({ student_id: id }).then(({ error, data }) => {
      if (error === false) {
        // console.log(data);
        let array = [];
        data.forEach((record) => {
          array.push(
            createData(
              record.updatedAt.substring(0, 10),
              record.trait.name,
              record.points,
              record.award_by.first_name + " " + record.award_by.last_name
            )
          );
        });
        // console.log(array);
        setRows(array);
        setLoading(false);
      } else {
        setLoading(false);
        alert("cannot get student!");
      }
    });
  };

  useEffect(() => {
    if (props.id) {
      getStudentDashboard(props.id);
      getMyStudentAward(props.id);
    }
  }, [props.id]);

  if (loading) {
    return <PreLoader />;
  }

  return (
    <Grid container spacing={5} sx={{ mt: 1 }}>
      <Grid item lg={6}>
        <Box
          sx={{
            bgcolor: "background.paper",
            borderRadius: "20px",
            overflow: "hidden",
            height: "330px",
          }}
        >
          <Box
            sx={{
              textAlign: "center",
              bgcolor: "primary.main",
              p: 2,
            }}
          >
            <Typography variant="h6" color="primary.contrastText">
              {firstname + " " + lastname}
            </Typography>
          </Box>
          <Box sx={{ width: 1, padding: 3 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-around",
              }}
            >
              <Box
                sx={{
                  width: "150px",
                  height: "150px",
                  borderRadius: "50%",
                  bgcolor: grey[400],
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Box sx={{ fontSize: "50px", color: "white" }}>
                  {firstname[0].toUpperCase() + lastname[0].toUpperCase()}
                </Box>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-around",
                }}
              >
                <Box>
                  <Typography
                    variant="body1"
                    component="p"
                    sx={{ marginBottom: "10px" }}
                  >
                    <b>School: {school}</b>
                  </Typography>
                  <Typography variant="body1" component="p">
                    <b>Email: {email}</b>
                  </Typography>
                </Box>
                <Box
                  sx={{
                    bgcolor: "primary.main",
                    p: 1,
                    color: "primary.contrastText",
                    display: "flex",
                    justifyContent: "center",
                    borderRadius: "20px",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    props.setTabValue("purchase");
                    props.setStudentId(studentId);
                    router.push("/parent/students");
                  }}
                >
                  Points Left: {point}
                </Box>
              </Box>
            </Box>
            <Stack sx={{ mt: 3 }}>
              <Box
                sx={{
                  bgcolor: "background.default",
                  p: 1,
                  display: "flex",
                  justifyContent: "center",
                  borderRadius: "20px",
                  mb: 1,
                  cursor: "pointer",
                }}
                onClick={() => {
                  props.setTabValue("award");
                  props.setStudentId(studentId);
                  router.push("/parent/students");
                }}
              >
                <WorkspacePremiumRoundedIcon
                  sx={{ display: "inline-box", mr: 1 }}
                />
                {firstname + " " + lastname} was awarded {rows[0].received} pts
                for {rows[0].action}
              </Box>
            </Stack>
          </Box>
        </Box>
      </Grid>
      <Grid item lg={6}>
        <Box
          sx={{
            bgcolor: "background.paper",
            borderRadius: "20px",
            overflow: "hidden",
            height: "330px",
          }}
        >
          <Box
            sx={{
              textAlign: "center",
              bgcolor: "primary.main",
              p: 2,
              cursor: "pointer",
            }}
            onClick={() => {
              props.setTabValue("award");
              props.setStudentId(studentId);
              router.push("/parent/students");
            }}
          >
            <Typography variant="h6" color="primary.contrastText">
              {firstname} Award History
            </Typography>
          </Box>
          <Box sx={{ width: 1 }}>
            <TableContainer component={Paper}>
              <Table aria-label="customized table">
                <TableBody>
                  {rows.map((row, index) => (
                    <StyledTableRow key={index}>
                      <StyledTableCell component="th" scope="row">
                        {row.date}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {row.action}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {row.received}
                      </StyledTableCell>
                      <StyledTableCell align="center">{row.by}</StyledTableCell>
                    </StyledTableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
}
