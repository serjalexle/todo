import { useRolesStore } from "@/shared/store/useRolesStore";
import { IRole } from "@/shared/types/role";
import { capitalize } from "@/shared/utils/capitalize";
import { Delete, Edit } from "@mui/icons-material";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Chip,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import Link from "next/link";
import React from "react";

interface IProps {
  role: IRole;
}

interface IGroupedPermissions {
  [module: string]: string[];
}

// 🎨 Кольори для кожного модуля
const moduleColors: Record<string, string> = {
  admin: "primary",
  user: "success",
  role: "warning",
  task: "secondary",
  permission: "info",
  scheduler: "error",
  default: "default",
};

const groupPermissions = (permissions: string[]): IGroupedPermissions => {
  return permissions.reduce<IGroupedPermissions>((acc, perm) => {
    const [module, action] = perm.split(":");
    if (!acc[module]) acc[module] = [];
    acc[module].push(action);
    return acc;
  }, {});
};

const RoleGridCardItem = ({ role }: IProps) => {
  const { toggleModal } = useRolesStore();
  const grouped = groupPermissions(role.permissions);

  return (
    <Card
      key={role._id}
      sx={{
        maxWidth: 360,
        width: "100%",
        minHeight: 200,
        boxShadow: 3,
        borderRadius: 3,
      }}
    >
      <CardHeader
        title={
          <Typography variant="h6" fontWeight={600}>
            {capitalize(role.name)}
          </Typography>
        }
        action={
          role?.name !== "superadmin" ? (
            <Stack direction="row" spacing={1}>
              <Tooltip
                title="Редагувати"
                arrow
                placement="top"
                onClick={() => toggleModal("edit", role)}
              >
                <IconButton size="small" color="warning">
                  <Edit fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip
                title="Видалити"
                arrow
                placement="top"
                onClick={() => toggleModal("delete", role)}
              >
                <IconButton size="small" color="error">
                  <Delete fontSize="small" />
                </IconButton>
              </Tooltip>
            </Stack>
          ) : null
        }
      />

      <CardContent>
        <Stack spacing={1}>
          {Object.entries(grouped).map(([module, actions]) => (
            <Box key={module}>
              <Typography variant="subtitle2" color="text.secondary">
                {capitalize(module)}
              </Typography>
              <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
                {actions.map((action) => (
                  <Chip
                    key={action}
                    label={capitalize(action)}
                    size="small"
                    // @ts-expect-error // TODO: Fix type error for color prop
                    color={moduleColors[module] || moduleColors.default}
                    variant="outlined"
                  />
                ))}
              </Stack>
            </Box>
          ))}
        </Stack>

        <Box mt={2}>
          <Typography variant="subtitle2" color="textDisabled">
            {role?.created_by?.email ? (
              <Link
                href={`/admin?id=${role?.created_by?._id}`}
                style={{ textDecoration: "none" }}
              >
                {`Створено ${role?.created_by?.email}`}
              </Link>
            ) : (
              "Створено системою"
            )}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default RoleGridCardItem;
