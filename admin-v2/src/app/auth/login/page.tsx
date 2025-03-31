"use client";

import { Box, Paper } from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuthStore } from "@/shared/store/useAuthStore";
import AdminLoginForm from "@/shared/components/forms/AdminLoginForm/AdminLoginForm";

const LoginPage = () => {
  const { currentAdmin } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (currentAdmin) {
      router.replace("/admin");
    }
  }, [currentAdmin, router]);

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
