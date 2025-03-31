// * SidebarFooter.tsx

"use client";

import { FC } from "react";
import { Avatar, Box, Divider, Stack, Typography } from "@mui/material";

// * Пропси для футеру
interface IProps {
  collapsed: boolean;
}

const SidebarFooter: FC<IProps> = ({ collapsed }) => {
  // * MOCK ДАНІ
  const currentAdmin = {
    email: "test@test.com",
    role: {
      name: "Super Admin",
    },
  };

  return (
    <Box
      width="100%"
      px={collapsed ? 0 : 1.5}
      sx={{
        py: 1,
      }}
    >
      {!collapsed && (
        <Divider sx={{ mb: 1 }}>
          <Typography
            variant="caption"
            fontSize={12}
            noWrap
            color="text.secondary"
          >
            Поточний адмін
          </Typography>
        </Divider>
      )}

      <Stack spacing={1} alignItems="center">
        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          justifyContent={"flex-start"}
        >
          <Avatar
            sx={{
              width: 26,
              height: 26,
              fontSize: 12,
              bgcolor: "primary.main",
            }}
          >
            A
          </Avatar>

          {!collapsed && (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "flex-start",
                width: "100%",
                overflow: "hidden",
              }}
            >
              <Typography variant="caption" fontSize={10} noWrap>
                {currentAdmin.role.name}
              </Typography>
              <Typography variant="body2" fontSize={12} noWrap>
                {currentAdmin.email}
              </Typography>
            </Box>
          )}
        </Stack>
      </Stack>
    </Box>
  );
};

export default SidebarFooter;
