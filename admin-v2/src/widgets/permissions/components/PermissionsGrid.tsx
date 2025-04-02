"use client";

import { Card, CardContent, CardHeader, Chip, Stack } from "@mui/material";

interface IProps {
  permissions: string[];
}

// 🎨 Унікальні кольори для кожної групи
const moduleColors: Record<string, string> = {
  admin: "#c8e6c9",
  user: "#bbdefb",
  role: "#ffe0b2",
  task: "#d1c4e9",
  permission: "#f8bbd0",
  scheduler: "#b2dfdb",
};

const groupPermissions = (permissions: string[]) => {
  const grouped: Record<string, string[]> = {};

  permissions.forEach((perm) => {
    const [module, action] = perm.split(":");
    if (!grouped[module]) grouped[module] = [];
    grouped[module].push(action);
  });

  return grouped;
};

const capitalize = (value: string) =>
  value.charAt(0).toUpperCase() + value.slice(1);

const PermissionsGrid = ({ permissions }: IProps) => {
  const grouped = groupPermissions(permissions);

  return (
    <Stack
      direction="row"
      flexWrap="wrap"
      spacing={2}
      useFlexGap
      justifyContent="flex-start"
    >
      {Object.entries(grouped).map(([module, actions]) => (
        <Card
          key={module}
          sx={{
            width: 280,
            borderRadius: 3,
            boxShadow: 4,
          }}
        >
          <CardHeader
            title={capitalize(module)}
            slotProps={{
              title: {
                fontWeight: 600,
                fontSize: "1.2rem",
                color: "#212121",
              },
            }}
            sx={{
              bgcolor: moduleColors[module] || "#e0e0e0",
              borderTopLeftRadius: 12,
              borderTopRightRadius: 12,
              py: 1.5,
              px: 2,
            }}
          />
          <CardContent>
            <Stack spacing={1} direction="row" flexWrap="wrap" useFlexGap>
              {actions.map((action) => (
                <Chip
                  key={action}
                  label={action}
                  variant="outlined"
                  color="primary"
                />
              ))}
            </Stack>
          </CardContent>
        </Card>
      ))}
    </Stack>
  );
};

export default PermissionsGrid;
