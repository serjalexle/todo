"use client";

import { useEffect, useState } from "react";

import { useDebounce } from "@/shared/hooks/useDebounce";

import { ILoginFormData } from "../model/type";
import { validateField } from "@/shared/utils/validation/validation";

import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  TextField,
  Typography,
} from "@mui/material";
import { Visibility, VisibilityOff, Save } from "@mui/icons-material";

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setLoading] = useState(false);

  //? form data
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  //? debounced form data
  const debouncedEmail = useDebounce(email, 500);
  const debouncedPassword = useDebounce(password, 500);

  //? validation errors
  const [validationErrors, setValidationErrors] = useState<ILoginFormData>({
    email: "",
    password: "",
  });

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const handleChangeEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value.replace(/\s/g, ""));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    if (validationErrors.email || password === "") {
      setLoading(false);
      return;
    }

    const formData: ILoginFormData = {
      email,
      password,
    };

    console.log(formData, " - Login form data");

    // TODO: Send the form data to the server

    setLoading(false);
  };

  useEffect(() => {
    if (debouncedEmail) {
      setValidationErrors((prev) => ({
        ...prev,
        email: validateField("email", debouncedEmail),
      }));
    }

    if (debouncedPassword) {
      setValidationErrors((prev) => ({
        ...prev,
        password: validateField("password", debouncedPassword),
      }));
    }
  }, [debouncedEmail, debouncedPassword]);

  useEffect(() => {
    console.log(validationErrors, " - Validation errors");
  }, [validationErrors]);

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <TextField
        error={Boolean(validationErrors.email) && email !== ""}
        helperText={
          email !== "" && validationErrors.email && validationErrors.email
        }
        label="Email address"
        required
        id="email"
        fullWidth
        value={email}
        onChange={handleChangeEmail}
      />
      <FormControl sx={{ mt: 2 }} variant="outlined" fullWidth required>
        <InputLabel htmlFor="password">Password</InputLabel>
        <OutlinedInput
          id="password"
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          error={Boolean(validationErrors.password) && password !== ""}
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
        <FormHelperText error id="accountId-error">
          {password !== "" &&
            validationErrors.password &&
            validationErrors.password}
        </FormHelperText>
      </FormControl>
      <Typography variant="body2" sx={{ mt: 1 }}>
        * Required fields
      </Typography>
      <Button
        type="submit"
        variant="contained"
        disabled={email !== "" && password !== "" && !!validationErrors.email}
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
