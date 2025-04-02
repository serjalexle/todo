"use client";
import { Button } from "@mui/material";
import { useRouter } from "next/navigation";
import React from "react";

const HomePage = () => {
  const router = useRouter();

  const handleRedirect = () => {
    router.push("/auth/login");
  };

  return (
    <Button variant="contained" onClick={handleRedirect}>
      Login
    </Button>
  );
};

export default HomePage;
