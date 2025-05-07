import { deleteAdmin, getAllAdmins } from "@/shared/api/admin/adminsApi";
import { apiHandleError } from "@/shared/helpers/apiHandleError";
import { useAdminsStore } from "@/shared/store/useAdminsStore";
import { useAuthStore } from "@/shared/store/useAuthStore";
import { wrapWithRefetch } from "@/shared/utils/apiHelpers";
import { Delete } from "@mui/icons-material";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import React from "react";
import { toast } from "react-toastify";

const AdminDeleteModal = () => {
  const { modals, toggleModal, setState } = useAdminsStore();
  const { currentAdmin } = useAuthStore();

  const handleClose = () => {
    toggleModal(null);
  };

  const handleSubmit = async () => {
    const toastId = toast.loading("Видалення адміністратора...");

    if (!currentAdmin?.role.permissions.includes("admin:delete")) {
      toast.update(toastId, {
        render: "У вас немає прав для видалення адміністратора",
        type: "error",
        isLoading: false,
        autoClose: 5000,
      });
      return;
    }

    const adminIdForDelete = modals.admin?._id;

    if (!adminIdForDelete) {
      toast.update(toastId, {
        render: "Виберіть адміністратора для видалення",
        type: "error",
        isLoading: false,
        autoClose: 5000,
      });
      return;
    }

    try {
      const response = await wrapWithRefetch(
        () => deleteAdmin(adminIdForDelete),
        () => getAllAdmins({ page: 1, count: 10 })
      );

      setState({
        admins: response.result.admins,
        meta: response.result.meta,
      });

      toast.update(toastId, {
        render: "Адміністратора успішно видалено 🎉",
        type: "success",
        isLoading: false,
        autoClose: 5000,
      });

      handleClose();
    } catch (error) {
      apiHandleError(error, toastId);
    }
  };

  return (
    <Dialog
      open={modals.type === "delete"}
      onClose={handleClose}
      fullWidth
      maxWidth="lg"
    >
      <DialogTitle>Видалення адміністратора</DialogTitle>
      <DialogContent sx={{ display: "flex", gap: 2 }}>
        <Typography variant="body1" color="text.secondary">
          Ви впевнені, що хочете видалити адміністратора{" "}
          <strong>{modals.admin?.email}</strong>?<br />
          Цю дію не можна скасувати. Будь ласка, підтвердіть видалення
          адміністратора.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Скасувати
        </Button>
        <Button
          onClick={handleSubmit}
          color="error"
          variant="contained"
          endIcon={<Delete />}
        >
          Видалити
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AdminDeleteModal;
