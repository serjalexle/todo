"use client";

import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
} from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";
import { useRolesStore } from "@/shared/store/useRolesStore";
import { usePermissionsStore } from "@/shared/store/usePermissionsStore";
import { fetchPermissions } from "@/shared/api/admin/permissionsApi";
import { getAllRoles, updateRole } from "@/shared/api/admin/rolesApi";
import { wrapWithRefetch } from "@/shared/utils/apiHelpers";
import { toast } from "react-toastify";
import { apiHandleError } from "@/shared/helpers/apiHandleError";
import PermissionSelector from "../components/PermissionSelector";

const RoleEditModal = () => {
  const { modals, toggleModal, roles, setState } = useRolesStore();
  const { permissions: ALL_PERMISSIONS, setState: setPermissionStore } =
    usePermissionsStore();

  const currentRole = roles.find((r) => r._id === modals.role?._id);

  const [name, setName] = useState(currentRole?.name || "");
  const [permissions, setPermissions] = useState<string[]>(currentRole?.permissions || []);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClose = () => {
    toggleModal(null);
    setName("");
    setPermissions([]);
  };

  const handleSubmit = async () => {
    if (!currentRole) return;

    const toastId = toast.loading("Оновлення ролі...");

    try {
      const response = await wrapWithRefetch(
        () => updateRole(currentRole._id, { name, permissions }),
        () => getAllRoles({ page: 1, count: 10 })
      );

      setState({
        roles: response.result.roles,
        meta: response.result.meta,
      });

      toast.update(toastId, {
        render: "Роль успішно оновлено ✅",
        type: "success",
        isLoading: false,
        autoClose: 2000,
      });

      handleClose();
    } catch (error) {
      if (
        error instanceof Error &&
        (error.message.includes("already exists") ||
          error.message.includes("вже існує"))
      ) {
        setTimeout(() => {
          inputRef.current?.focus();
        }, 100);
      }

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

  useEffect(() => {
    if (modals.type === "edit" && currentRole) {
      setName(currentRole.name);
      setPermissions(currentRole.permissions);
    }
  }, [modals.type, currentRole]);

  return (
    <Dialog
      open={modals.type === "edit"}
      onClose={handleClose}
      fullWidth
      maxWidth="lg"
      
    >
      <DialogTitle>Редагувати роль</DialogTitle>
      <DialogContent sx={{ display: "flex", gap: 2 }}>
        <TextField
          inputRef={inputRef}
          label="Назва ролі"
          fullWidth
          variant="outlined"
          sx={{ mt: 1, maxWidth: 300 }}
          size="small"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <PermissionSelector
          allPermissions={ALL_PERMISSIONS}
          selected={permissions}
          onChange={setPermissions}
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
          disabled={!name}
        >
          Зберегти
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RoleEditModal;