import React, { useState, useEffect } from "react";
import { Link as RouterLink, withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import validate from "validate.js";
import axios from "axios";
import { makeStyles } from "@material-ui/styles";
import {
  Grid,
  Button,
  IconButton,
  TextField,
  Link,
  Typography,
  Card,
  Checkbox,
} from "@material-ui/core";
// import {
//   Facebook as FacebookIcon,
//   Google as GoogleIcon,
//   Github as GithubIcon,
// } from "../../icons";
import { indigo } from "@material-ui/core/colors";
// import MuiButton from "theme/overrides/MuiButton";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.default,
    minHeight: "100%",
    width: "100%",
    display: "flex",
    alignItems: "center",
  },
  contentContainer: {},
  content: {
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  contentHeader: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
  },
  contentBody: {
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",

    // [theme.breakpoints.down("md")]: {
    //   justifyContent: "center",
    // },
  },
  // form: {
  //   padding: theme.spacing(8, 4),
  //   [theme.breakpoints.down("xs")]: {
  //     padding: theme.spacing(3, 2),
  //   },
  // },
  formCard: {
    margin: theme.spacing(2),
    padding: theme.spacing(8, 4),
    [theme.breakpoints.down("xs")]: {
      padding: theme.spacing(3, 2),
    },
  },
  title: {
    marginBottom: theme.spacing(1),
  },
  socialButtons: {
    marginTop: theme.spacing(3),
    display: "flex",
    justifyContent: "center",
    [theme.breakpoints.down("sm")]: {
      marginTop: theme.spacing(1),
    },
  },
  fbButton: {
    background: indigo[600],
    "&:hover": {
      background: indigo[600],
    },
  },
  socialIcon: {
    marginRight: theme.spacing(1),
    width: "20px",
    height: "20px",
  },
  sugestion: {
    marginTop: theme.spacing(2),
  },
  textField: {
    marginTop: theme.spacing(2),
  },
  policy: {
    marginTop: theme.spacing(1),
    display: "flex",
    alignItems: "center",
  },
  policyCheckbox: {
    marginLeft: "-10px",
  },
  fetchedError: {
    textAlign: "center",
    marginTop: theme.spacing(2),
  },
  signUpButton: {
    margin: theme.spacing(2, 0),
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
  password: {
    presence: { allowEmpty: false, message: "is required" },
    length: {
      maximum: 16,
      minimum: 8,
    },
  },
  policy: {
    presence: { allowEmpty: false, message: "is required" },
    checked: true,
  },
};

const SignUp = (props) => {
  const classes = useStyles();

  const [formState, setFormState] = useState({
    isValid: false,
    values: {},
    touched: {},
    errors: {},
    fetchedError: "",
  });

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

  const hasError = (field) =>
    formState.touched[field] && formState.errors[field] ? true : false;

  //   const handleGoogle = () => {
  //     window.open("http://localhost:5000/auth/google", "_self");
  //   };
  //   const handleGithub = () => {
  //     window.open("http://localhost:5000/auth/github", "_self");
  //   };

  //   const handleFacebook = () => {
  //     window.open("http://localhost:5000/auth/facebook", "_self");
  //   };

  const handleChange = (event) => {
    //update formstate
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
    axios({
      method: "post",
      url: "/sign-up",
      data: {
        v_email: formState.values.email,
        v_password: formState.values.password,
        v_fname: formState.values.firstName,
        v_lname: formState.values.lastName,
      },
    })
      .then((result) => {
        var data = result.data;
        console.log(result);

        if (data.error) {
          setFormState({
            ...formState,
            fetchedError: data.message,
            isValid: true,
          });
          console.log(formState);
        } else {
          // console.log(this.state);
          localStorage.setItem("jwt-token", data.token);
          props.history.push("/dashboard");
        }
      })
      .catch((err) => {
        console.log("err: " + err);
        setFormState({
          ...formState,
          fetchedError: "Internal server error. Please try again.",
          isvalid: true,
        });
      });
  };

  return (
    <div className={classes.root}>
      <Grid className={classes.content} container>
        {/* <div className={classes.contentHeader}>
              <IconButton onClick={handleBack}>
                <ArrowBackIcon />
              </IconButton>
            </div> */}
        <Grid item xs={12} sm={8} md={6}>
          <div className={classes.contentBody}>
            <Card className={classes.formCard}>
              <form className={classes.form} onSubmit={handleSubmit}>
                <div className={classes.contentHeader}>
                  <Typography className={classes.title} variant="h2">
                    Create a new account
                  </Typography>
                  <Typography color="textSecondary" gutterBottom>
                    Use your email to create a new account
                  </Typography>
                </div>
                {/* <Grid className={classes.socialButtons} container spacing={2}>
                  <Grid item>
                    <Button
                      // onClick={handleSignIn}
                      size="large"
                      variant="contained"
                    >
                      <GoogleIcon className={classes.socialIcon} />
                      Login with Google
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button
                      className={classes.fbButton}
                      color="primary"
                      // onClick={handleSignIn}
                      size="large"
                      variant="contained"
                    >
                      <FacebookIcon className={classes.socialIcon} />
                      Login with Facebook
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button
                      // onClick={handleSignIn}
                      size="large"
                      variant="contained"
                    >
                      <GithubIcon className={classes.socialIcon} />
                      Login with Github
                    </Button>
                  </Grid>
                </Grid> */}
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
                <div className={classes.policy}>
                  <Checkbox
                    checked={formState.values.policy || false}
                    className={classes.policyCheckbox}
                    color="primary"
                    name="policy"
                    onChange={handleChange}
                  />
                  <Typography
                    className={classes.policyText}
                    color="textSecondary"
                    variant="body1"
                  >
                    I have read the{" "}
                    <Link
                      color="primary"
                      component={RouterLink}
                      to="#"
                      underline="always"
                      variant="h6"
                    >
                      Terms and Conditions
                    </Link>
                  </Typography>
                </div>
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
                  className={classes.signUpButton}
                  color="primary"
                  disabled={!formState.isValid}
                  fullWidth
                  size="large"
                  type="submit"
                  variant="contained"
                >
                  Sign up now
                </Button>
                <Typography color="textSecondary" variant="body1">
                  Have an account?{" "}
                  <Link component={RouterLink} to="/sign-in" variant="h6">
                    Sign in
                  </Link>
                </Typography>
              </form>
            </Card>
          </div>
        </Grid>
      </Grid>
    </div>
  );
};

SignUp.propTypes = {
  history: PropTypes.object,
};

export default withRouter(SignUp);
