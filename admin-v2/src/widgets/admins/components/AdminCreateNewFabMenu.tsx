"use client";

import { Box, Fab, Tooltip, Zoom } from "@mui/material";
import { Add } from "@mui/icons-material";
import { useState } from "react";
import { useAdminsStore } from "@/shared/store/useAdminsStore";

const AdminCreateNewFabMenu = () => {
  const { toggleModal } = useAdminsStore();
  const [open, setOpen] = useState(false);

  const handleCreateAdmin = () => {
    toggleModal("create");
  };

  return (
    <Box
      sx={{ position: "fixed", bottom: 24, right: 24, zIndex: 9999 }}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <Box display="flex" flexDirection="column" alignItems="flex-end">
        <Zoom in={open}>
          <Tooltip title="Створити адміністратора" placement="left" arrow>
            <Fab
              size="small"
              color="primary"
              sx={{ mb: 1 }}
              onClick={handleCreateAdmin}
            >
              <Add fontSize="small" />
            </Fab>
          </Tooltip>
        </Zoom>

        <Fab color="primary" aria-label="add">
          <Add />
        </Fab>
      </Box>
    </Box>
  );
};

export default AdminCreateNewFabMenu;
