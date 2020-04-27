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
import StatusBullet from "../../../../components/StatusBullet";
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
  status: {
    marginRight: theme.spacing(1),
  },
}));

const AdminTable = (props) => {
  var {
    className,
    filter,
    admin,
    totalAdmin,
    setAdminTableData,
    adminTableData,
    loading,
    setDeleteData,
    ...rest
  } = props;

  const classes = useStyles();
  const tableHead = ["Name", "Email", "Department", "Status", "Actions"];
  const [count, setCount] = useState(10);
  const [selectedAdmin, setSelectedAdmin] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);
  const [orderColumn, setOrderColumn] = useState("Name");
  const [orderDirection, setOrderDirection] = useState("asc");
  const [data, setData] = useState([]);
  const [loader, setLoader] = useState(true);

  //this is to store the data from props to the local object
  useEffect(() => {
    setData(admin);
    setCount(totalAdmin);
    if (adminTableData.page >= 0) {
      setPage(adminTableData.page);
    }
  }, [admin, totalAdmin]);

  useEffect(() => {
    setLoader(loading);
  }, [loading]);

  useEffect(() => {
    setAdminTableData({
      page: page,
      rowsPerPage: rowsPerPage,
      orderDirection: orderDirection,
      orderColumn: orderColumn.toLowerCase(),
    });
  }, [orderColumn, orderDirection, page, rowsPerPage]);

  const handleSelectAll = (event) => {
    let newSelectedAdmin;
    console.log(event.target.checked);
    if (event.target.checked) {
      if (selectedAdmin.length > 0) {
        newSelectedAdmin = [];
      } else {
        newSelectedAdmin = data.map((admin) => admin.v_adminId);
      }
    } else {
      newSelectedAdmin = [];
    }
    setSelectedAdmin(newSelectedAdmin);
    console.log("selected", newSelectedAdmin);
  };

  const handleSelectOne = (event, id) => {
    const selectedIndex = selectedAdmin.indexOf(id);
    let newSelectedAdmin = [];

    //if not selected, then add
    if (selectedIndex === -1) {
      newSelectedAdmin = newSelectedAdmin.concat(selectedAdmin, id);
    }
    //already selected, then remove
    else if (selectedIndex === 0) {
      newSelectedAdmin = newSelectedAdmin.concat(selectedAdmin.slice(1));
    } else if (selectedIndex === selectedAdmin.length - 1) {
      newSelectedAdmin = newSelectedAdmin.concat(selectedAdmin.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelectedAdmin = newSelectedAdmin.concat(
        selectedAdmin.slice(0, selectedIndex),
        selectedAdmin.slice(selectedIndex + 1)
      );
    }
    setSelectedAdmin(newSelectedAdmin);
    console.log(newSelectedAdmin);
    // console.log(newSelectedAdmin);
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
    // props.history.push("/admin/edit/" + id);
    window.location.assign("/admin/edit/" + id);
  };

  const handleSingleDelete = (id) => {
    var del = [];
    del.push(id);
    setDeleteData(del);
  };

  const handleDelete = () => {
    if (selectedAdmin.length > 0) {
      setDeleteData(selectedAdmin);
      setSelectedAdmin([]);
      // setPage(0);
    }
  };

  return (
    <Card {...rest} className={clsx(classes.root, className)}>
      <CardContent className={classes.content}>
        <Toolbar
          disableGutters
          className={clsx(
            selectedAdmin.length && classes.options,
            classes.infoHead
          )}
        >
          {selectedAdmin.length > 0 ? (
            <Grid container alignItems="center">
              <Grid item xs={8}>
                <Typography variant="subtitle1" color="inherit">
                  {selectedAdmin.length} selected on this page
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
            <Typography variant="h2">Admin List</Typography>
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
                      checked={
                        selectedAdmin.length === data.length && data.length != 0
                      }
                      color="default"
                      indeterminate={
                        selectedAdmin.length > 0 &&
                        selectedAdmin.length < data.length
                      }
                      onChange={handleSelectAll}
                    />
                  </TableCell>
                  {tableHead.map((column) =>
                    column == "Actions" ? (
                      <TableCell key={column}>
                        <span className={classes.headCell}>{column}</span>
                      </TableCell>
                    ) : (
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
                    )
                  )}
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
                    .map((admin) => (
                      <TableRow
                        // className={classes.tableRow}
                        className={clsx(loader && classes.hidden)}
                        hover
                        key={admin.v_adminId}
                        selected={selectedAdmin.indexOf(admin.v_adminId) !== -1}
                      >
                        <TableCell padding="checkbox">
                          <Checkbox
                            checked={
                              selectedAdmin.indexOf(admin.v_adminId) !== -1
                            }
                            color="primary"
                            onChange={(event) =>
                              handleSelectOne(event, admin.v_adminId)
                            }
                            value="true"
                          />
                        </TableCell>

                        <TableCell>
                          <div className={classes.nameContainer}>
                            <Avatar
                              className={classes.avatar}
                              src={admin.v_imgURL}
                            ></Avatar>
                            <Typography variant="body1">
                              {admin.v_name}
                            </Typography>
                          </div>
                        </TableCell>
                        <TableCell>{admin.v_email}</TableCell>
                        <TableCell>{admin.v_department}</TableCell>
                        <TableCell>
                          <StatusBullet
                            className={classes.status}
                            color={
                              admin.v_status === "Active" ? "success" : "danger"
                            }
                            size="sm"
                          />
                          {admin.v_status}
                        </TableCell>

                        <TableCell>
                          <Tooltip title="Edit">
                            <IconButton
                              color="primary"
                              size="medium"
                              disabled={selectedAdmin.length > 0}
                              onClick={() => handleEdit(admin.v_adminId)}
                            >
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton
                              color="primary"
                              size="medium"
                              disabled={selectedAdmin.length > 0}
                              onClick={() =>
                                handleSingleDelete(admin.v_adminId)
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

AdminTable.propTypes = {
  className: PropTypes.string,
};

export default AdminTable;
