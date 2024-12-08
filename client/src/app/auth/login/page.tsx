"use client";
import { LoadingButton } from "@mui/lab";
import { Box, TextField, Typography } from "@mui/material";
import Link from "next/link";
import React, { useState } from "react";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log(email, password);
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100svh",
        width: "100vw",
        backgroundImage: "url(/images/login-bg.jpg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          width: "100%",
          p: 2,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          borderRadius: 2,
        }}
      >
        <Typography
          variant="h1"
          align="center"
          component="legend"
          color="primary"
        >
          Вхід
        </Typography>

        <TextField label="Пошта" type="email" size="small" name="email" />
        <TextField
          label="Пароль"
          type="password"
          size="small"
          name="password"
        />

        <LoadingButton
          loading={false}
          type="submit"
          variant="contained"
          size="small"
        >
          Увійти
        </LoadingButton>

        <Typography variant="body2" align="center">
          Ще не зареєстровані?
          <Typography
            sx={{ ml: 1 }}
            variant="body2"
            component="span"
            color="primary"
          >
            <Link href="/auth/register" prefetch>
              Зареєструватися
            </Link>
          </Typography>
        </Typography>
      </Box>
    </Box>
  );
};

export default LoginPage;
