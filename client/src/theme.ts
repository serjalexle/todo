"use client";
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#00e5ff", // Неоновий бірюзовий
    },
    secondary: {
      main: "#ff4081", // Яскравий рожевий
    },
    background: {
      default: "#0f0f0f", // Темний фон
      paper: "#1a1a1a", // Фон для карток
    },
    text: {
      primary: "#e0e0e0", // Світлий текст
      secondary: "#9e9e9e", // Для менш важливих елементів
    },
  },
  typography: {
    fontFamily: "'Roboto Mono', monospace", // Шрифт у стилі кіберпанку
    h1: {
      fontWeight: 700,
      fontSize: "2.5rem",
      textTransform: "uppercase",
      textShadow: "0 0 10px #00e5ff",
    },
    h2: {
      fontWeight: 700,
      fontSize: "2rem",
      textShadow: "0 0 8px #ff4081",
    },
    button: {
      textTransform: "uppercase",
      fontWeight: 600,
    },
  },
  components: {
    // MuiButton: {
    //   styleOverrides: {
    //     contained: {
    //       borderRadius: "8px",
    //       background: "linear-gradient(90deg, #00e5ff, #ff4081)",
    //       color: "#fff",
    //       boxShadow: "0 4px 20px rgba(0, 229, 255, 0.5)",
    //       "&:hover": {
    //         background: "linear-gradient(90deg, #ff4081, #00e5ff)",
    //         boxShadow: "0 4px 25px rgba(255, 64, 129, 0.7)",
    //       },
    //     },
        
    //   },
    // },
    MuiPaper: {
      styleOverrides: {
        root: {
          background: "rgba(255, 255, 255, 0.05)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          boxShadow: "0 4px 15px rgba(0, 0, 0, 0.4)",
          backdropFilter: "blur(10px)",
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: "linear-gradient(90deg, #1a1a1a, #0f0f0f)",
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.5)",
        },
      },
    },
  },
});

export default theme;
