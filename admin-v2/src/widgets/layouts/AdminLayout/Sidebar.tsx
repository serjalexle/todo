// * Sidebar.tsx

"use client";

import { Drawer, Stack, Box } from "@mui/material";
import { FC } from "react";
import SidebarHeader from "./SidebarHeader";
import SidebarNav from "./SidebarNav";
import SidebarFooter from "./SidebarFooter";
import {
  drawerWidth,
  collapsedWidth,
  sidebarBgColor,
  sidebarTransition,
} from "./layout.constants";

// * Пропси для Sidebar
interface IProps {
  collapsed: boolean;
}

const Sidebar: FC<IProps> = ({ collapsed }) => {
  return (
    <Drawer
      variant="permanent"
      elevation={4}
      sx={{
        overflow: "visible!important",
        "& .MuiDrawer-paper": {
          transition: sidebarTransition,
          maxWidth: collapsed ? collapsedWidth : drawerWidth,
          width: "100%!important",
          overflowX: "hidden",
          bgcolor: sidebarBgColor,
        },
      }}
    >
      <Stack
        alignItems="center"
        justifyContent="space-between"
        sx={{ height: "100%" }}
      >
        <Box width="100%">
          <SidebarHeader />
          <SidebarNav collapsed={collapsed} />
        </Box>
        <SidebarFooter collapsed={collapsed} />
      </Stack>
    </Drawer>
  );
};

export default Sidebar;
