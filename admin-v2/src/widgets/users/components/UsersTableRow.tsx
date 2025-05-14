import DateShower from "@/shared/components/UI/DateShower/DateShower";
import IDKey from "@/shared/components/UI/IDKey/IDKey";
import { IUser } from "@/shared/types/user";
import { Delete, Person } from "@mui/icons-material";
import {
  Box,
  Button,
  IconButton,
  TableCell,
  TableRow,
  Tooltip,
} from "@mui/material";
import { grey } from "@mui/material/colors";
import { useRouter } from "next/navigation";
import React from "react";

interface IProps {
  item: IUser;
  index: number;
}
const IS_DELETE_ACCESS = true;

const UsersTableRow = ({ item, index }: IProps) => {
  const router = useRouter();

  const handleDelete = () => {
    //   toggleModal("delete", item);
  };

  const handleRedirectToUserProfile = () => {
    router.push(`/admin/users/${item._id}`);
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
        <DateShower date={new Date(item?.created_at).getTime()} />
      </TableCell>

      <TableCell component="th" scope="row">
        <DateShower date={new Date(item?.updated_at).getTime()} />
      </TableCell>
      <TableCell component="th" scope="row">
        <Button
          endIcon={<Person />}
          color="primary"
          variant="contained"
          size="small"
          onClick={handleRedirectToUserProfile}
        >
          Profile
        </Button>
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
          {/* // TODO: add admins editing */}
          {/* <Tooltip
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
          </Tooltip> */}

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

export default UsersTableRow;
