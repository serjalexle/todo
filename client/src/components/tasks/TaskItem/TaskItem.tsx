import { Box, Checkbox, Typography } from "@mui/material";
import { ITask } from "interfaces/tasks";
import React from "react";
import useTaskStore from "store/taskStore";

interface IProps {
  item: ITask;
}

const TaskItem = ({ item }: IProps) => {
  const { setTaskDetailsModal } = useTaskStore();

  const handleOpenTaskDetails = () => {
    setTaskDetailsModal(item);
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        my: 1,
      }}
    >
      <Checkbox />
      <Typography
        onClick={handleOpenTaskDetails}
        sx={{
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          width: "100%",
        }}
      >
        {item.title}
      </Typography>
    </Box>
  );
};

export default TaskItem;
