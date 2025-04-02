"use client";

import { getAllRoles } from "@/shared/api/admin/rolesApi";
import AuthGuard from "@/shared/guards/AuthGuard";
import { apiHandleError } from "@/shared/helpers/apiHandleError";
import { useRolesStore } from "@/shared/store/useRolesStore";
import React, { useEffect } from "react";
import RolesGridCard from "@/widgets/roles/RolesGridCard";
import RoleDeleteModal from "@/widgets/roles/modals/RoleDeleteModal";

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
      <RoleDeleteModal />
      <RolesGridCard />
    </AuthGuard>
  );
};

export default RolesPage;
