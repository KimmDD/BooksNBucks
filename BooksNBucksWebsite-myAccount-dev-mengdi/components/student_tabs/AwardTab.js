import React from "react";
import { useEffect } from "react";
import { styled } from "@mui/system";
import Select from "@mui/material/Select";
import { useState } from "react";
import EnhancedTableHead from "./EnhancedTableHead";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { fetchMyStudentAward } from "../../helpers/backend_helper";
import PreLoader from "../common/preloader";

function createData(date, action, received, by) {
  return { date, action, received, by };
}

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
    id: "action",
    numeric: false,
    disablePadding: false,
    label: "Action",
    sortable: true,
  },
  {
    id: "received",
    numeric: true,
    disablePadding: false,
    label: "Points Received",
    sortable: true,
  },
  {
    id: "by",
    numeric: false,
    disablePadding: false,
    label: "Awarded By",
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

function AwardTab(props) {
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("date");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  const getMyStudentAward = (id) => {
    setLoading(true);
    fetchMyStudentAward({ student_id: id }).then(({ error, data }) => {
      if (error === false) {
        //console.log(data);
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
        //console.log(array);
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
      getMyStudentAward(props.id);
    }
  }, [props.id]);

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
  if (rows.length == 0) {
    return <>Your kid haven't get any awards yet.</>;
  }
  return (
    <>
      <Paper sx={{ width: "100%", mb: 2, mt: 3, borderRadius: 5}}>
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
                    <StyledTableRow tabIndex={-1} key={index}>
                      <StyledTableCell align="left">{row.date}</StyledTableCell>
                      <StyledTableCell align="left">
                        {row.action}
                      </StyledTableCell>
                      <StyledTableCell align="left">
                        {row.received}
                      </StyledTableCell>
                      <StyledTableCell align="left">{row.by}</StyledTableCell>
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
}

export default AwardTab;
