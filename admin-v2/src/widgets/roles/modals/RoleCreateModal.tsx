"use client";

import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
  Typography,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Divider,
} from "@mui/material";
import { useState } from "react";
import { useRolesStore } from "@/shared/store/useRolesStore";
import { createRole, getAllRoles } from "@/shared/api/admin/rolesApi";
import { wrapWithRefetch } from "@/shared/utils/apiHelpers";
import { toast } from "react-toastify";
import { apiHandleError } from "@/shared/helpers/apiHandleError";

const GROUPED_PERMISSIONS: Record<string, string[]> = {
  Адміністратори: [
    "admin:create",
    "admin:read",
    "admin:update",
    "admin:delete",
  ],
  Користувачі: ["user:create", "user:read", "user:update", "user:delete"],
  Ролі: ["role:create", "role:read", "role:update", "role:delete"],
  Задачі: ["task:create", "task:read", "task:update", "task:delete"],
  Дозволи: ["permission:read"],
  Планувальник: ["scheduler:control"],
};

const RoleCreateModal = () => {
  const { modals, toggleModal, setState } = useRolesStore();

  const [name, setName] = useState("");
  const [permissions, setPermissions] = useState<string[]>([]);

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
        render: "Роль успішно створено 🎉",
        type: "success",
        isLoading: false,
        autoClose: 2000,
      });

      handleClose();
    } catch (error) {
      apiHandleError(error, toastId);
    }
  };

  const isAllSelected = Object.values(GROUPED_PERMISSIONS)
    .flat()
    .every((perm) => permissions.includes(perm));

  const handleToggleAll = (checked: boolean) => {
    if (checked) {
      setPermissions(Object.values(GROUPED_PERMISSIONS).flat());
    } else {
      setPermissions([]);
    }
  };

  const handleGroupToggle = (groupKey: string, checked: boolean) => {
    const groupPerms = GROUPED_PERMISSIONS[groupKey];
    if (checked) {
      setPermissions((prev) => Array.from(new Set([...prev, ...groupPerms])));
    } else {
      setPermissions((prev) => prev.filter((p) => !groupPerms.includes(p)));
    }
  };

  const handleTogglePermission = (permission: string, checked: boolean) => {
    if (checked) {
      setPermissions((prev) => [...prev, permission]);
    } else {
      setPermissions((prev) => prev.filter((p) => p !== permission));
    }
  };

  return (
    <Dialog
      open={modals.type === "create"}
      onClose={handleClose}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>Створити нову роль</DialogTitle>
      <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <TextField
          label="Назва ролі"
          fullWidth
          variant="outlined"
          size="small"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <FormGroup>
          <FormControlLabel
            control={
              <Checkbox
                checked={isAllSelected}
                onChange={(e) => handleToggleAll(e.target.checked)}
              />
            }
            label="Обрати всі права"
          />
        </FormGroup>

        {Object.entries(GROUPED_PERMISSIONS).map(([group, perms]) => {
          const isGroupSelected = perms.every((p) => permissions.includes(p));

          return (
            <div key={group}>
              <Divider sx={{ my: 1 }} />
              <FormGroup>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={isGroupSelected}
                      onChange={(e) =>
                        handleGroupToggle(group, e.target.checked)
                      }
                    />
                  }
                  label={`Група: ${group}`}
                />
                {perms.map((permission) => (
                  <FormControlLabel
                    key={permission}
                    control={
                      <Checkbox
                        checked={permissions.includes(permission)}
                        onChange={(e) =>
                          handleTogglePermission(permission, e.target.checked)
                        }
                      />
                    }
                    label={permission}
                    sx={{ pl: 3 }}
                  />
                ))}
              </FormGroup>
            </div>
          );
        })}
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Виберіть права, які матиме ця роль.
        </Typography>
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
