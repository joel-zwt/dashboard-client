import palette from "../palette";

export default {
  root: {
    "&:focus": {
      color: palette.white,
    },
    "&:hover": {
      color: palette.white,
      "& $icon": {
        opacity: 0.5,
      },
    },
    "&$active": {
      color: palette.white,
      "&& $icon": {
        opacity: 1,
        color: palette.white,
      },
    },
  },
};
