import React, { useEffect } from "react";
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
import { Chip, Button, Typography } from "@mui/material";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { Box } from "@mui/system";
import { fetchPurchaseHistory } from "../../helpers/backend_helper";
import PreLoader from "../common/preloader";
import { updataePurchaseStatus } from "../../helpers/backend_helper";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import { notification } from "antd";

function createData(id, date, item, value, status) {
  return { id, date, item, value, status };
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
    id: "item",
    numeric: false,
    disablePadding: false,
    label: "Item",
    sortable: true,
  },
  {
    id: "value",
    numeric: true,
    disablePadding: false,
    label: "Item Value",
    sortable: true,
  },
  {
    id: "status",
    numeric: false,
    disablePadding: false,
    label: "Status",
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

function PurchaseTab(props) {
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("status");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [open, setOpen] = useState(false);
  const [approveName, setApproveName] = useState("");
  const [approveValue, setApproveValue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [left, setLeft] = useState(0);
  const [spent, setSpent] = useState(0);
  const [rows, setRows] = useState([]);
  const [refresh, setRefresh] = useState(false);

  const getPurchaseHistory = (id) => {
    setLoading(true);
    fetchPurchaseHistory({ student_id: id }).then(({ error, data }) => {
      if (error === false) {
        if (data.length !== 0) {
          setLeft(data[0].purchased_by.points);
          let spentTemp = 0;
          let array = [];
          data.forEach((purchase) => {
            spentTemp += purchase.cost;
            array.push(
              createData(
                purchase._id,
                purchase.updatedAt.substring(0, 10),
                purchase.product.name,
                purchase.cost,
                purchase.status === "Pending" ? "0" : purchase.status
              )
            );
          });
          setRows(array);
          setSpent(spentTemp);
        } else {
          setRows([]);
        }
        setLoading(false);
      } else {
        setLoading(false);
        alert("cannot get student!");
      }
    });
  };

  useEffect(() => {
    getPurchaseHistory(props.id);
  }, [props.id, refresh]);

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
          } else {
            notification.open({
              message: "Success",
              description: "Successfully rejected!",
              icon: <CheckCircleOutlineRoundedIcon color="success" />,
            });
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

  const handleClickOpen = (item, value) => {
    setOpen(true);
    setApproveName(item);
    setApproveValue(value);
  };

  const handleClose = () => {
    setOpen(false);
    setRefresh(!refresh);
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

  if (rows.length == 0) {
    return <>Your kid haven't made any purchases yet.</>;
  }

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
          width: 1,
        }}
      >
        <Box>
          <Typography variant="small">Earned:</Typography>
          <Box
            sx={{
              bgcolor: "primary.main",
              borderRadius: "20px",
              padding: "30px 0",
              textAlign: "center",
              width: "250px",
            }}
          >
            <Typography variant="h3" sx={{ color: "primary.contrastText" }}>
              {spent + left} Points
            </Typography>
          </Box>
        </Box>
        <Box>
          <Typography variant="small">Spent:</Typography>
          <Box
            sx={{
              bgcolor: "primary.main",
              borderRadius: "20px",
              padding: "30px 0",
              textAlign: "center",
              width: "250px",
            }}
          >
            <Typography variant="h3" sx={{ color: "primary.contrastText" }}>
              {spent} Points
            </Typography>
          </Box>
        </Box>
        <Box>
          <Typography variant="small">Left:</Typography>
          <Box
            sx={{
              bgcolor: "primary.main",
              borderRadius: "20px",
              padding: "30px 0",
              textAlign: "center",
              width: "250px",
            }}
          >
            <Typography variant="h3" sx={{ color: "primary.contrastText" }}>
              {left} Points
            </Typography>
          </Box>
        </Box>
      </Box>
      <Paper sx={{ width: "100%", mb: 2, mt: 3, borderRadius: 5 }}>
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
                  if (row.status === "0") {
                    return (
                      <StyledTableRow
                        // hover
                        tabIndex={-1}
                        key={index}
                        sx={{ bgcolor: "primary.light" }}
                      >
                        <StyledTableCell align="left">
                          {row.date}
                        </StyledTableCell>
                        <StyledTableCell align="left">
                          {row.item}
                        </StyledTableCell>
                        <StyledTableCell align="left">
                          {row.value}
                        </StyledTableCell>
                        <StyledTableCell align="left">
                          <Chip
                            label={"Pending"}
                            variant="filled"
                            clickable
                            icon={<ArrowForwardRoundedIcon />}
                            color="warning"
                            onClick={() => {
                              handleClickOpen(row.item, row.value);
                            }}
                          />
                          <Dialog
                            open={open}
                            onClose={handleClose}
                            aria-labelledby="alert-dialog-title"
                            aria-describedby="alert-dialog-description"
                          >
                            <DialogTitle id="alert-dialog-title">
                              {"Do you want to approve this purchase?"}
                            </DialogTitle>
                            <DialogContent>
                              <DialogContentText id="alert-dialog-description">
                                Item: {approveName}. Item value: {approveValue}
                              </DialogContentText>
                            </DialogContent>
                            <DialogActions>
                              <Button
                                onClick={() => {
                                  updateStatus(row.id, "Rejected");
                                  handleClose();
                                }}
                              >
                                Reject
                              </Button>
                              <Button
                                onClick={() => {
                                  updateStatus(row.id, "Approved");
                                  handleClose();
                                }}
                                autoFocus
                              >
                                Approve
                              </Button>
                            </DialogActions>
                          </Dialog>
                        </StyledTableCell>
                      </StyledTableRow>
                    );
                  } else {
                    return (
                      <StyledTableRow tabIndex={-1} key={index}>
                        <StyledTableCell align="left">
                          {row.date}
                        </StyledTableCell>
                        <StyledTableCell align="left">
                          {row.item}
                        </StyledTableCell>
                        <StyledTableCell align="left">
                          {row.value}
                        </StyledTableCell>
                        <StyledTableCell align="left">
                          {row.status === "Delivered" && (
                            <Chip
                              label={row.status}
                              variant="filled"
                              color={"success"}
                            />
                          )}
                          {row.status === "Rejected" && (
                            <Chip
                              label={row.status}
                              variant="filled"
                              color={"primary"}
                            />
                          )}
                          {row.status === "Approved" && (
                            <Chip
                              label={row.status}
                              variant="filled"
                              color={"info"}
                            />
                          )}
                        </StyledTableCell>
                      </StyledTableRow>
                    );
                  }
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

export default PurchaseTab;
