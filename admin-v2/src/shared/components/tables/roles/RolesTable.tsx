"use client";

import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Chip,
  IconButton,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import { useRolesStore } from "@/shared/store/useRolesStore";
import { useState } from "react";

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

const capitalize = (str: string): string =>
  str.charAt(0).toUpperCase() + str.slice(1);

const RolesList = () => {
  const { roles } = useRolesStore();
  const [search, setSearch] = useState("");

  const filteredRoles = roles.filter((r) =>
    r.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box>
      <Box mb={3}>
        <TextField
          label="Пошук по назві"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          fullWidth
          size="small"
        />
      </Box>

      <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
        {filteredRoles.map((role) => {
          const grouped = groupPermissions(role.permissions);

          return (
            <Card
              key={role._id}
              sx={{
                width: 360,
                boxShadow: 3,
                borderRadius: 3,
                bgcolor: "#fff",
              }}
            >
              <CardHeader
                title={
                  <Typography variant="h6" fontWeight={600}>
                    {role.name}
                  </Typography>
                }
                action={
                  <Stack direction="row" spacing={1}>
                    <Tooltip title="Редагувати">
                      <IconButton size="small">
                        <Edit fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Видалити">
                      <IconButton size="small">
                        <Delete fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                }
                sx={{ pb: 0 }}
              />

              <CardContent>
                <Stack spacing={2}>
                  {Object.entries(grouped).map(([module, actions]) => (
                    <Box key={module}>
                      <Typography
                        variant="subtitle2"
                        color="text.secondary"
                        mb={0.5}
                      >
                        {capitalize(module)}
                      </Typography>
                      <Stack
                        direction="row"
                        spacing={1}
                        flexWrap="wrap"
                        useFlexGap
                      >
                        {actions.map((action) => (
                          <Chip
                            key={action}
                            label={action}
                            size="small"
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

export default RolesList;
