"use client";
import { Box } from "@mui/material";
import TaskDetailsModal from "components/tasks/modals/TaskDetailsModal";
import TaskAccordion from "components/tasks/TaskAccordion/TaskAccordion";
import { BOTTOM_NAVIGATION_HEIGHT } from "constants/components";
import React from "react";

const groups = [12, 2, 32, 5, 3, 23, 2, 32, 4, 2, 43, 5, 3, 52, 4, 2, 4];

const TasksPage = () => {
  return (
    <Box
      sx={{
        p: 1,
        maxHeight: `calc(100vh - ${BOTTOM_NAVIGATION_HEIGHT})`,
        overflowY: "scroll",
      }}
    >
      <TaskDetailsModal />
      {groups.map((item, i) => {
        return (
          <TaskAccordion
            title={"Today"}
            key={i}
            tasks={[
              {
                _id: "da",
                title: "Купити подарунок на святого миколая",
                description:
                  "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam",
                status: "queue"
              },
              {
                _id: "das",
                title: "Купити подарунок на святого миколая",
                description:
                  "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam",
                status: "progress"
              },
              {
                _id: "daq",
                title: "Купити подарунок на святого миколая",
                description:
                  "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam",
                status: "completed"
              },
            ]}
          />
        );
      })}
    </Box>
  );
};

export default TasksPage;
