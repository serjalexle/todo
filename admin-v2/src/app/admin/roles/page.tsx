"use client";

import { getAllRoles } from "@/shared/api/admin/rolesApi";
import RolesList from "@/shared/components/tables/roles/RolesTable";
import AuthGuard from "@/shared/guards/AuthGuard";
import { apiHandleError } from "@/shared/helpers/apiHandleError";
import { useRolesStore } from "@/shared/store/useRolesStore";
import React, { useEffect } from "react";

const RolesPage = () => {
  const { setState } = useRolesStore();

  useEffect(() => {
    const fetch = async () => {
      try {
        const response = await getAllRoles({
          page: 1,
          count: 10,
        });
        setState("roles", response.result.roles);
        console.log(response.result.roles);
      } catch (e) {
        apiHandleError(e);
      }
    };

    fetch();
  }, [setState]);
  return (
    <AuthGuard>
      <RolesList />
    </AuthGuard>
  );
};

export default RolesPage;
