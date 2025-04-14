import {
    Box,
    Checkbox,
    FormControlLabel,
    FormGroup,
    Typography,
    Divider,
    Badge,
  } from "@mui/material";
  
  interface Props {
    group: string;
    permissions: string[];
    selected: string[];
    onGroupToggle: (groupKey: string, checked: boolean) => void;
    onPermissionToggle: (permission: string, checked: boolean) => void;
  }
  
  const PermissionGroup = ({
    group,
    permissions,
    selected,
    onGroupToggle,
    onPermissionToggle,
  }: Props) => {
    const isGroupSelected = permissions.every((p) => selected.includes(p));
    const selectedInGroup = permissions.filter((p) => selected.includes(p)).length;
  
    return (
      <Box sx={{ mt: 1 }}>
        <Divider sx={{ my: 1 }} />
        <FormGroup>
          <FormControlLabel
            control={
              <Checkbox
                size="small"
                checked={isGroupSelected}
                onChange={(e) => onGroupToggle(group, e.target.checked)}
              />
            }
            label={
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                sx={{ cursor: "pointer", width: "100%" }}
              >
                <Typography variant="body2" fontWeight={500}>
                  Група: {group}
                </Typography>
                <Badge
                  badgeContent={selectedInGroup}
                  color="primary"
                  sx={{
                    ml: 2,
                    "& .MuiBadge-badge": {
                      fontSize: "0.7rem",
                      height: 18,
                      minWidth: 18,
                    },
                  }}
                />
              </Box>
            }
            sx={{ mb: 0.5 }}
          />
  
          <Box
            sx={{
              display: "flex",
              gap: 0.5,
              flexWrap: "wrap",
              pl: 3,
            }}
          >
            {permissions.map((permission) => (
              <FormControlLabel
                key={permission}
                control={
                  <Checkbox
                    size="small"
                    checked={selected.includes(permission)}
                    onChange={(e) =>
                      onPermissionToggle(permission, e.target.checked)
                    }
                  />
                }
                label={<Typography variant="caption">{permission}</Typography>}
                sx={{ mb: 0.5 }}
              />
            ))}
          </Box>
        </FormGroup>
      </Box>
    );
  };
  
  export default PermissionGroup;