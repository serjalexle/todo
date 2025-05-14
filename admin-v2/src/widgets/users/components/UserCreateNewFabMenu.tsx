"use client";

import { Box, Fab, Tooltip, Zoom } from "@mui/material";
import { Add } from "@mui/icons-material";
import { useState } from "react";
import { useUsersStore } from "@/shared/store/useUsersStore";

const UserCreateNewFabMenu = () => {
  const { toggleModal } = useUsersStore();
  const [open, setOpen] = useState(false);

  const handleCreateUser = () => {
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
          <Tooltip title="Створити користувача" placement="left" arrow>
            <Fab
              size="small"
              color="primary"
              sx={{ mb: 1 }}
              onClick={handleCreateUser}
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

export default UserCreateNewFabMenu;
