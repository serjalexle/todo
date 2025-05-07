import { getAllAdmins, updateAdmin } from "@/shared/api/admin/adminsApi";
import { fetchPermissions } from "@/shared/api/admin/permissionsApi";
import RoleSelector from "@/shared/components/UI/RoleSelector/RoleSelector";
import { apiHandleError } from "@/shared/helpers/apiHandleError";
import { useAdminsStore } from "@/shared/store/useAdminsStore";
import { useAuthStore } from "@/shared/store/useAuthStore";
import { usePermissionsStore } from "@/shared/store/usePermissionsStore";
import { IAdminUpdateDto } from "@/shared/types/admin";
import { wrapWithRefetch } from "@/shared/utils/apiHelpers";
import PermissionSelector from "@/widgets/roles/components/PermissionSelector";
import { Save } from "@mui/icons-material";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";

const AdminEditModal = () => {
  const { modals, toggleModal, setState } = useAdminsStore();
  const { currentAdmin } = useAuthStore();
  const { permissions: ALL_PERMISSIONS, setState: setPermissionStore } =
    usePermissionsStore();

  const [email, setEmail] = useState(modals.admin?.email || "");
  const [role, setRole] = useState(modals.admin?.role || null);
  const [customPermissions, setCustomPermissions] = useState<string[]>(
    modals.admin?.custom_permissions || []
  );

  const handleClose = () => {
    toggleModal(null);
  };

  const handleSubmit = async () => {
    const toastId = toast.loading("Редагування адміністратора...");

    if (!currentAdmin?.role.permissions.includes("admin:edit")) {
      toast.update(toastId, {
        render: "У вас немає прав для редагування адміністратора",
        type: "error",
        isLoading: false,
        autoClose: 5000,
      });
      return;
    }

    const adminIdForEdit = modals.admin?._id;

    if (!adminIdForEdit) {
      toast.update(toastId, {
        render: "Виберіть адміністратора для редагування",
        type: "error",
        isLoading: false,
        autoClose: 5000,
      });
      return;
    }

    const payload: IAdminUpdateDto = {
      email: email,
      role_id: role?._id,
      custom_permissions: customPermissions,
    };

    try {
      const response = await wrapWithRefetch(
        () => updateAdmin(adminIdForEdit, payload),
        () => getAllAdmins({ page: 1, count: 10 })
      );

      setState({
        admins: response.result.admins,
        meta: response.result.meta,
      });

      toast.update(toastId, {
        render: "Адміністратора успішно відредаговано 🎉",
        type: "success",
        isLoading: false,
        autoClose: 5000,
      });

      handleClose();
    } catch (error) {
      apiHandleError(error, toastId);
    }
  };

  const getAllPermissions = useCallback(async () => {
    const response = await fetchPermissions();
    setPermissionStore({ permissions: response.permissions });
  }, [setPermissionStore]);

  useEffect(() => {
    getAllPermissions();
  }, [getAllPermissions]);

  return (
    <Dialog
      open={modals.type === "edit"}
      onClose={handleClose}
      fullWidth
      maxWidth="lg"
    >
      <DialogTitle>Редагування адміністратора</DialogTitle>
      <DialogContent sx={{ display: "flex", gap: 2 }}>
        <Box
          sx={{ display: "flex", flexDirection: "column", gap: 2, width: 300 }}
        >
          <TextField
            label="Email"
            fullWidth
            variant="outlined"
            size="small"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <RoleSelector handleChange={setRole} value={role} />
        </Box>

        <PermissionSelector
          allPermissions={ALL_PERMISSIONS}
          selected={customPermissions}
          onChange={setCustomPermissions}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="error">
          Скасувати
        </Button>
        <Button
          onClick={handleSubmit}
          color="error"
          variant="contained"
          endIcon={<Save />}
        >
          Зберегти
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AdminEditModal;
