// * SidebarHeader.tsx

"use client";

import { FC } from "react";
import { Box } from "@mui/material";
import Image from "next/image";

// * Пропси для логотипу
interface IProps {
  collapsed: boolean;
}

const SidebarHeader: FC<IProps> = ({ collapsed }) => {
  return (
    <Box display="flex" justifyContent="center" p={1}>
      <Image
        src="/images/LOGO.png"
        alt="Logo"
        width={collapsed ? 40 : 80}
        height={collapsed ? 40 : 80}
      />
    </Box>
  );
};

export default SidebarHeader;
