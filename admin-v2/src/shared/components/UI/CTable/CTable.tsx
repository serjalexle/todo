import { ISortQuery, ITabelHeader } from "@/shared/types/common";
import {
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Table,
  Tooltip,
  IconButton,
  useTheme,
  Typography,
  Box,
  Zoom,
  CircularProgress,
} from "@mui/material";
import { CSSProperties, ReactNode } from "react";

interface IProps {
  children: ReactNode | ReactNode[];
  headerTitles: ITabelHeader[];
  sortQuery?: ISortQuery;
  setSortQuery?: (value: { type: "asc" | "desc"; name: string }) => void;
  dangerMode?: boolean;
  loadingTable?: boolean;
  styles?: CSSProperties;
}

const CTable = ({
  children,
  headerTitles,
  sortQuery,
  setSortQuery,
  dangerMode = false,
  loadingTable = false,
  styles,
}: IProps) => {
  const theme = useTheme();

  const sortIconChanger = (name: string, type: string): string => {
    if (sortQuery?.name === name && sortQuery?.type === type) {
      return theme.palette.primary.main;
    } else {
      return "gray";
    }
  };

  const handleSort = async (title: string) => {
    if (!title) return;

    const { name, type } = sortQuery || {};

    if (name && type && setSortQuery) {
      sortIconChanger(name, type);

      if (name === title && type === "asc") {
        setSortQuery({
          name: title,
          type: "desc",
        });
      } else {
        setSortQuery({
          name: title,
          type: "asc",
        });
      }
    }
  };

  return (
    <TableContainer
      sx={{
        maxHeight: 850,
        position: "relative",
        height: "100%",
        ...styles,
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          height: "100%",
          width: "100%",
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          visibility: loadingTable ? "visible" : "hidden",
          opacity: loadingTable ? 1 : 0,
          transition: "all 0.3s ease-in-out",
          zIndex: 1000,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
        }}
      >
        <CircularProgress />
        <Typography variant="h4" color="primary" fontWeight={200}>
          LOADING ...
        </Typography>
      </Box>
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            {headerTitles.map((header: ITabelHeader) => {
              const { title, name } = header;
              return (
                <TableCell
                  key={title}
                  sx={{
                    color: "#fff",
                    backgroundColor: dangerMode ? "red" : "#2B2730",
                    py: 0.7,
                  }}
                >
                  <Tooltip
                    title={name ? `Sort by "${title}"` : ""}
                    placement="top"
                    arrow
                    slots={{
                      transition: Zoom,
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        cursor: name ? "pointer" : "default",
                        "&:hover": {
                          color: name ? theme.palette.primary.main : "",
                        },
                      }}
                      onClick={() => handleSort(name)}
                    >
                      <Typography
                        variant="body2"
                        sx={{
                          transition: ".3s",
                        }}
                      >
                        {title}
                      </Typography>
                      {name && (
                        <IconButton
                          size="small"
                          sx={{ ml: 0.5, width: "24px", height: "24px" }}
                        >
                          <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M7.43284 8.01186L11.1033 4.41502C11.2445 4.27668 11.3974 4.17293 11.5621 4.10376C11.7268 4.03459 11.9033 4 12.0915 4C12.2798 4 12.4562 4.03459 12.6209 4.10376C12.7856 4.17293 12.9386 4.27668 13.0797 4.41502L16.7502 8.01186C17.1973 8.44993 17.297 8.95165 17.0495 9.51699C16.802 10.0823 16.3611 10.3646 15.7267 10.3636L8.45634 10.3636C7.82106 10.3636 7.37966 10.081 7.13214 9.51561C6.88462 8.95026 6.98485 8.44901 7.43284 8.01186Z"
                              fill={
                                sortQuery?.name === name &&
                                sortQuery?.type === "asc"
                                  ? theme.palette.primary.main
                                  : "gray"
                              }
                            />
                            <path
                              d="M16.749 16.7154L13.0785 20.3122C12.9373 20.4506 12.7844 20.5543 12.6197 20.6235C12.455 20.6927 12.2785 20.7273 12.0903 20.7273C11.9021 20.7273 11.7256 20.6927 11.5609 20.6235C11.3962 20.5543 11.2433 20.4506 11.1021 20.3122L7.4316 16.7154C6.98455 16.2773 6.88479 15.7756 7.13231 15.2103C7.37984 14.6449 7.82077 14.3627 8.4551 14.3636L15.7255 14.3636C16.3608 14.3636 16.8022 14.6463 17.0497 15.2117C17.2972 15.777 17.197 16.2783 16.749 16.7154Z"
                              fill={
                                sortQuery?.name === name &&
                                sortQuery?.type === "desc"
                                  ? theme.palette.primary.main
                                  : "gray"
                              }
                            />
                          </svg>
                        </IconButton>
                      )}
                    </Box>
                  </Tooltip>
                </TableCell>
              );
            })}
          </TableRow>
        </TableHead>
        <TableBody>{children}</TableBody>
      </Table>
    </TableContainer>
  );
};

export default CTable;
