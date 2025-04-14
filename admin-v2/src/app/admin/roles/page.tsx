"use client";

import { getAllRoles } from "@/shared/api/admin/rolesApi";
import AuthGuard from "@/shared/guards/AuthGuard";
import { apiHandleError } from "@/shared/helpers/apiHandleError";
import { useRolesStore } from "@/shared/store/useRolesStore";
import React, { useEffect, useState } from "react";
import RoleDeleteModal from "@/widgets/roles/modals/RoleDeleteModal";
import { Box, Pagination, Stack } from "@mui/material";
import RoleCreateModal from "@/widgets/roles/modals/RoleCreateModal";
import { useLoaderStore } from "@/shared/store/useLoaderStore";
import RoleEditModal from "@/widgets/roles/modals/RoleEditModal";
import RolesGrid from "@/widgets/roles/RolesGrid";
import СreateNewFabMenu from "@/widgets/roles/components/CreateNewFabMenu";

const RolesPage = () => {
  const { setState, meta } = useRolesStore();
  const { hide, show } = useLoaderStore();

  const [page, setPage] = useState(1);
  const countPerPage = 10;

  const fetchRoles = async (currentPage: number) => {
    show();
    try {
      const response = await getAllRoles({
        page: currentPage,
        count: countPerPage,
      });

      setState({
        roles: response.result.roles,
        meta: response.result.meta,
      });
    } catch (e) {
      apiHandleError(e);
    } finally {
      hide();
    }
  };

  useEffect(() => {
    fetchRoles(page);
  }, [page]);

  return (
    <AuthGuard>
      <RoleDeleteModal />
      <RoleCreateModal />
      <RoleEditModal />

      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
        }}
      >
        <СreateNewFabMenu />
      </Box>

      <RolesGrid />

      <Stack spacing={2} alignItems="center" mt={4}>
        <Pagination
          color="primary"
          count={Math.round(meta?.total / countPerPage) || 1}
          page={page}
          onChange={(_, newPage) => setPage(newPage)}
        />
      </Stack>
    </AuthGuard>
  );
};

export default RolesPage;
