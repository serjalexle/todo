"use client";

import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Typography,
} from "@mui/material";
import { useRolesStore } from "@/shared/store/useRolesStore";
import { toast } from "react-toastify";
import { apiHandleError } from "@/shared/helpers/apiHandleError";
import { deleteRole, getAllRoles } from "@/shared/api/admin/rolesApi";
import { wrapWithRefetch } from "@/shared/utils/apiHelpers";

const RoleDeleteModal = () => {
  const { modals, toggleModal, setState } = useRolesStore();

  const handleClose = () => {
    toggleModal(null);
  };

  const handleConfirm = async () => {
    if (!modals.role?._id) {
      toast.error("Роль не знайдено");
      return;
    }

    const toastId = toast.loading("Видалення ролі...");

    try {
      const response = await wrapWithRefetch(
        () => deleteRole(modals.role?._id as string),
        () =>
          getAllRoles({
            page: 1,
            count: 10,
          })
      );

      setState({
        roles: response.result.roles,
        meta: response.result.meta,
      });

      toast.update(toastId, {
        render: "Роль успішно видалено 🗑️",
        type: "success",
        isLoading: false,
        autoClose: 2000,
      });

      handleClose();
    } catch (error) {
      apiHandleError(error, toastId);
    }
  };

  return (
    <Dialog open={modals.type === "delete"} onClose={handleClose}>
      <DialogTitle>Видалити роль?</DialogTitle>
      <DialogContent>
        <Typography>
          Ви точно хочете видалити цю роль? Цю дію не можна буде скасувати.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="inherit">
          Ні
        </Button>
        <Button onClick={handleConfirm} color="error" variant="contained">
          Так, видалити
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RoleDeleteModal;
