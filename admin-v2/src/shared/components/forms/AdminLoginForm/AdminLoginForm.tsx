// * AdminLoginForm.tsx — з оновленим дизайном

"use client";

import {
  Box,
  Button,
  Stack,
  TextField,
  Typography,
  Paper,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { useLoaderStore } from "@/shared/store/useLoaderStore";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/shared/store/useAuthStore";
import { yupResolver } from "@hookform/resolvers/yup";
import { adminLoginSchema } from "./validations/adminLoginSchema";
import Image from "next/image";
import TurtleBackground from "../../UI/TurtleBackground/TurtleBackground";

interface IFormInput {
  email: string;
  password: string;
}

const AdminLoginForm = () => {
  const { show, hide } = useLoaderStore();
  const { setState } = useAuthStore();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>({
    resolver: yupResolver(adminLoginSchema),
  });

  const onSubmit = async (data: IFormInput) => {
    try {
      show();
      await new Promise((res) => setTimeout(res, 2000));
      setState("currentAdmin", { email: data.email } as any);
      router.replace("/admin/dashboard");
    } catch (e) {
      console.error("Login error", e);
    } finally {
      hide();
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: 2,
        position: "relative",
        minWidth: "320px",
        maxWidth: "500px",
        width: "100%",
      }}
    >
      <Box>
        <Box
          sx={{
            width: "70px",
            height: "70px",
            borderRadius: "50px",
            overflow: "hidden",
            boxShadow: 3,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Image
            src="/images/LOGO.png"
            alt="Turtle Logo"
            width="50"
            height="50"
          />
        </Box>
      </Box>

      <Box component="form" onSubmit={handleSubmit(onSubmit)} width="100%">
        <Stack spacing={2}>
          <TextField
            label="Email"
            {...register("email")}
            error={!!errors.email}
            helperText={errors.email?.message}
            size="small"
            fullWidth
          />
          <TextField
            label="Пароль"
            type="password"
            {...register("password")}
            error={!!errors.password}
            helperText={errors.password?.message}
            size="small"
            fullWidth
          />
          <Button
            type="submit"
            variant="contained"
            color="success"
            fullWidth
            size="medium"
          >
            Увійти
          </Button>
        </Stack>
      </Box>
    </Box>
  );
};

export default AdminLoginForm;
