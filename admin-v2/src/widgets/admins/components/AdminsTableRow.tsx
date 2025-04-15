// ? interfaces

// ? MUI
import {
  Box,
  IconButton,
  TableCell,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";

import { Delete, Edit } from "@mui/icons-material";

import { grey } from "@mui/material/colors";
import { useAdminsStore } from "@/shared/store/useAdminsStore";
import { IAdmin } from "@/shared/types/admin";
import IDKey from "@/shared/components/UI/IDKey/IDKey";
import DateShower from "@/shared/components/UI/DateShower/DateShower";

interface IProps {
  item: IAdmin;
  index: number;
}

const IS_EDIT_ACCESS = true;
const IS_DELETE_ACCESS = true;

const AdminTableRow = ({ item, index }: IProps) => {
  const { toggleModal } = useAdminsStore();

  const handleEdit = () => {
    toggleModal("edit", item);
  };

  const handleDelete = () => {
    toggleModal("delete", item);
  };

  return (
    <TableRow
      sx={{
        transition: ".3s",
        backgroundColor: index % 2 === 0 ? grey[900] : "",
        "&:hover": {
          backgroundColor: grey[800],
        },
        "& > .MuiTableCell-root": {
          borderBottom: 0,
        },
      }}
    >
      <TableCell component="th" scope="row">
        {item?._id && <IDKey ID={item._id} />}
      </TableCell>
      <TableCell component="th" scope="row">
        <IDKey ID={item.email} label="Email" />
      </TableCell>
      <TableCell component="th" scope="row">
        <Typography
          variant="body2"
          color={!item?.role?.name ? "error" : "inherit"}
        >
          {item?.role?.name || "No role"}
        </Typography>
      </TableCell>

      <TableCell component="th" scope="row">
        <Typography variant="body2">
          {item?.created_by?.email ?? "Створено системою"}
        </Typography>
      </TableCell>

      <TableCell component="th" scope="row">
        <DateShower date={new Date(item?.created_at).getTime()} />
      </TableCell>

      <TableCell component="th" scope="row">
        <DateShower date={new Date(item?.updated_at).getTime()} />
      </TableCell>

      <TableCell component="th" scope="row">
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexWrap: "wrap",
            height: "100%",
          }}
        >
          <Tooltip
            title={
              !IS_EDIT_ACCESS ? "You do not have access to this feature" : ""
            }
            arrow
            placement="top"
          >
            <Box>
              <IconButton
                disabled={!IS_EDIT_ACCESS}
                size="small"
                color="warning"
                onClick={handleEdit}
              >
                <Edit />
              </IconButton>
            </Box>
          </Tooltip>

          <Tooltip
            title={
              !IS_DELETE_ACCESS ? "You do not have access to this feature" : ""
            }
            arrow
            placement="top"
          >
            <Box>
              <IconButton
                disabled={!IS_DELETE_ACCESS}
                size="small"
                color="error"
                onClick={handleDelete}
              >
                <Delete />
              </IconButton>
            </Box>
          </Tooltip>
        </Box>
      </TableCell>
    </TableRow>
  );
};

export default AdminTableRow;
