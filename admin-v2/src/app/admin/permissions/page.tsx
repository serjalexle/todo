"use client";

import { useEffect } from "react";
import AuthGuard from "@/shared/guards/AuthGuard";
import { fetchPermissions } from "@/shared/api/admin/permissionsApi";
import { usePermissionsStore } from "@/shared/store/usePermissionsStore";
import { apiHandleError } from "@/shared/helpers/apiHandleError";
import { useLoaderStore } from "@/shared/store/useLoaderStore";
import PermissionsGrid from "@/shared/components/permissions/PermissionsGrid";

const PermissionsPage = () => {
  const { setState, permissions } = usePermissionsStore();
  const { hide, show } = useLoaderStore();

  const loadPermissions = async () => {
    show();

    try {
      const result = await fetchPermissions();
      setState("permissions", result.permissions);
    } catch (error) {
      apiHandleError(error);
      setState("permissions", []);
    } finally {
      hide();
    }
  };

  useEffect(() => {
    loadPermissions();
  }, []);

  return (
    <AuthGuard>
      <PermissionsGrid permissions={permissions} />
    </AuthGuard>
  );
};

export default PermissionsPage;
