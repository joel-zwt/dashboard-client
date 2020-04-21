import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/styles";
import axios from "axios";
import validate from "validate.js";
import { Link as RouterLink, withRouter } from "react-router-dom";
import {
  Grid,
  Button,
  IconButton,
  TextField,
  Link,
  Typography,
  Card,
  Checkbox,
  LinearProgress,
} from "@material-ui/core";
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
}));

const constraints = {
  email: {
    presence: { allowEmpty: false, message: "is required" },
    email: true,
    length: {
      maximum: 64,
    },
  },
};

const ForgotPassword = () => {
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
    //check for errors
    const errors = validate(formState.values, constraints);
    // console.log(errors);

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
    setFormState({
      ...formState,
      fetchedError: "",
      isValid: false,
    });
    setLoading(true);
    axios({
      method: "post",
      url: "/forgot-password",
      data: { v_email: formState.values.email },
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
                    Email Successfully Sent
                  </Typography>
                  <Typography color="textSecondary" gutterBottom>
                    Please check your inbox.
                  </Typography>
                  <Typography color="textSecondary" gutterBottom>
                    Follow the instructions provided in the email to reset your
                    password.
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
                    Forgot Password?
                  </Typography>
                  <Typography color="textSecondary" gutterBottom>
                    Please enter your registered email.
                  </Typography>
                  <Typography color="textSecondary" gutterBottom>
                    You will be sent instructions to reset your password.
                  </Typography>
                </div>
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
                  Reset Password
                </Button>
                <Typography
                  className={classes.otherLinks}
                  color="textSecondary"
                  variant="body1"
                >
                  Already have an account?{" "}
                  <Link component={RouterLink} to="/sign-in" variant="h6">
                    Sign in
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

export default withRouter(ForgotPassword);
