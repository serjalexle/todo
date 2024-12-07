import { Close, Save } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { Box, Button, SwipeableDrawer, Typography } from "@mui/material";
import { useState } from "react";
import useTaskStore from "store/taskStore";

const TaskDetailsModal = () => {
  const { taskDetailsModal, setTaskDetailsModal } = useTaskStore();
  const { isOpen, task } = taskDetailsModal;

  const [isSaving, setIsSaving] = useState(false);

  const handleClose = () => {
    setTaskDetailsModal(null);
  };

  const handleOpen = () => {
    setTaskDetailsModal(task);
  };

  const handleSave = async () => {
    // Save
    setIsSaving(true);
    // await saveTask(task);
    // Close
    setIsSaving(false);
    handleClose();
  };

  return (
    <SwipeableDrawer
      anchor="bottom"
      open={isOpen}
      onClose={handleClose}
      onOpen={handleOpen}
      sx={{
        "& .MuiDrawer-paper": {
          height: "90%",
          px: 1,
          overflowY: "scroll",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Button
          variant="text"
          color="error"
          endIcon={<Close fontSize="small" />}
          onClick={handleClose}
        >
          Закрити
        </Button>
        <LoadingButton
          variant="text"
          loading={isSaving}
          endIcon={<Save fontSize="small" />}
          onClick={handleSave}
        >
          Зберегти
        </LoadingButton>
      </Box>
      <Typography
        variant="h5"
        sx={{
          fontWeight: "bold",
        }}
      >
        {task?.title}
      </Typography>
      <Typography variant="body2" sx={{ mt: 1 }}>
        {task?.description}
      </Typography>
    </SwipeableDrawer>
  );
};

export default TaskDetailsModal;
