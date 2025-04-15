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
import { createRole, getAllRoles } from "@/shared/api/admin/rolesApi";
import { wrapWithRefetch } from "@/shared/utils/apiHelpers";
import { toast } from "react-toastify";
import { apiHandleError } from "@/shared/helpers/apiHandleError";
import PermissionSelector from "../components/PermissionSelector";

const RoleCreateModal = () => {
  const { modals, toggleModal, setState } = useRolesStore();
  const { permissions: ALL_PERMISSIONS, setState: setPermissionStore } =
    usePermissionsStore();

  const [name, setName] = useState("");
  const [permissions, setPermissions] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClose = () => {
    toggleModal(null);
    setName("");
    setPermissions([]);
  };

  const handleSubmit = async () => {
    const toastId = toast.loading("Створення ролі...");

    try {
      const response = await wrapWithRefetch(
        () => createRole({ name, permissions }),
        () => getAllRoles({ page: 1, count: 10 })
      );

      setState({
        roles: response.result.roles,
        meta: response.result.meta,
      });

      toast.update(toastId, {
        render: "Роль успішно створено 🎉",
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

  return (
    <Dialog
      open={modals.type === "create"}
      onClose={handleClose}
      fullWidth
      maxWidth="lg"
    >
      <DialogTitle>Створити нову роль</DialogTitle>
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
          Створити
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RoleCreateModal;
