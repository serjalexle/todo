// * SidebarToggle.tsx

"use client";

import { FC } from "react";
import { IconButton } from "@mui/material";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import { drawerWidth, collapsedWidth } from "./layout.constants";

// * Пропси для кнопки згортання
interface IProps {
  collapsed: boolean;
  onToggle: () => void;
}

const SidebarToggle: FC<IProps> = ({ collapsed, onToggle }) => {
  return (
    <IconButton
      color="success"
      onClick={onToggle}
      size="small"
      sx={{
        transition: ".3s",
        position: "absolute",
        left: collapsed ? collapsedWidth - 20 : drawerWidth - 20,
        top: "50%",
        transform: "translateY(-80%)",
        backgroundColor: "#fff",
        zIndex: 999999999,
        border: "1px solid #e0e0e0",
        "&:hover": {
          backgroundColor: "#fff",
        },
      }}
    >
      {collapsed ? <ChevronRight fontSize="medium" /> : <ChevronLeft fontSize="medium" />}
    </IconButton>
  );
};

export default SidebarToggle;
