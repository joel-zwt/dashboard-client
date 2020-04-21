import React, { useState, useEffect } from "react";
import clsx from "clsx";
import PropTypes from "prop-types";
import moment from "moment";
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
} from "@material-ui/core";

import { getInitials } from "../../../../helpers";

const useStyles = makeStyles((theme) => ({
  root: {},
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
}));

const UsersTable = (props) => {
  const { className, users, ...rest } = props;

  const classes = useStyles();
  const tableHead = ["Name", "Email", "Location", "Phone", "Registration Date"];

  const [selectedUsers, setSelectedUsers] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);
  const [orderColumn, setOrderColumn] = useState("");
  const [orderDirection, setOrderDirection] = useState("asc");

  useEffect(() => {
    console.log(orderColumn);
    console.log(orderDirection);
    users.sort(compare);
  }, [orderColumn, orderDirection]);

  const handleSelectAll = (event) => {
    const { users } = props;

    let selectedUsers;

    if (event.target.checked) {
      selectedUsers = users.map((user) => user.id);
    } else {
      selectedUsers = [];
    }
    // console.log("selected", selectedUsers);
    setSelectedUsers(selectedUsers);
  };

  const handleSelectOne = (event, id) => {
    const selectedIndex = selectedUsers.indexOf(id);
    let newSelectedUsers = [];

    //if not selected, then add
    if (selectedIndex === -1) {
      newSelectedUsers = newSelectedUsers.concat(selectedUsers, id);
    }
    //already selected, then remove
    else if (selectedIndex === 0) {
      newSelectedUsers = newSelectedUsers.concat(selectedUsers.slice(1));
    } else if (selectedIndex === selectedUsers.length - 1) {
      newSelectedUsers = newSelectedUsers.concat(selectedUsers.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelectedUsers = newSelectedUsers.concat(
        selectedUsers.slice(0, selectedIndex),
        selectedUsers.slice(selectedIndex + 1)
      );
    }
    setSelectedUsers(newSelectedUsers);
    // console.log(newSelectedUsers);
  };

  const handlePageChange = (event, page) => {
    setPage(page);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(event.target.value);
  };

  //sort ascending
  const compare = (a, b) => {
    // console.log(orderColumn);
    // console.log(a.orderColumn);
    if (a[orderColumn] > b[orderColumn]) {
      return 1;
    } else if (a[orderColumn] > b[orderColumn]) {
      return -1;
    } else {
      return 0;
    }
  };

  const handleSort = (column) => {
    return (event) => {
      // console.log(users);
      if (orderColumn === column) {
        orderDirection === "asc"
          ? setOrderDirection("desc")
          : setOrderDirection("asc");
        // setOrderDirection(!orderDirection);
      } else {
        // console.log(column);
        setOrderColumn(column);
        setOrderDirection("asc");
        // users.sort(compare);
        // users.sort()
      }
    };
  };

  return (
    <Card {...rest} className={clsx(classes.root, className)}>
      <CardContent className={classes.content}>
        <PerfectScrollbar>
          <div>
            <Table>
              <TableHead className={classes.tableHead}>
                <TableRow>
                  <TableCell padding="checkbox">
                    <Checkbox
                      className={classes.headCell}
                      checked={selectedUsers.length === users.length}
                      color="default"
                      indeterminate={
                        selectedUsers.length > 0 &&
                        selectedUsers.length < users.length
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
                  {/* <TableCell className={classes.headCell}>
                    <TableSortLabel
                      active={orderColumn}
                      direction={orderDirection}
                      onClick={handleSort}
                    >
                      Name
                    </TableSortLabel>
                  </TableCell>
                  <TableCell className={classes.headCell}>Email</TableCell>
                  <TableCell className={classes.headCell}>Location</TableCell>
                  <TableCell className={classes.headCell}>Phone</TableCell>
                  <TableCell className={classes.headCell}>
                    Registration date
                  </TableCell> */}
                </TableRow>
              </TableHead>
              <TableBody>
                {users
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((user) => (
                    <TableRow
                      className={classes.tableRow}
                      hover
                      key={user.id}
                      selected={selectedUsers.indexOf(user.id) !== -1}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={selectedUsers.indexOf(user.id) !== -1}
                          color="primary"
                          onChange={(event) => handleSelectOne(event, user.id)}
                          value="true"
                        />
                      </TableCell>
                      <TableCell>
                        <div className={classes.nameContainer}>
                          <Avatar
                            className={classes.avatar}
                            src={user.avatarUrl}
                          >
                            {getInitials(user.name)}
                          </Avatar>
                          <Typography variant="body1">{user.name}</Typography>
                        </div>
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        {user.address.city}, {user.address.state},{" "}
                        {user.address.country}
                      </TableCell>
                      <TableCell>{user.phone}</TableCell>
                      <TableCell>
                        {moment(user.createdAt).format("DD/MM/YYYY")}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>
        </PerfectScrollbar>
      </CardContent>
      <CardActions className={classes.actions}>
        <TablePagination
          component="div"
          count={users.length}
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

UsersTable.propTypes = {
  className: PropTypes.string,
  users: PropTypes.array.isRequired,
};

export default UsersTable;
