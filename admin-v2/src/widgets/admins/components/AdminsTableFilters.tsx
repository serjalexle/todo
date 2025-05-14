import { Box, TextField } from "@mui/material";

const AdminsTableFilters = () => {
  // TODO: add filters
  return (
    <Box sx={{ mb: 2, display: "flex", gap: 2 }}>
      <TextField size="small" label="Пошук за email" fullWidth />
    </Box>
  );
};

export default AdminsTableFilters;
