// * SidebarHeader.tsx

"use client";

import { FC } from "react";
import { Box } from "@mui/material";
import Image from "next/image";
import Link from "next/link";

const SidebarHeader: FC = () => {
  return (
    <Box display="flex" justifyContent="center" p={1} component={Link} href="/admin/dashboard">
      <Image src="/images/LOGO.png" alt="Logo" width={50} height={50} />
    </Box>
  );
};

export default SidebarHeader;
