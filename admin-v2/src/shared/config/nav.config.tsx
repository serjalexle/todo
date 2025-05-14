import { Home, History, Logout, SecurityRounded, Group, Diversity2, VpnKey, AddTask } from "@mui/icons-material";

export interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
  action?: "logout";
}

export const navItems: NavItem[] = [
  {
    label: "Dashboard",
    path: "/admin/dashboard",
    icon: <Home />,
  },
  {
    label: "Адміністратори",
    path: "/admin/admins",
    icon: <SecurityRounded />,
  },
  {
    label: "Користувачі",
    path: "/admin/users",
    icon: <Group />,
  },
  {
    label: "Ролі",
    path: "/admin/roles",
    icon: <Diversity2 />,
  },
  {
    label: "Права",
    path: "/admin/permissions",
    icon: <VpnKey />,
  },
  {
    label: "Задачі",
    path: "/admin/tasks",
    icon: <AddTask />,
  },
  {
    label: "Логи",
    path: "/admin/logs",
    icon: <History />,
  },
  {
    label: "Вийти",
    path: "/auth/login",
    icon: <Logout />,
    action: "logout",
  },
];
