// * SidebarFooter.tsx

"use client";

import { FC } from "react";
import { Avatar, Box, Divider, Stack, Typography } from "@mui/material";
import { useAuthStore } from "@/shared/store/useAuthStore";
import Link from "next/link";

// * Пропси для футеру
interface IProps {
  collapsed: boolean;
}

const SidebarFooter: FC<IProps> = ({ collapsed }) => {
  const { currentAdmin } = useAuthStore();

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

      <Box
        component={Link}
        href="/admin/profile"
        width="100%"
        sx={{
          color: "text.primary",
          textDecoration: "none",
          transition: ".3s",
          "&:hover": {
            color: "success.main",
          },
        }}
      >
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
              {currentAdmin?.email?.charAt(0).toUpperCase()}
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
                  Role: {currentAdmin?.role?.name}
                </Typography>
                <Typography variant="body2" fontSize={12} noWrap>
                  {currentAdmin?.email}
                </Typography>
              </Box>
            )}
          </Stack>
        </Stack>
      </Box>
    </Box>
  );
};

export default SidebarFooter;
