import { useRolesStore } from "@/shared/store/useRolesStore";
import { Add } from "@mui/icons-material";
import { Button } from "@mui/material";
import React from "react";

const CreateNewRoleBtn = () => {
  const { toggleModal } = useRolesStore();

  const handleOpenCreateRoleModal = () => {
    toggleModal("create", null);
  };

  return (
    <Button
      variant="contained"
      color="primary"
      size="small"
      sx={{ mb: 1 }}
      onClick={handleOpenCreateRoleModal}
      endIcon={<Add />}
    >
      Створити роль
    </Button>
  );
};

export default CreateNewRoleBtn;
