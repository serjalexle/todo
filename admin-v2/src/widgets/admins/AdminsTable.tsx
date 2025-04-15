"use client";
import { getAllAdmins } from "@/shared/api/admin/adminsApi";
import CTable from "@/shared/components/UI/CTable/CTable";
import { apiHandleError } from "@/shared/helpers/apiHandleError";
import { useAdminsStore } from "@/shared/store/useAdminsStore";
import { TablePagination } from "@mui/material";
import { useEffect } from "react";
import { headerTitles } from "./components/header";
import { IMeta } from "@/shared/types/common";
import AdminTableRow from "./components/AdminsTableRow";
import NoDataPlaceholder from "@/shared/components/UI/NoDataPlaceholder/NoDataPlaceholder";
import AdminCreateNewFabMenu from "./components/AdminCreateNewFabMenu";
import AdminCreateModal from "./modals/AdminCreateModal";

// ? components

const AdminTable = () => {
  const { admins, meta, sortQuery, setState, filterQuery, loadingTable } =
    useAdminsStore();

  const handleChangePage = async (event: unknown, newPage: number) => {
    await fetchAdmins({
      ...meta,
      page: newPage + 1,
    });
  };

  const handleChangeRowsPerPage = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    await fetchAdmins({
      ...meta,
      count: parseInt(event.target.value, 10),
      page: 1,
    });
  };

  const fetchAdmins = async (meta: IMeta) => {
    setState({
      loadingTable: true,
    });
    try {
      const response = await getAllAdmins({
        count: meta.count,
        page: meta.page,
        sort_field: sortQuery.name,
        sort_type: sortQuery.type,
      });

      setState({
        admins: response.result.admins,
        meta: response.result.meta,
        loadingTable: false,
      });
    } catch (error) {
      setState({
        admins: [],
        meta: {
          page: 1,
          count: 10,
          total: 0,
        },
        loadingTable: false,
      });

      apiHandleError(error);
    }
  };

  useEffect(() => {
    fetchAdmins(meta);
  }, []);

  return (
    <>
      <AdminCreateNewFabMenu />
      <AdminCreateModal />
      {/* <EditAdminModal />
      <DeleteAdminModal />
      <ShowSessionsAdminModal /> */}
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
        {admins?.length ? (
          admins.map((admin, index) => (
            <AdminTableRow key={admin._id} item={admin} index={index} />
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

export default AdminTable;
