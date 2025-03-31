"use client";

import { ThemeProvider, CssBaseline } from "@mui/material";
import { theme } from "@/theme";
import { ReactNode } from "react";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

const RootLayout = ({ children }: { children: ReactNode }) => {
  return (
    <html lang="en">
      <body>
        <ThemeProvider theme={theme}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <CssBaseline />
            {children}
          </LocalizationProvider>
        </ThemeProvider>
      </body>
    </html>
  );
};

export default RootLayout;
