import AuthGuard from "@/shared/guards/AuthGuard";
import AdminsTable from "@/widgets/admins/AdminsTable";
import { Box } from "@mui/material";
import React from "react";

const AdminsPage = () => {
  return (
    <AuthGuard>
      {/* {modals.type === "create" && <RoleCreateModal />}
      {modals.type === "edit" && <RoleEditModal />}
      {modals.type === "delete" && <RoleDeleteModal />} */}

      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
        }}
      >
        {/* <СreateNewFabMenu /> */}
      </Box>

      {/* <RolesGrid /> */}
      <AdminsTable />
    </AuthGuard>
  );
};

export default AdminsPage;
