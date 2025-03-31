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
        let iconColor = isActive ? "primary.main" : "text.secondary";

        if (item?.action === "logout") {
          iconColor = "#f44336";
        }

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
                py: 1,
                px: 2.2,
                borderRadius: 2,
                justifyContent: "flex-start",
                backgroundColor: isActive
                  ? "rgba(46,125,50,0.1)"
                  : "transparent",
                "&:hover": {
                  backgroundColor: "rgba(46,125,50,0.15)",
                },
                height: 40,
                color: item?.action === "logout" ? "#f44336" : "inherit",
              }}
            >
              <ListItemIcon
                sx={{
                  color: iconColor,
                  minWidth: 0,
                  mr: 0,
                  fontSize: 18,
                }}
              >
                {item.icon}
              </ListItemIcon>
              {!collapsed && (
                <ListItemText
                  primary={item.label}
                  slotProps={{
                    primary: {
                      fontSize: 13,
                      fontWeight: 500,
                      noWrap: true,
                      sx: {
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        ml: 1.5,
                      },
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
