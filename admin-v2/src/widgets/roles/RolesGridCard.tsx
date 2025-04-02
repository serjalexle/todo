"use client";

import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Chip,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import { useRolesStore } from "@/shared/store/useRolesStore";
import { capitalize } from "@/shared/utils/capitalize";

interface IGroupedPermissions {
  [module: string]: string[];
}

// 🎨 Кольори для кожного модуля
const moduleColors: Record<string, string> = {
  admin: "primary",
  user: "success",
  role: "warning",
  task: "secondary",
  permission: "info",
  scheduler: "error",
  default: "default",
};

const groupPermissions = (permissions: string[]): IGroupedPermissions => {
  return permissions.reduce<IGroupedPermissions>((acc, perm) => {
    const [module, action] = perm.split(":");
    if (!acc[module]) acc[module] = [];
    acc[module].push(action);
    return acc;
  }, {});
};

const RolesGridCard = () => {
  const { roles, toggleModal } = useRolesStore();

  return (
    <Box>
      <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
        {roles.map((role) => {
          const grouped = groupPermissions(role.permissions);

          return (
            <Card
              key={role._id}
              sx={{
                maxWidth: 360,
                width: "100%",
                minHeight: 200,
                boxShadow: 3,
                borderRadius: 3,
              }}
            >
              <CardHeader
                title={
                  <Typography variant="h6" fontWeight={600}>
                    {capitalize(role.name)}
                  </Typography>
                }
                action={
                  role?.name !== "superadmin" ? (
                    <Stack direction="row" spacing={1}>
                      <Tooltip
                        title="Редагувати"
                        arrow
                        placement="top"
                        onClick={() => toggleModal("edit", role._id)}
                      >
                        <IconButton size="small" color="warning">
                          <Edit fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip
                        title="Видалити"
                        arrow
                        placement="top"
                        onClick={() => toggleModal("delete", role._id)}
                      >
                        <IconButton size="small" color="error">
                          <Delete fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  ) : null
                }
              />

              <CardContent>
                <Stack spacing={1}>
                  {Object.entries(grouped).map(([module, actions]) => (
                    <Box key={module}>
                      <Typography variant="subtitle2" color="text.secondary">
                        {capitalize(module)}
                      </Typography>
                      <Stack
                        direction="row"
                        spacing={0.5}
                        flexWrap="wrap"
                        useFlexGap
                      >
                        {actions.map((action) => (
                          <Chip
                            key={action}
                            label={capitalize(action)}
                            size="small"
                            // @ts-expect-error // TODO: Fix type error for color prop
                            color={moduleColors[module] || moduleColors.default}
                            variant="outlined"
                          />
                        ))}
                      </Stack>
                    </Box>
                  ))}
                </Stack>
              </CardContent>
            </Card>
          );
        })}
      </Stack>
    </Box>
  );
};

export default RolesGridCard;
