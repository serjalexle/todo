import CTable from "@/shared/components/UI/CTable/CTable";
import NoDataPlaceholder from "@/shared/components/UI/NoDataPlaceholder/NoDataPlaceholder";
import { TablePagination } from "@mui/material";
import React, { useCallback, useEffect } from "react";
import UsersTableRow from "./components/UsersTableRow";
import { useUsersStore } from "@/shared/store/useUsersStore";
import { apiHandleError } from "@/shared/helpers/apiHandleError";
import { getAllUsers } from "@/shared/api/admin/usersApi";
import { IMeta } from "@/shared/types/common";
import { headerTitles } from "./components/header";
import UserCreateNewFabMenu from "./components/UserCreateNewFabMenu";
import UserEditModal from "./modals/UserEditModal";
import UserDeleteModal from "./modals/UserDeleteModal";
import UserCreateModal from "./modals/UserCreateModal";

const UsersTable = () => {
  const { meta, setState, sortQuery, loadingTable, users, filterQuery } =
    useUsersStore();

  const handleChangePage = async (event: unknown, newPage: number) => {
    await fetchUsers({
      ...meta,
      page: newPage + 1,
    });
  };

  const handleChangeRowsPerPage = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    await fetchUsers({
      count: parseInt(event.target.value, 10),
      page: 1,
    });
  };

  const fetchUsers = useCallback(
    async (meta: IMeta) => {
      setState({ loadingTable: true });
      try {
        const response = await getAllUsers({
          count: meta.count || 10,
          page: meta.page || 1,
          sort_field: sortQuery.name,
          sort_type: sortQuery.type,
        });

        setState({
          users: response.result.users,
          meta: response.result.meta,
          loadingTable: false,
        });
      } catch (error) {
        setState({
          users: [],
          meta: { page: 1, count: 10, total: 0 },
          loadingTable: false,
        });

        apiHandleError(error);
      }
    },
    [sortQuery, setState]
  );

  useEffect(() => {
    fetchUsers(meta);
  }, [fetchUsers]);

  return (
    <>
      <UserCreateNewFabMenu />
      <UserCreateModal />
      <UserDeleteModal />
      <UserEditModal />

      <TablePagination
        component="div"
        count={meta?.total ?? 0}
        page={meta.page - 1}
        onPageChange={handleChangePage}
        rowsPerPage={meta?.count || 10}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      <CTable
        headerTitles={headerTitles}
        sortQuery={sortQuery}
        loadingTable={loadingTable}
        styles={{
          height: "800px",
        }}
        setSortQuery={(value) =>
          setState({
            sortQuery: value,
          })
        }
      >
        {users?.length ? (
          users.map((user, index) => (
            <UsersTableRow key={user._id} item={user} index={index} />
          ))
        ) : (
          <tr>
            <td colSpan={headerTitles.length}>
              <NoDataPlaceholder
                filterQuery={filterQuery}
                clearFilters={() => setState({ filterQuery: {} })}
                removeFilter={(key) =>
                  setState({
                    filterQuery: {
                      ...filterQuery,
                      [key]: undefined,
                    },
                  })
                }
              />
            </td>
          </tr>
        )}
      </CTable>
    </>
  );
};

export default UsersTable;
