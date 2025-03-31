"use client";

import { ThemeProvider, CssBaseline, Box } from "@mui/material";
import { theme } from "@/theme";
import { ReactNode } from "react";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import TurtleLoader from "@/shared/components/UI/TurtleLoader/TurtleLoader";
import TurtleBackground from "@/shared/components/UI/TurtleBackground/TurtleBackground";

const RootLayout = ({ children }: { children: ReactNode }) => {
  return (
    <html lang="en">
      <body>
        <ThemeProvider theme={theme}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <CssBaseline />
            <TurtleLoader />
            <TurtleBackground />
            {children}
          </LocalizationProvider>
        </ThemeProvider>
      </body>
    </html>
  );
};

export default RootLayout;
