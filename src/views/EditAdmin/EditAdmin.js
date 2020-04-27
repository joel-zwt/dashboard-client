import React, { useState, useEffect } from "react";
import { Link as RouterLink } from "react-router-dom";
// import PropTypes from "prop-types";
import validate from "validate.js";
import { makeStyles } from "@material-ui/styles";
import {
  Grid,
  Button,
  //   IconButton,
  TextField,
  Link,
  Typography,
  Card,
  Select,
  MenuItem,
  //   InputLabel,
  //   OutlinedInput,
  LinearProgress,
} from "@material-ui/core";
// import { indigo } from "@material-ui/core/colors";
import axios from "axios";
import clsx from "clsx";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  contentHeader: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
  },
  formCard: {
    margin: theme.spacing(2),
  },
  form: {
    padding: theme.spacing(8, 4),
    [theme.breakpoints.down("xs")]: {
      padding: theme.spacing(3, 2),
    },
  },
  title: {
    marginBottom: theme.spacing(2),
  },
  textField: {
    marginTop: theme.spacing(2),
  },
  fetchedError: {
    textAlign: "center",
    marginTop: theme.spacing(2),
  },
  signInButton: {
    margin: theme.spacing(2, 0),
  },
  otherLinks: {
    marginBottom: theme.spacing(1),
  },
  hide: { display: "none" },
  buttons: {
    margin: theme.spacing(2),
  },
}));

const constraints = {
  firstName: {
    presence: { allowEmpty: false, message: "is required" },
    length: {
      maximum: 32,
    },
  },
  lastName: {
    presence: { allowEmpty: false, message: "is required" },
    length: {
      maximum: 32,
    },
  },
  email: {
    presence: { allowEmpty: false, message: "is required" },
    email: true,
    length: {
      maximum: 64,
    },
  },
  department: {
    presence: { allowEmpty: false, message: "is required" },
  },
};

