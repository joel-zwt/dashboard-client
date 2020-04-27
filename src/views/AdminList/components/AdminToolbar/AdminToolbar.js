import React, { useState } from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import { makeStyles } from "@material-ui/styles";
// import { withRouter } from "react-router-dom";

import {
  Button,
  Grid,
  TextField,
  Typography,
  MenuItem,
  Select,
  Drawer,
  Divider,
  IconButton,
} from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import ReplayIcon from "@material-ui/icons/Replay";
import FilterListIcon from "@material-ui/icons/FilterList";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";

const useStyles = makeStyles((theme) => ({
  root: {},
  row: {
    height: "42px",
    justifyContent: "flex-end",
    display: "flex",
    alignItems: "center",
    marginTop: theme.spacing(1),
  },
  importButton: {
    marginRight: theme.spacing(1),
  },
  exportButton: {
    marginRight: theme.spacing(1),
  },
  searchInput: {
    marginRight: theme.spacing(1),
  },
  button: {
    marginLeft: theme.spacing(1),
  },
  drawer: {
    width: "400px",
    padding: theme.spacing(4),
    [theme.breakpoints.down("xs")]: {
      width: "100%",
    },
  },
  drawerForm: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    margin: theme.spacing(3, 0),
  },
  input: {
    marginBottom: theme.spacing(3),
  },
  drawerTitle: {
    margin: theme.spacing(3, 0, 1, 0),
  },
  drawerButton: {
    display: "flex",
    justifyContent: "stretch",
  },
  drawerClose: {
    // display: "flex",
    marginLeft: -theme.spacing(2),
  },
}));

const AdminToolbar = (props) => {
  var {
    className,
    setFilter,
    setAdminTableData,
    adminTableData,
    ...rest
  } = props;

  const classes = useStyles();

  const [formState, setFormState] = useState({
    values: {},
  });

  const [openDrawer, setOpenDrawer] = useState(false);

  const handleChange = (event) => {
    setFormState({
      values: {
        ...formState.values,
        [event.target.name]: event.target.value,
      },
    });
  };

  const handleReset = () => {
    setFormState({ values: {} });
    setFilter({ values: {}, filterSearch: false });
    setAdminTableData({ ...adminTableData, page: 0 });
    setOpenDrawer(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(formState);
    setFilter({ ...formState, filterSearch: true });
    setAdminTableData({ ...adminTableData, page: 0 });
    setOpenDrawer(false);
  };

  //withrouter hoc giving context warning hence using window object
  const handleNewUser = () => {
    window.location.assign("/admin/new");
  };

  const handleOpenDrawer = () => {
    setOpenDrawer(true);
  };

  const handleCloseDrawer = () => {
    setOpenDrawer(false);
  };

  return (
    <div {...rest} className={clsx(classes.root, className)}>
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <div className={classes.row}>
            <Button
              color="primary"
              variant="contained"
              size="large"
              onClick={handleNewUser}
            >
              Add user
            </Button>
            <Button
              variant="outlined"
              color="primary"
              className={classes.button}
              startIcon={<FilterListIcon />}
              size="large"
              onClick={handleOpenDrawer}
              // onClick={handleReset}
            >
              Filter
            </Button>
          </div>
        </Grid>
        <Drawer anchor="right" open={openDrawer} onClose={handleCloseDrawer}>
          <div className={classes.drawer}>
            <div className={classes.drawerClose}>
              <IconButton
                color="primary"
                size="small"
                onClick={handleCloseDrawer}
              >
                <ChevronRightIcon fontSize="large" />
              </IconButton>
            </div>
            <Typography className={classes.drawerTitle} variant="h2">
              Filter
            </Typography>
            <Divider />
            <form className={classes.drawerForm} onSubmit={handleSubmit}>
              <TextField
                className={classes.input}
                fullWidth
                label="Name"
                name="name"
                onChange={handleChange}
                type="text"
                value={formState.values.name || ""}
                variant="outlined"
              />
              <TextField
                className={classes.input}
                fullWidth
                label="Email"
                name="email"
                onChange={handleChange}
                type="text"
                value={formState.values.email || ""}
                variant="outlined"
              />
              <Select
                className={classes.input}
                fullWidth
                label="Status"
                variant="outlined"
                name="status"
                value={formState.values.status || ""}
                onChange={handleChange}
                // labelId="gender"
                defaultValue=""
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                <MenuItem value={"Active"}>Active</MenuItem>
                <MenuItem value={"Inactive"}>Inactive</MenuItem>
              </Select>
              <TextField
                className={classes.input}
                fullWidth
                label="Department"
                name="department"
                onChange={handleChange}
                type="text"
                value={formState.values.department || ""}
                variant="outlined"
              />
              {/* <Divider /> */}
              <div className={classes.drawerButton}>
                <Button
                  variant="contained"
                  color="secondary"
                  // className={classes.button}
                  startIcon={<SearchIcon />}
                  size="large"
                  type="submit"
                  onClick={handleSubmit}
                >
                  Search
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  className={classes.button}
                  startIcon={<ReplayIcon />}
                  size="large"
                  onClick={handleReset}
                >
                  Reset
                </Button>
              </div>
            </form>
          </div>
        </Drawer>
      </Grid>
    </div>
  );
};

AdminToolbar.propTypes = {
  className: PropTypes.string,
};

export default AdminToolbar;
