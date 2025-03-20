"use client";

import { useState } from "react";

import { ILoginFormData } from "../model/type";
// import { useDebounce } from "@/shared/hooks/useDebounce";

import {
  Box,
  Button,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  TextField,
} from "@mui/material";
import { Visibility, VisibilityOff, Save } from "@mui/icons-material";

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setLoading] = useState(false);

  // const debouncedEmail = useDebounce(email, 500);

  // const [emailValidationErrors, setEmailValidationErrors] = useState<string[]>(
  //   []
  // );

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const handleChangeEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);

    // TODO: Validate the email address
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    // TODO: Validate the form data. If the form data is invalid, return

    const formData: ILoginFormData = {
      email,
      password,
    };

    console.log(formData, " - Login form data");

    // TODO: Send the form data to the server

    setLoading(false);
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <TextField
        label="Email address"
        id="email"
        fullWidth
        value={email}
        onChange={handleChangeEmail}
      />

      <FormControl sx={{ mt: 2 }} variant="outlined" fullWidth>
        <InputLabel htmlFor="password">Password</InputLabel>
        <OutlinedInput
          id="password"
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                aria-label={
                  showPassword ? "hide the password" : "display the password"
                }
                onClick={handleClickShowPassword}
                onMouseDown={handleMouseDownPassword}
                edge="start"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          }
          label="Password"
        />
      </FormControl>

      <Button
        type="submit"
        variant="contained"
        fullWidth
        sx={{
          mt: 4,
          py: 1.5,
          fontSize: 16,
          fontWeight: 600,
        }}
        loading={isLoading}
        loadingPosition="start"
        startIcon={isLoading ? <Save /> : null}
      >
        {isLoading ? "Loading..." : "Login"}
      </Button>
    </Box>
  );
};

export default LoginForm;
