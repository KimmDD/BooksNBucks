import React, { useEffect } from "react";
import { Box } from "@mui/system";
import { Typography } from "@mui/material";
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
import { useUserContext } from "../../contexts/user";
import { getGrades } from "../../helpers/backend_helper";
import PreLoader from "../common/preloader";

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
    id: "name",
    numeric: false,
    disablePadding: false,
    label: "Quiz Name",
    sortable: true,
  },
  {
    id: "award",
    numeric: true,
    disablePadding: false,
    label: "Quiz Award",
    sortable: true,
  },
  {
    id: "grade",
    numeric: false,
    disablePadding: false,
    label: "Quiz Grade",
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
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

function GradesTab(props) {
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("date");
  const [course, setCourse] = useState(0);
  const [gradesData, setGradesData] = useState([]);
  const [courseArray, setCourseArray] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  function createData(date, name, award, grade) {
    return { date, name, award, grade };
  }

  const user = useUserContext();

  const fetchGrades = (id) => {
    setLoading(true);
    getGrades({ student_id: id }).then(({ error, data }) => {
      if (error === false) {
        setGradesData(data);
        if (data.length !== 0) {
          let array = [];
          data.forEach((submission) => {
            if (!array.includes(submission.quiz.course)) {
              array.push(submission.quiz.course);
            }
          });
          setCourseArray(array);
          setCourse(array[0]);
        }
        setLoading(false);
      } else {
        setLoading(false);
        alert("cannot get student!");
      }
    });
  };

  useEffect(() => {
    if (props.id) {
      fetchGrades(props.id);
    }
  }, [props.id]);

  useEffect(() => {
    if (course != 0) {
      let array = [];
      gradesData.forEach((record) => {
        if (record.quiz.course == course) {
          let date = record.date.substring(0, 10);
          let name = record.quiz.title;
          let award = record.award;
          let grade = record.grade;
          array.push(createData(date, name, award, grade));
        }
      });
      setRows(array);
    }
  }, [course]);

  const handleSubjectChange = (event) => {
    setCourse(event.target.value);
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
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

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
  if (gradesData.length !== 0) {
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
              value={course}
              onChange={handleSubjectChange}
            >
              {courseArray.map((course) => {
                return <MenuItem value={course}>{course}</MenuItem>;
              })}
            </Dropdown>
          </FormControl>
          <Typography variant="h5" sx={{ marginLeft: 3 }}>
            Grade Reports
          </Typography>
        </Box>
        <Paper sx={{ width: "100%", mb: 2, mt: 3, borderRadius: 5}}>
          <TableContainer>
            <Table
              sx={{ minWidth: 750}}
              aria-labelledby="tableTitle"
              size="medium"
            >
              <EnhancedTableHead
                headCells={headCells}
                order={order}
                orderBy={orderBy}
                onRequestSort={handleRequestSort}
                rowCount={rows.length}
              />
              <TableBody>
                {/* if you don't need to support IE11, you can replace the `stableSort` call with:
                 rows.slice().sort(getComparator(order, orderBy)) */}
                {stableSort(rows, getComparator(order, orderBy))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => {
                    const labelId = `enhanced-table-checkbox-${index}`;

                    return (
                      <StyledTableRow tabIndex={-1} key={row.name}>
                        <StyledTableCell align="left">
                          {row.date}
                        </StyledTableCell>
                        <StyledTableCell align="left">
                          {row.name}
                        </StyledTableCell>
                        <StyledTableCell align="left">
                          {row.award} Points
                        </StyledTableCell>
                        <StyledTableCell align="left">
                          {row.grade}
                        </StyledTableCell>
                      </StyledTableRow>
                    );
                  })}
                {emptyRows > 0 && (
                  <TableRow
                    style={{
                      height: 53 * emptyRows,
                    }}
                  >
                    <TableCell colSpan={6} />
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={rows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      </>
    );
  } else {
    return <>Your kid didn't take any quizzes</>;
  }
}

export default GradesTab;
