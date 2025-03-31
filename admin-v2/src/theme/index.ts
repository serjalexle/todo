// src/theme/index.ts
import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#2e7d32", // * Яскраво-зелений, але темніший, ніж success.main
    },
    secondary: {
      main: "#00bfa5", // * Бірюзовий для акцентів
    },
    background: {
      default: "#f9fdf9",
      paper: "#ffffff",
    },
  },
});
