import {
  Box,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Typography,
} from "@mui/material";
import { useMemo } from "react";
import PermissionGroup from "./PermissionGroup";
import PermissionSummary from "./PermissionSummary";

interface Props {
  allPermissions: string[];
  selected: string[];
  onChange: (updated: string[]) => void;
}

const PermissionSelector = ({ allPermissions, selected, onChange }: Props) => {
  const groupedPermissions = useMemo(() => {
    return allPermissions.reduce<Record<string, string[]>>((acc, perm) => {
      const [group] = perm.split(":");
      if (!acc[group]) acc[group] = [];
      acc[group].push(perm);
      return acc;
    }, {});
  }, [allPermissions]);

  const isAllSelected = useMemo(() => {
    return Object.values(groupedPermissions)
      .flat()
      .every((p) => selected.includes(p));
  }, [groupedPermissions, selected]);

  const handleToggleAll = (checked: boolean) => {
    const all = Object.values(groupedPermissions).flat();
    onChange(checked ? all : []);
  };

  const handleGroupToggle = (groupKey: string, checked: boolean) => {
    const groupPerms = groupedPermissions[groupKey];
    onChange(
      checked
        ? Array.from(new Set([...selected, ...groupPerms]))
        : selected.filter((p) => !groupPerms.includes(p))
    );
  };

  const handleTogglePermission = (permission: string, checked: boolean) => {
    onChange(
      checked
        ? [...selected, permission]
        : selected.filter((p) => p !== permission)
    );
  };

  return (
    <Box sx={{ width: "100%", maxHeight: 700, overflowY: "auto", pr: 1 }}>
      <PermissionSummary
        selected={selected}
        total={allPermissions.length}
        groupedPermissions={groupedPermissions}
      />
      <FormGroup sx={{ mb: 1 }}>
        <FormControlLabel
          control={
            <Checkbox
              size="small"
              checked={isAllSelected}
              onChange={(e) => handleToggleAll(e.target.checked)}
            />
          }
          label={
            <Typography variant="body2" fontWeight={600}>
              Обрати всі права
            </Typography>
          }
          sx={{ mb: 0.5 }}
        />
      </FormGroup>

      {Object.entries(groupedPermissions).map(([group, perms]) => (
        <PermissionGroup
          key={group}
          group={group}
          permissions={perms}
          selected={selected}
          onGroupToggle={handleGroupToggle}
          onPermissionToggle={handleTogglePermission}
        />
      ))}
    </Box>
  );
};

export default PermissionSelector;
