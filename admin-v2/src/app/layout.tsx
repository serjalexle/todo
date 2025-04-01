"use client";

import { ThemeProvider, CssBaseline } from "@mui/material";
import { theme } from "@/theme";
import { ReactNode } from "react";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import TurtleLoader from "@/shared/components/UI/TurtleLoader/TurtleLoader";
import TurtleBackground from "@/shared/components/UI/TurtleBackground/TurtleBackground";

import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { useAdminAuthInitializer } from "@/shared/hooks/useAdminAuthInitializer";

const RootLayout = ({ children }: { children: ReactNode }) => {
  useAdminAuthInitializer();

  return (
    <html lang="en">
      <body>
        <ThemeProvider theme={theme}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <CssBaseline />
            <TurtleLoader />
            <TurtleBackground />
            <ToastContainer position="top-right" autoClose={3000} />
            {children}
          </LocalizationProvider>
        </ThemeProvider>
      </body>
    </html>
  );
};

export default RootLayout;
