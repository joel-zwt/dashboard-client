import React, { useState } from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import { makeStyles } from "@material-ui/styles";
// import { withRouter } from "react-router-dom";

import {
  Button,
  Card,
  Grid,
  TextField,
  Typography,
  colors,
  MenuItem,
  InputLabel,
  Select,
} from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import ReplayIcon from "@material-ui/icons/Replay";
// import axios from "axios";
// import { SearchInput } from "../../../../components";

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
  formContainer: { padding: theme.spacing(2) },
  form: {
    padding: theme.spacing(2),
    border: "1px solid ",
    borderColor: colors.grey[400],
    borderRadius: "4px",
    display: "flex",
    justifyContent: "center",
  },
  title: {
    marginBottom: "20px",
  },
  buttonContainer: {
    width: "100%",
    height: "100%",
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    [theme.breakpoints.down("xs")]: {
      justifyContent: "center",
    },
  },
  button: {
    marginLeft: theme.spacing(1),
  },
}));

const EmployeesToolbar = (props) => {
  var {
    className,
    setFilter,
    setEmployeeTableData,
    employeeTableData,
    ...rest
  } = props;

  const classes = useStyles();

  const [formState, setFormState] = useState({
    values: {},
  });

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
    setEmployeeTableData({ ...employeeTableData, page: 0 });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(formState);
    setFilter({ ...formState, filterSearch: true });
    setEmployeeTableData({ ...employeeTableData, page: 0 });
  };

  //withrouter hoc giving context warning hence using window object
  const handleNewUser = () => {
    // props.history.push("/employees/new");
    window.location.assign("/employees/new");
  };

  return (
    <div {...rest} className={clsx(classes.root, className)}>
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <div className={classes.row}>
            <Button className={classes.importButton} size="large">
              Import
            </Button>
            <Button className={classes.exportButton} size="large">
              Export
            </Button>
            <Button
              color="primary"
              variant="contained"
              size="large"
              onClick={handleNewUser}
            >
              Add user
            </Button>
          </div>
        </Grid>
        <Grid item xs={12}>
          <Card className={classes.formContainer}>
            <Typography className={classes.title} variant="h2">
              Filter
            </Typography>
            <form className={classes.form} onSubmit={handleSubmit}>
              <Grid item container xs={12} spacing={2}>
                <Grid item xs={12} sm={5}>
                  <TextField
                    fullWidth
                    label="Name"
                    name="name"
                    onChange={handleChange}
                    type="text"
                    value={formState.values.name || ""}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} sm={5}>
                  <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    onChange={handleChange}
                    type="text"
                    value={formState.values.email || ""}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} sm={2}>
                  {/* <InputLabel id="gender">Age</InputLabel> */}
                  <Select
                    fullWidth
                    label="Gender"
                    variant="outlined"
                    name="gender"
                    value={formState.values.gender || ""}
                    onChange={handleChange}
                    // labelId="gender"
                    defaultValue=""
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    <MenuItem value={"Male"}>Male</MenuItem>
                    <MenuItem value={"Female"}>Female</MenuItem>
                    <MenuItem value={"Other"}>Other</MenuItem>
                  </Select>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Department"
                    name="department"
                    onChange={handleChange}
                    type="text"
                    value={formState.values.department || ""}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <div className={classes.buttonContainer}>
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
                </Grid>
              </Grid>
            </form>
          </Card>
        </Grid>
      </Grid>
      {/* <div className={classes.row}>
        <SearchInput
          className={classes.searchInput}
          placeholder="Search user"
        />
      </div> */}
    </div>
  );
};

EmployeesToolbar.propTypes = {
  className: PropTypes.string,
};

export default EmployeesToolbar;
