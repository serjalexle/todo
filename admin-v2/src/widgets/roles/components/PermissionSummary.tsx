import { Box, Typography } from "@mui/material";

interface Props {
  selected: string[];
  total: number;
  groupedPermissions: Record<string, string[]>;
}

const PermissionSummary = ({ selected, total, groupedPermissions }: Props) => {
  const selectedGroupCount = Object.entries(groupedPermissions).filter(
    ([, perms]) => perms.some((p) => selected.includes(p))
  ).length;

  return (
    <Box>
      <Typography variant="caption" color="text.secondary">
        Обрано {selected.length} з {total} прав ({selectedGroupCount} групи)
      </Typography>
    </Box>
  );
};

export default PermissionSummary;