const EditAdmin = (props) => {
  const classes = useStyles();

  const [formState, setFormState] = useState({
    isValid: false,
    values: {},
    touched: {},
    errors: {},
    fetchedError: "",
  });
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log(window.location.pathname);
    axios.get(window.location.pathname).then((result) => {
      var admin = result.data.admin;
      console.log(admin);
      setFormState({
        ...formState,
        values: {
          firstName: admin.v_name.split(" ")[0],
          lastName: admin.v_name.split(" ")[1],
          email: admin.v_email,
          status: admin.v_status,
          department: admin.v_department,
          // imgURL:admin.v_imgURL
        },
      });
    });
  }, []);

  useEffect(() => {
    //check for errors
    const errors = validate(formState.values, constraints);

    //set isvalid to false if errors exist
    setFormState({
      ...formState,
      isValid: errors ? false : true,
      errors: errors || {},
    });
  }, [formState.values]);

  const handleAdd = () => {
    setFormState({
      isValid: false,
      values: {},
      touched: {},
      errors: {},
      fetchedError: "",
    });
    setSuccess(false);
  };

  const handleBack = () => {
    props.history.push("/admin");
  };

  const hasError = (field) =>
    formState.touched[field] && formState.errors[field] ? true : false;

  const handleChange = (event) => {
    setFormState({
      ...formState,
      values: {
        ...formState.values,
        [event.target.name]:
          event.target.type === "checkbox"
            ? event.target.checked
            : event.target.value,
      },
      //to check if the input was edited
      touched: {
        ...formState.touched,
        [event.target.name]: true,
      },
    });
    // console.log(formState.values);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setFormState({
      ...formState,
      fetchedError: "",
      isValid: false,
    });
    console.log(formState);
    var name = formState.values.firstName + " " + formState.values.lastName;
    console.log(name);
    setLoading(true);
    axios({
      method: "post",
      url: window.location.pathname,
      data: {
        v_name: name,
        v_email: formState.values.email,
        v_department: formState.values.department,
        v_status: formState.values.status,
      },
    })
      .then((result) => {
        var data = result.data;
        console.log(result);
        if (data.error) {
          setTimeout(() => {
            setLoading(false);
            setFormState({
              ...formState,
              fetchedError: data.message,
            });
            console.log(formState);
          }, 500);
        } else {
          setLoading(false);
          setSuccess(true);
          // setFormState({
          //   ...formState,
          //   isValid: true,
          // });
        }
      })
      .catch((err) => {
        setTimeout(() => {
          setLoading(false);
          console.log("err: " + err);
          setFormState({
            ...formState,
            fetchedError: "Internal server error. Please try again.",
            isValid: true,
          });
        }, 500);
      });
  };

  if (success) {
    return (
      <div className={classes.root}>
        <Grid className={classes.content} container>
          <Grid item xs={12} sm={8} md={6}>
            <Card className={classes.formCard}>
              <div className={classes.contentHeader}>
                <div className={classes.form}>
                  <Typography className={classes.title} variant="h2">
                    Admin Successfully Edited
                  </Typography>
                  {/* <Button
                    variant="outlined"
                    color="primary"
                    className={classes.buttons}
                    onClick={handleAdd}
                  >
                    Add another admin
                  </Button> */}
                  <Button
                    variant="outlined"
                    color="primary"
                    className={classes.buttons}
                    onClick={handleBack}
                  >
                    Go back to admin list
                  </Button>
                </div>
              </div>
            </Card>
          </Grid>
        </Grid>
      </div>
    );
  } else {
    return (
      <div className={classes.root}>
        <Grid className={classes.content} container>
          <Grid item xs={12} sm={8} md={6}>
            <Card className={classes.formCard}>
              <LinearProgress className={clsx(!loading && classes.hide)} />
              <form className={classes.form} onSubmit={handleSubmit}>
                <div className={classes.contentHeader}>
                  <Typography className={classes.title} variant="h2">
                    Edit Admin
                  </Typography>
                </div>
                <TextField
                  className={classes.textField}
                  error={hasError("firstName")}
                  fullWidth
                  helperText={
                    hasError("firstName") ? formState.errors.firstName[0] : null
                  }
                  label="First name"
                  name="firstName"
                  onChange={handleChange}
                  type="text"
                  value={formState.values.firstName || ""}
                  variant="outlined"
                />
                <TextField
                  className={classes.textField}
                  error={hasError("lastName")}
                  fullWidth
                  helperText={
                    hasError("lastName") ? formState.errors.lastName[0] : null
                  }
                  label="Last name"
                  name="lastName"
                  onChange={handleChange}
                  type="text"
                  value={formState.values.lastName || ""}
                  variant="outlined"
                />
                <TextField
                  className={classes.textField}
                  error={hasError("email")}
                  fullWidth
                  helperText={
                    hasError("email") ? formState.errors.email[0] : null
                  }
                  label="Email address"
                  name="email"
                  onChange={handleChange}
                  type="text"
                  value={formState.values.email || ""}
                  variant="outlined"
                />
                <Select
                  className={classes.textField}
                  fullWidth
                  label="Status"
                  variant="outlined"
                  name="status"
                  value={formState.values.status || "Inactive"}
                  onChange={handleChange}
                >
                  <MenuItem value={"Active"}>Active</MenuItem>
                  <MenuItem value={"Inactive"}>Inactive</MenuItem>
                </Select>

                <TextField
                  className={classes.textField}
                  error={hasError("department")}
                  fullWidth
                  helperText={
                    hasError("department")
                      ? formState.errors.department[0]
                      : null
                  }
                  label="Department"
                  name="department"
                  onChange={handleChange}
                  type="text"
                  value={formState.values.department || ""}
                  variant="outlined"
                />

                {formState.fetchedError && (
                  <Typography
                    className={classes.fetchedError}
                    color="error"
                    variant="body1"
                  >
                    {formState.fetchedError}
                  </Typography>
                )}
                <Button
                  className={classes.signInButton}
                  color="primary"
                  disabled={!formState.isValid}
                  fullWidth
                  size="large"
                  type="submit"
                  variant="contained"
                >
                  Confirm Edit
                </Button>
                <Typography
                  className={classes.otherLinks}
                  color="textSecondary"
                  variant="body1"
                >
                  To go back to admin list,{" "}
                  <Link component={RouterLink} to="/admin" variant="h6">
                    Click here
                  </Link>
                </Typography>
              </form>
            </Card>
          </Grid>
        </Grid>
      </div>
    );
  }
};

export default EditAdmin;
