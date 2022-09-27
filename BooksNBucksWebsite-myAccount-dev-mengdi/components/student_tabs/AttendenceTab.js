import React, { useEffect } from "react";
import { Box } from "@mui/system";
import { TableHead, Typography } from "@mui/material";
import { styled } from "@mui/system";
import Select from "@mui/material/Select";
import { MenuItem, FormControl, InputLabel } from "@mui/material";
import { useState } from "react";
import EnhancedTableHead from "./EnhancedTableHead";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Chip } from "@mui/material";
import { fetchMyStudentsAttendance } from "../../helpers/backend_helper";
import PreLoader from "../common/preloader";

function createData(date, day, present) {
  return { date, day, present };
}
function createDataAll(subject, present, absent) {
  return { subject, present, absent };
}

function parseISOString(s) {
  var b = s.split(/\D+/);
  return new Date(Date.UTC(b[0], --b[1], b[2], b[3], b[4], b[5], b[6]));
}

const weekday = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

// This method is created for cross-browser compatibility, if you don't
// need to support IE11, you can use Array.prototype.sort() directly
function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  {
    id: "date",
    numeric: true,
    disablePadding: false,
    label: "Date",
    sortable: true,
  },
  {
    id: "day",
    numeric: true,
    disablePadding: false,
    label: "Day",
    sortable: true,
  },
  {
    id: "present",
    numeric: true,
    disablePadding: false,
    label: "Attendence",
    sortable: true,
  },
];

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
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

function AttendenceTab(props) {
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("date");
  const [subjectId, setSubjectId] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [subjectArray, setSubjectArray] = useState([]);
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (props.id) {
      getAttendance({ student_id: props.id });
    }
  }, [subjectId, props.id]);

  const getAttendance = (id) => {
    setLoading(true);
    fetchMyStudentsAttendance(id).then(({ error, data }) => {
      if (error === false) {
        console.log(id)
        let subArray = [];
        let attArray = [];
        data.forEach((record) => {
          if (!subArray.includes(record.class.name)) {
            subArray.push(record.class.name);
          }
        });
        if (subjectId == 0) {
          subArray.forEach((subject) => {
            let present = 0;
            let absent = 0;
            for (let i = 0; i < data.length; i++) {
              if (subject === data[i].class.name) {
                if (data[i].status == 2) {
                  absent++;
                } else {
                  present++;
                }
              }
            }
            attArray.push(createDataAll(subject, present, absent));
            setAttendanceData(attArray);
          });
        } else {
          data.forEach((record) => {
            if (record.class.name == subArray[subjectId - 1]) {
              attArray.push(
                createData(
                  record.date.substring(0, 10),
                  parseISOString(record.date).getDay(),
                  record.status
                )
              );
            }
          });
          setAttendanceData(attArray);
        }

        setSubjectArray(subArray);
        setLoading(false);
      } else {
        setLoading(false);
        alert("cannot get attendance!");
      }
    });
  };

  const handleSubjectChange = (event) => {
    setSubjectId(event.target.value);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0
      ? Math.max(0, (1 + page) * rowsPerPage - attendanceData.length)
      : 0;

  const Dropdown = styled(Select)(() => ({
    "& input": {
      paddingLeft: "20px",
    },
    "& fieldset": {
      borderRadius: "20px",
    },
  }));

  if (loading) {
    return <PreLoader />;
  }

  if (attendanceData.length == 0) {
    return <>Your kid don't have any attendance record</>;
  }

  return (
    <>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <FormControl sx={{ minWidth: "200px" }}>
          <InputLabel id="subject">Course</InputLabel>
          <Dropdown
            labelId="subject"
            hiddenLabel
            id="demo-simple-select"
            label="subject"
            value={subjectId}
            onChange={handleSubjectChange}
          >
            <MenuItem value={0}>All</MenuItem>
            {subjectArray.map((subject, index) => {
              return <MenuItem value={index + 1}>{subject}</MenuItem>;
            })}
          </Dropdown>
        </FormControl>
        <Typography variant="h5" sx={{ marginLeft: 3 }}>
          Attendance Report
        </Typography>
      </Box>
      <Paper sx={{ width: "100%", mb: 2, mt: 3, borderRadius: 5}}>
        {subjectId !== 0 ? (
          <TableContainer>
            <Table
              sx={{ minWidth: 750 }}
              aria-labelledby="tableTitle"
              size="medium"
            >
              <EnhancedTableHead
                headCells={headCells}
                order={order}
                orderBy={orderBy}
                onRequestSort={handleRequestSort}
                rowCount={attendanceData.length}
              />
              <TableBody>
                {/* if you don't need to support IE11, you can replace the `stableSort` call with:
                 rows.slice().sort(getComparator(order, orderBy)) */}
                {stableSort(attendanceData, getComparator(order, orderBy))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => {
                    const labelId = `enhanced-table-checkbox-${index}`;

                    return (
                      <StyledTableRow tabIndex={-1} key={row.name}>
                        <StyledTableCell align="left">{row.date}</StyledTableCell>
                        <StyledTableCell align="left">{weekday[row.day]}</StyledTableCell>
                        <StyledTableCell align="left">
                          {row.present == 1 && (
                            <Chip label="Present" color="success" />
                          )}
                          {row.present == 2 && (
                            <Chip label="Absent" color="error" />
                          )}
                          {row.present == 3 && (
                            <Chip label="Late" color="warning" />
                          )}
                          {row.present == 4 && (
                            <Chip label="Left Early" color="warning" />
                          )}
                        </StyledTableCell>
                      </StyledTableRow>
                    );
                  })}
                {emptyRows > 0 && (
                  <StyledTableRow
                    style={{
                      height: 53 * emptyRows,
                    }}
                  >
                    <StyledTableCell colSpan={6} />
                  </StyledTableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <TableContainer>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Subject</TableCell>
                  <TableCell align="right">Present</TableCell>
                  <TableCell align="right">Absent</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {attendanceData.map((row) => (
                  <StyledTableRow
                    key={row.subject}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <StyledTableCell component="th" scope="row">
                      {row.subject}
                    </StyledTableCell>
                    <StyledTableCell align="right">{row.present}</StyledTableCell>
                    <StyledTableCell align="right">{row.absent}</StyledTableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
        {subjectId !== 0 && (
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={attendanceData.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        )}
      </Paper>
    </>
  );
}

export default AttendenceTab;
