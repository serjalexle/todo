"use client";

import AuthGuard from "@/shared/guards/AuthGuard";
import UsersTable from "@/widgets/users/UsersTable";
import React from "react";

const UsersPage = () => {
  return (
    <AuthGuard>
      <UsersTable />
    </AuthGuard>
  );
};

export default UsersPage;
