"use client";

import { Box } from "@mui/material";
import { useEffect, useState, type ReactNode } from "react";
import Sidebar from "./Sidebar";
import SidebarToggle from "./SidebarToggle";
import { collapsedWidth, drawerWidth, STORAGE_KEY } from "./layout.constants";

// * Типізація пропсів компонента
interface IProps {
  children: ReactNode;
}

const AdminLayout = ({ children }: IProps) => {
  const [collapsed, setCollapsed] = useState<boolean>(true);
  const [componentReady, setComponentReady] = useState<boolean>(false);

  // * Ініціалізуємо з localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored !== null) {
      setCollapsed(stored === "true");
    }
    setComponentReady(true);
  }, []);

  // * Записуємо зміни
  const toggleCollapse = () => {
    const newState = !collapsed;
    setCollapsed(newState);
    localStorage.setItem(STORAGE_KEY, String(newState));
  };

  // * Якщо компонент не готовий, то не рендеримо
  if (!componentReady) {
    return null;
  }

  return (
    <Box sx={{ height: "100dvh" }}>
      <Sidebar collapsed={collapsed} />
      <SidebarToggle collapsed={collapsed} onToggle={toggleCollapse} />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 2,
          transition: ".3s",
          width: `calc(100% - ${collapsed ? collapsedWidth : drawerWidth}px)`,
          marginLeft: `${collapsed ? collapsedWidth : drawerWidth}px`,
          overflowY: "auto",
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default AdminLayout;
