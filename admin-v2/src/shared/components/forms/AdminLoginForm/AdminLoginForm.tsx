"use client";

import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { useLoaderStore } from "@/shared/store/useLoaderStore";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/shared/store/useAuthStore";
import { yupResolver } from "@hookform/resolvers/yup";
import { adminLoginSchema } from "./validations/adminLoginSchema";
import { useState } from "react";
import Image from "next/image";
import { toast } from "react-toastify";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { apiHandleError } from "@/shared/helpers/apiHandleError";
import { loginAdmin } from "@/shared/api/admin/authApi";
import { LoginAdminDto } from "@/shared/types/auth";
import { IAdmin } from "@/shared/types/admin";

interface IFormInput {
  email: string;
  password: string;
}

const AdminLoginForm = () => {
  const { show, hide } = useLoaderStore();
  const { setState } = useAuthStore();
  const router = useRouter();

  const [showPassword, setShowPassword] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>({
    resolver: yupResolver(adminLoginSchema),
  });

  const handleTogglePassword = () => setShowPassword((prev) => !prev);

  const onSubmit = async (data: LoginAdminDto) => {
    const toastId = toast.loading("Вхід...");

    try {
      show();

      const response: {
        result: IAdmin;
        status: string;
      } = await loginAdmin(data);
      console.log(response.result);

      // 🟢 При успішному логіні збережи токени
      setState("currentAdmin", response.result);

      toast.update(toastId, {
        render: "Ви успішно увійшли 🐢",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });

      router.replace("/admin/dashboard");
    } catch (error) {
      apiHandleError(error, toastId);
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
            type="email"
            autoComplete="email"
            inputMode="email"
          />
          <TextField
            label="Пароль"
            type={showPassword ? "text" : "password"}
            {...register("password")}
            error={!!errors.password}
            helperText={errors.password?.message}
            size="small"
            fullWidth
            autoComplete="current-password"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleTogglePassword} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
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
