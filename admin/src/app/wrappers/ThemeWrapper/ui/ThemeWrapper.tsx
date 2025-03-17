"use client";

import { ReactNode, useMemo, useState, useEffect } from "react";

import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

interface IProps {
  children: ReactNode;
}

const ThemeWrapper = ({ children }: Readonly<IProps>) => {
  // Запобігаємо гідрації, показуючи тему тільки після монтування
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const darkTheme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: "dark",
          background: {
            default: "#212121",
          },
          primary: {
            main: "#ffd000",
          },
          secondary: {
            main: "#cfdbd5",
          },
        },
      }),
    []
  );

  if (!mounted) return null; // Запобігаємо гідрації

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
};

export default ThemeWrapper;
