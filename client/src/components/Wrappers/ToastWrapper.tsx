"use client";
import { Close } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { closeSnackbar, SnackbarProvider } from "notistack";
import React from "react";

interface IProps {
  children: React.ReactNode;
}

const ToastWrapper = ({ children }: IProps) => {
  return (
    <SnackbarProvider
      autoHideDuration={3000}
      dense={true}
      preventDuplicate={true}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      action={(key) => {
        return (
          <IconButton
            onClick={() => {
              // ? Видаляємо повідомлення по кліку на кнопку
              if (key) {
                return closeSnackbar(key);
              }
            }}
          >
            <Close />
          </IconButton>
        );
      }}
    >
      {children}
    </SnackbarProvider>
  );
};

export default ToastWrapper;
