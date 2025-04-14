"use client";

import { Box, Stack } from "@mui/material";
import { useRolesStore } from "@/shared/store/useRolesStore";
import RoleGridCardItem from "./components/RoleGridCardItem";

const RolesGridCard = () => {
  const { roles } = useRolesStore();

  return (
    <Box>
      <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
        {roles.map((role) => (
          <RoleGridCardItem role={role} key={role._id} />
        ))}
      </Stack>
    </Box>
  );
};

export default RolesGridCard;