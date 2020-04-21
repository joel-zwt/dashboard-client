import React, { useEffect, useState } from "react";
import { withRouter } from "react-router-dom";
import { Backdrop, CircularProgress, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import axios from "axios";

const useStyles = makeStyles((theme) => ({
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
  errorHeading: {
    // color: "#ddd",
    color: "#fff",
    background: theme.palette.error.light,
    padding: theme.spacing(2),
    marginBottom: theme.spacing(5),
  },
  error: {
    color: "#fff",
    marginBottom: theme.spacing(2),
  },
}));

const AuthRedirect = (props) => {
  const [auth, setAuth] = useState(true);

  //get token for Oauth users
  useEffect(() => {
    axios
      .get("/provide-token")
      .then((token) => {
        var data = token.data;
        console.log(data);
        // this.setState({ tokenData: data });
        localStorage.setItem("jwt-token", data.token);
        // console.log(this.state)
        setTimeout(() => {
          props.history.push("/dashboard");
        }, 1000);
      })
      .catch((err) => {
        setAuth(false);
        console.log(err);
        setTimeout(() => {
          props.history.push("/sign-in");
        }, 2500);
      });
  }, []);

  const classes = useStyles();

  if (auth) {
    return (
      <Backdrop className={classes.backdrop} open="true">
        <CircularProgress size="100px" />
      </Backdrop>
    );
  } else {
    return (
      <Backdrop className={classes.backdrop} open="true">
        <Typography
          className={classes.errorHeading}
          variant="h1"
          color="errorWhite"
        >
          OOPS!!
        </Typography>
        <Typography className={classes.error} variant="h3">
          An error Occurred.
        </Typography>
        <Typography className={classes.error} variant="h5">
          Redirecting you to login page. Please Login again.
        </Typography>
      </Backdrop>
    );
  }
};

export default withRouter(AuthRedirect);
