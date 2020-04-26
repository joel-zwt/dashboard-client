import React, { useState, useEffect } from "react";
import clsx from "clsx";
import PropTypes from "prop-types";
// import moment from "moment";
// import axios from "axios";
import PerfectScrollbar from "react-perfect-scrollbar";
import { makeStyles } from "@material-ui/styles";
import {
  Card,
  CardActions,
  CardContent,
  Avatar,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  TablePagination,
  TableSortLabel,
  Toolbar,
  Grid,
  Tooltip,
  IconButton,
  CircularProgress,
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import GetAppIcon from "@material-ui/icons/GetApp";
import EditIcon from "@material-ui/icons/Edit";
// import { withRouter } from "react-router-dom";

// import { getInitials } from "../../../../helpers";

const useStyles = makeStyles((theme) => ({
  root: {},
  options: {
    backgroundColor: theme.palette.primary.dark,
    color: theme.palette.white,
  },
  infoHead: {
    padding: theme.spacing(3, 2),
  },
  tableHead: {
    backgroundColor: theme.palette.primary.dark,
  },
  headCell: {
    color: theme.palette.white,
    "&:hover": {
      color: theme.palette.white,
    },
    active: {
      color: theme.palette.white,
    },
  },
  loading: {
    // width: "100&",
    height: "75px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    // padding: theme.spacing(2),
  },
  content: {
    padding: 0,
  },
  inner: {
    minWidth: 1050,
  },
  nameContainer: {
    display: "flex",
    alignItems: "center",
  },
  avatar: {
    marginRight: theme.spacing(2),
  },
  actions: {
    justifyContent: "flex-end",
    [theme.breakpoints.down("sm")]: {
      justifyContent: "center",
    },
  },
  visuallyHidden: {
    border: 0,
    clip: "rect(0 0 0 0)",
    height: 1,
    margin: -1,
    overflow: "hidden",
    padding: 0,
    position: "absolute",
    top: 20,
    width: 1,
  },
  hidden: {
    display: "none",
  },
}));

const EmployeesTable = (props) => {
  var {
    className,
    filter,
    employees,
    totalEmployees,
    setEmployeeTableData,
    employeeTableData,
    loading,
    setDeleteData,
    ...rest
  } = props;

  const classes = useStyles();
  const tableHead = ["Name", "Email", "Gender", "Department", "Actions"];
  const [count, setCount] = useState(10);
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);
  const [orderColumn, setOrderColumn] = useState("Name");
  const [orderDirection, setOrderDirection] = useState("asc");
  const [data, setData] = useState([]);
  const [loader, setLoader] = useState(true);

  //this is to store the data from props to the local object
  useEffect(() => {
    setData(employees);
    setCount(totalEmployees);
    if (employeeTableData.page >= 0) {
      setPage(employeeTableData.page);
    }
  }, [employees, totalEmployees]);

  useEffect(() => {
    setLoader(loading);
  }, [loading]);

  useEffect(() => {
    // axios({
    //   method: "post",
    //   url: "/employees/",
    //   data: {
    //     page: page,
    //     rowsPerPage: rowsPerPage,
    //     orderDirection: orderDirection,
    //     orderColumn: orderColumn.toLowerCase(),
    //   },
    // }).then((result) => {
    //   setData(result.data.employees);
    //   setCount(result.data.count);
    // });
    setEmployeeTableData({
      page: page,
      rowsPerPage: rowsPerPage,
      orderDirection: orderDirection,
      orderColumn: orderColumn.toLowerCase(),
    });
  }, [orderColumn, orderDirection, page, rowsPerPage]);

  const handleSelectAll = (event) => {
    let newSelectedEmployees;
    console.log(event.target.checked);
    if (event.target.checked) {
      if (selectedEmployees.length > 0) {
        newSelectedEmployees = [];
      } else {
        newSelectedEmployees = data.map((employee) => employee.v_employeeId);
      }
    } else {
      newSelectedEmployees = [];
    }
    setSelectedEmployees(newSelectedEmployees);
    console.log("selected", newSelectedEmployees);
  };

  const handleSelectOne = (event, id) => {
    const selectedIndex = selectedEmployees.indexOf(id);
    let newSelectedEmployees = [];

    //if not selected, then add
    if (selectedIndex === -1) {
      newSelectedEmployees = newSelectedEmployees.concat(selectedEmployees, id);
    }
    //already selected, then remove
    else if (selectedIndex === 0) {
      newSelectedEmployees = newSelectedEmployees.concat(
        selectedEmployees.slice(1)
      );
    } else if (selectedIndex === selectedEmployees.length - 1) {
      newSelectedEmployees = newSelectedEmployees.concat(
        selectedEmployees.slice(0, -1)
      );
    } else if (selectedIndex > 0) {
      newSelectedEmployees = newSelectedEmployees.concat(
        selectedEmployees.slice(0, selectedIndex),
        selectedEmployees.slice(selectedIndex + 1)
      );
    }
    setSelectedEmployees(newSelectedEmployees);
    console.log(newSelectedEmployees);
    // console.log(newSelectedEmployees);
  };

  const handlePageChange = (event, page) => {
    setPage(page);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(event.target.value);
  };

  const handleSort = (column) => {
    return (event) => {
      setPage(0);
      if (orderColumn === column) {
        if (orderDirection === "asc") {
          setOrderDirection("desc");
        } else {
          setOrderDirection("asc");
        }
      } else {
        setOrderColumn(column);
        setOrderDirection("asc");
      }
    };
  };

  //withrouter hoc giving context warning hence using window
  const handleEdit = (id) => {
    // props.history.push("/employees/edit/" + id);
    window.location.assign("/employees/edit/" + id);
  };

  const handleSingleDelete = (id) => {
    var del = [];
    del.push(id);
    setDeleteData(del);
  };

  const handleDelete = () => {
    if (selectedEmployees.length > 0) {
      setDeleteData(selectedEmployees);
      setSelectedEmployees([]);
      // setPage(0);
    }
  };

  return (
    <Card {...rest} className={clsx(classes.root, className)}>
      <CardContent className={classes.content}>
        <Toolbar
          disableGutters
          className={clsx(
            selectedEmployees.length && classes.options,
            classes.infoHead
          )}
        >
          {selectedEmployees.length > 0 ? (
            <Grid container alignItems="center">
              <Grid item xs={8}>
                <Typography variant="subtitle1" color="inherit">
                  {selectedEmployees.length} selected on this page
                </Typography>
              </Grid>
              <Grid
                item
                xs={4}
                container
                spacing={2}
                justify="flex-end"
                alignItems="center"
              >
                <Grid item>
                  <Tooltip title="Download">
                    <IconButton color="inherit" size="small">
                      <GetAppIcon />
                    </IconButton>
                  </Tooltip>
                </Grid>
                <Grid item>
                  <Tooltip title="Delete">
                    <IconButton
                      color="inherit"
                      size="small"
                      onClick={handleDelete}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </Grid>
              </Grid>
            </Grid>
          ) : (
            <Typography variant="h2">Employee List</Typography>
          )}
        </Toolbar>
        <PerfectScrollbar>
          <div>
            <Table>
              <TableHead className={classes.tableHead}>
                <TableRow>
                  <TableCell padding="checkbox">
                    <Checkbox
                      className={classes.headCell}
                      checked={selectedEmployees.length === data.length}
                      color="default"
                      indeterminate={
                        selectedEmployees.length > 0 &&
                        selectedEmployees.length < data.length
                      }
                      onChange={handleSelectAll}
                    />
                  </TableCell>
                  {tableHead.map((column) => (
                    <TableCell key={column}>
                      <TableSortLabel
                        // className={classes.headCell}
                        active={orderColumn === column}
                        direction={
                          orderColumn === column ? orderDirection : "asc"
                        }
                        onClick={handleSort(column)}
                      >
                        <span className={classes.headCell}>{column}</span>
                      </TableSortLabel>
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>

              <TableBody>
                <TableRow
                  className={clsx(classes.tableRow, !loader && classes.hidden)}
                >
                  <TableCell colSpan={tableHead.length + 1}>
                    <div className={classes.loading}>
                      <CircularProgress size={40} thickness={5} />
                    </div>
                  </TableCell>
                </TableRow>
                {data.length == 0 ? (
                  <TableRow
                    className={clsx(classes.tableRow, loader && classes.hidden)}
                  >
                    <TableCell colSpan={tableHead.length + 1}>
                      <div className={classes.loading}>
                        <Typography variant="h3">No results to show</Typography>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  data
                    // .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((employee) => (
                      <TableRow
                        // className={classes.tableRow}
                        className={clsx(loader && classes.hidden)}
                        hover
                        key={employee.v_employeeId}
                        selected={
                          selectedEmployees.indexOf(employee.v_employeeId) !==
                          -1
                        }
                      >
                        <TableCell padding="checkbox">
                          <Checkbox
                            checked={
                              selectedEmployees.indexOf(
                                employee.v_employeeId
                              ) !== -1
                            }
                            color="primary"
                            onChange={(event) =>
                              handleSelectOne(event, employee.v_employeeId)
                            }
                            value="true"
                          />
                        </TableCell>

                        <TableCell>
                          <div className={classes.nameContainer}>
                            <Avatar
                              className={classes.avatar}
                              src={employee.v_imgURL}
                            ></Avatar>
                            <Typography variant="body1">
                              {employee.v_name}
                            </Typography>
                          </div>
                        </TableCell>
                        <TableCell>{employee.v_email}</TableCell>
                        <TableCell>{employee.e_gender}</TableCell>
                        <TableCell>{employee.v_department}</TableCell>
                        <TableCell>
                          <Tooltip title="Edit">
                            <IconButton
                              color="primary"
                              size="medium"
                              disabled={selectedEmployees.length > 0}
                              onClick={() => handleEdit(employee.v_employeeId)}
                            >
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton
                              color="primary"
                              size="medium"
                              disabled={selectedEmployees.length > 0}
                              onClick={() =>
                                handleSingleDelete(employee.v_employeeId)
                              }
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))
                )}
              </TableBody>
            </Table>
          </div>
        </PerfectScrollbar>
      </CardContent>
      <CardActions className={classes.actions}>
        <TablePagination
          component="div"
          count={count}
          onChangePage={handlePageChange}
          onChangeRowsPerPage={handleRowsPerPageChange}
          page={page}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </CardActions>
    </Card>
  );
};

EmployeesTable.propTypes = {
  className: PropTypes.string,
};

export default EmployeesTable;
