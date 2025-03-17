import { ThemeWrapper } from "@/app/wrappers/ThemeWrapper";
import { Box, Paper, Typography } from "@mui/material";

const AuthPage = async () => {
  return (
    <ThemeWrapper>
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
            width: 300,
            height: 300,
            backgroundColor: "primary.main",
            filter: "blur(150px)",
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
            borderColor: "background.default",
            boxShadow: 4,
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
        </Paper>
      </Box>
    </ThemeWrapper>
  );
};

export default AuthPage;
