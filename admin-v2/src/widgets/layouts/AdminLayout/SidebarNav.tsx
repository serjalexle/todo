// * SidebarNav.tsx

"use client";

import {
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
} from "@mui/material";
import { FC } from "react";
import { usePathname } from "next/navigation";
import { navItems } from "@/shared/config/nav.config";
import { useAdminNavigation } from "@/shared/hooks/useAdminNavigation";

// * Пропси для навігаційного блоку
interface IProps {
  collapsed: boolean;
}

const SidebarNav: FC<IProps> = ({ collapsed }) => {
  const pathname = usePathname();
  const { handleAction } = useAdminNavigation();

  return (
    <List dense>
      {navItems.map((item) => {
        const isActive = pathname.startsWith(item.path);
        const iconColor = isActive ? "primary.main" : "text.secondary";

        return (
          <Tooltip
            key={item.label}
            title={collapsed ? item.label : ""}
            placement="right"
            arrow
          >
            <ListItemButton
              onClick={() => handleAction(item.action, item.path)}
              selected={isActive}
              sx={{
                my: 0.5,
                py: 0.7,
                px: collapsed ? 1 : 1.5,
                borderRadius: 2,
                justifyContent: collapsed ? "center" : "flex-start",
                backgroundColor: isActive ? "rgba(46,125,50,0.1)" : "transparent",
                "&:hover": {
                  backgroundColor: "rgba(46,125,50,0.15)",
                },
              }}
            >
              <ListItemIcon
                sx={{
                  color: iconColor,
                  minWidth: 0,
                  mr: collapsed ? 0 : 1.5,
                  fontSize: 18,
                }}
              >
                {item.icon}
              </ListItemIcon>
              {!collapsed && (
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    fontSize: 13,
                    fontWeight: 500,
                    noWrap: true,
                    sx: {
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    },
                  }}
                />
              )}
            </ListItemButton>
          </Tooltip>
        );
      })}
    </List>
  );
};

export default SidebarNav;
