import { LoginForm } from "@/features/loginForm";
import { Box, Paper, Typography } from "@mui/material";

const AuthPage = async () => {
  return (
    <Box
      sx={{
        minHeight: "100svh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
      }}
    >
      <Box
        sx={{
          width: 400,
          height: 400,
          backgroundColor: "primary.main",
          filter: "blur(200px)",
          borderRadius: "50%",
          position: "absolute",
          zIndex: -1,
        }}
      ></Box>

      <Paper
        sx={{
          backgroundColor: "hsla(220, 35%, 3%, 0.4)",
          padding: 4,
          width: "100%",
          maxWidth: 450,
          border: "1px solid",
          borderColor: "secondary.dark",
          boxShadow: 4,
          backdropFilter: "blur(10px)",
        }}
      >
        <Typography
          variant="body1"
          color="primary"
          sx={{
            textTransform: "uppercase",
          }}
        >
          I am an admin
        </Typography>

        <Typography
          variant="h3"
          color="secondary"
          mt={2}
          sx={{
            fontWeight: 600,
          }}
        >
          Login
        </Typography>

        <Box
          sx={{
            mt: 4,
          }}
        >
          <LoginForm />
        </Box>
      </Paper>
    </Box>
  );
};

export default AuthPage;
