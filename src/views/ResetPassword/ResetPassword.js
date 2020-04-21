import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/styles";
import axios from "axios";
import validate from "validate.js";
import queryString from "query-string";
import { Link as RouterLink, withRouter, Redirect } from "react-router-dom";
import {
  Grid,
  Button,
  TextField,
  Link,
  Typography,
  Card,
  CircularProgress,
  Backdrop,
  LinearProgress,
} from "@material-ui/core";
import clsx from "clsx";
import { createEventHandlerWithConfig } from "recompose";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  backdrop: {
    zIndex: theme.zIndex.appBar + 1,
    background: "rgba(0, 0, 0, 0.2)",
    // color: theme.palette.black,
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
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
}));

const constraints = {
  password: {
    presence: { allowEmpty: false, message: "is required" },
    length: {
      maximum: 16,
      minimum: 8,
    },
  },
  confirmPassword: {
    presence: { allowEmpty: false, message: "is required" },
    length: {
      maximum: 16,
      minimum: 8,
    },
  },
};

const ResetPassword = (props) => {
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
  const [passwordMatch, setPasswordMatch] = useState(true);

  //* access ===> 0 = initial state, 1 = valid user, -1 = access denied
  const [access, setAccess] = useState(0);

  //component did mount
  useEffect(() => {
    var params = queryString.parse(props.location.search);
    var token = params.token;
    console.log(token);
    axios
      .get("/verify-reset-token", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((result) => {
        console.log(result);
        var data = result.data;
        setTimeout(() => {
          setAccess(1);
          setFormState({
            ...formState,
            values: {
              ...formState.values,
              email: data.v_email,
            },
          });
          console.log("form", formState);
        }, 500);
      })
      .catch((err) => {
        console.log("err: " + err);
        setTimeout(() => {
          setAccess(-1);
        }, 500);
        // this.setState({ access: 0 });
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
    // console.log("form", formState);
  }, [formState.values]);

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
    if (formState.values.password !== formState.values.confirmPassword) {
      setPasswordMatch(false);
    } else {
      setFormState({ ...formState, fetchedError: "", isValid: false });
      setPasswordMatch(true);
      setLoading(true);
      axios({
        method: "post",
        url: "/reset-password",
        data: {
          v_email: formState.values.email,
          v_password: formState.values.password,
        },
      })
        .then((result) => {
          var data = result.data;
          console.log(result);
          if (data.error) {
            setTimeout(() => {
              setFormState({
                ...formState,
                fetchedError: data.message,
                isValid: true,
              });
              setLoading(false);
            }, 500);
          } else {
            setTimeout(() => {
              setLoading(false);
              setSuccess(true);
            }, 500);
          }
        })
        .catch((err) => {
          console.log("err: " + err);
          setTimeout(() => {
            setFormState({
              ...formState,
              fetchedError: "Internal server error. Please try again.",
              isvalid: true,
            });
            setLoading(false);
          }, 500);
        });
    }
  };

  if (access == 0) {
    return (
      <Backdrop className={classes.backdrop} open="true">
        <CircularProgress size="100px" />
      </Backdrop>
    );
  } else if (access == -1) {
    return <Redirect to="not-found" />;
  } else if (access == 1) {
    if (success) {
      return (
        <div className={classes.root}>
          <Grid className={classes.content} container>
            <Grid item xs={12} sm={8} md={6}>
              <Card className={classes.formCard}>
                <div className={classes.contentHeader}>
                  <div className={classes.form}>
                    <Typography className={classes.title} variant="h2">
                      Your password has been reset
                    </Typography>
                    <Typography color="textSecondary" gutterBottom>
                      Please login again with your new credentials.
                    </Typography>
                    <Typography color="textSecondary" gutterBottom>
                      <Link component={RouterLink} to="/sign-in" variant="h6">
                        Click here
                      </Link>{" "}
                      to go back to login page.
                    </Typography>
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
                      Reset Password
                    </Typography>
                    <Typography color="textSecondary" gutterBottom>
                      Please enter your new password.
                    </Typography>
                  </div>
                  <TextField
                    className={classes.textField}
                    error={hasError("password")}
                    fullWidth
                    helperText={
                      hasError("password") ? formState.errors.password[0] : null
                    }
                    label="Password"
                    name="password"
                    onChange={handleChange}
                    type="password"
                    value={formState.values.password || ""}
                    variant="outlined"
                  />
                  <TextField
                    className={classes.textField}
                    error={hasError("confirmPassword")}
                    fullWidth
                    helperText={
                      hasError("confirmPassword")
                        ? formState.errors.confirmPassword[0]
                        : null
                    }
                    label="Confirm password"
                    name="confirmPassword"
                    onChange={handleChange}
                    type="password"
                    value={formState.values.confirmPassword || ""}
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
                  {!passwordMatch && (
                    <Typography
                      className={classes.fetchedError}
                      color="error"
                      variant="body1"
                    >
                      Passwords do not match
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
                    Set New Password
                  </Button>
                </form>
              </Card>
            </Grid>
          </Grid>
        </div>
      );
    }
  }
};

export default withRouter(ResetPassword);
