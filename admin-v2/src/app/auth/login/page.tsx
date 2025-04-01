"use client";

import { Box, Paper } from "@mui/material";
import AdminLoginForm from "@/shared/components/forms/AdminLoginForm/AdminLoginForm";

const LoginPage = () => {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100dvh"
      bgcolor="#f4fdf6"
    >
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <AdminLoginForm />
      </Paper>
    </Box>
  );
};

export default LoginPage;
