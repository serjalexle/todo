"use client";

import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
  Box,
} from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";
import { usePermissionsStore } from "@/shared/store/usePermissionsStore";
import { fetchPermissions } from "@/shared/api/admin/permissionsApi";
import { wrapWithRefetch } from "@/shared/utils/apiHelpers";
import { toast } from "react-toastify";
import { apiHandleError } from "@/shared/helpers/apiHandleError";
import { Add } from "@mui/icons-material";
import { useAdminsStore } from "@/shared/store/useAdminsStore";
import { createAdmin, getAllAdmins } from "@/shared/api/admin/adminsApi";
import { IAdminCreateDto } from "@/shared/types/admin";
import PermissionSelector from "@/widgets/roles/components/PermissionSelector";

const AdminCreateModal = () => {
  const { modals, toggleModal, setState } = useAdminsStore();
  const { permissions: ALL_PERMISSIONS, setState: setPermissionStore } =
    usePermissionsStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [roleId, setRoleId] = useState("");
  const [customPermissions, setCustomPermissions] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClose = () => {
    toggleModal(null);
    setEmail("");
    setPassword("");
    setRoleId("");
    setCustomPermissions([]);
  };

  const handleSubmit = async () => {
    const toastId = toast.loading("Створення адміністратора...");

    const createAdminData: IAdminCreateDto = {
      email,
      password,
      role_id: roleId,
      custom_permissions: customPermissions,
    };

    try {
      const response = await wrapWithRefetch(
        () => createAdmin(createAdminData),
        () => getAllAdmins({ page: 1, count: 10 })
      );

      setState({
        admins: response.result.admins,
        meta: response.result.meta,
      });

      toast.update(toastId, {
        render: "Адміністратора успішно створено 🎉",
        type: "success",
        isLoading: false,
        autoClose: 2000,
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
      open={modals.type === "create"}
      onClose={handleClose}
      fullWidth
      maxWidth="lg"
    >
      <DialogTitle>Створення адміністратора</DialogTitle>
      <DialogContent sx={{ display: "flex", gap: 2 }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, width: 300 }}>
          <TextField
            label="Email"
            fullWidth
            variant="outlined"
            size="small"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            inputRef={inputRef}
          />

          <TextField
            label="Пароль"
            fullWidth
            variant="outlined"
            size="small"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {/* <RoleSelector value={roleId} onChange={setRoleId} /> */}
        </Box>

        <PermissionSelector
          allPermissions={ALL_PERMISSIONS}
          selected={customPermissions}
          onChange={setCustomPermissions}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="inherit">
          Скасувати
        </Button>
        <Button
          onClick={handleSubmit}
          color="primary"
          variant="contained"
          endIcon={<Add />}
          disabled={!email || !password || !roleId}
        >
          Створити
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AdminCreateModal;