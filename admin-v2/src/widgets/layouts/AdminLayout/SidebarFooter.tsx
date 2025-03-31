// * SidebarFooter.tsx

"use client";

import { FC } from "react";
import { Avatar, Box, Stack, Typography } from "@mui/material";

// * Пропси для футеру
interface IProps {
  collapsed: boolean;
}

const SidebarFooter: FC<IProps> = ({ collapsed }) => {
  return (
    <Box width="100%" px={collapsed ? 0 : 1.5} pb={1.5}>
      <Stack spacing={1} alignItems="center">
        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          justifyContent={collapsed ? "center" : "flex-start"}
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
            <Typography variant="body2" fontSize={12} noWrap>
              Admin
            </Typography>
          )}
        </Stack>
      </Stack>
    </Box>
  );
};

export default SidebarFooter;
