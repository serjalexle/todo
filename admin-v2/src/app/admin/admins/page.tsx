import AuthGuard from "@/shared/guards/AuthGuard";
import AdminsTable from "@/widgets/admins/AdminsTable";
import React from "react";

const AdminsPage = () => {
  return (
    <AuthGuard>
      <AdminsTable />
    </AuthGuard>
  );
};

export default AdminsPage;
