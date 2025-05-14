"use client";
import AuthGuard from "@/shared/guards/AuthGuard";
import LogsTable from "@/widgets/logs/LogsTable";
import React from "react";

const LogsPage = () => {
  return (
    <AuthGuard>
      <LogsTable />
    </AuthGuard>
  );
};

export default LogsPage;
