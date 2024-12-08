"use client";

import { Box, CircularProgress, Typography } from "@mui/material";

const Loading = () => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      height="100vh"
    >
      <CircularProgress color="primary" />
      <Typography variant="h4" color="primary">
        Завантаження...
      </Typography>
    </Box>
  );
};

export default Loading;
