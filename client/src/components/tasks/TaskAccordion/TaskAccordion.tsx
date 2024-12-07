import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  IconButton,
  Typography,
} from "@mui/material";
import { ITask } from "interfaces/tasks";
import TaskItem from "../TaskItem/TaskItem";
import { useState } from "react";

interface IProps {
  title: string;
  tasks: ITask[];
}
const TaskAccordion = ({ title, tasks }: IProps) => {
  const [isExpanded, setIsExpanded] = useState(false);


  const handleChange = () => {
    setIsExpanded(!isExpanded);
  };
  return (
    <Accordion
      sx={{
        my: "5px",
        transition: ".3s",
        background: isExpanded ? "" : "transparent",
      }}
      expanded={isExpanded}
      onChange={handleChange}
    >
      <AccordionSummary>
        <Box
          sx={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography
            color={isExpanded ? "primary" : "inherit"}
            sx={{
              width: "100%",
            }}
          >
            {title}
          </Typography>
          {!isExpanded && (
            <IconButton
              sx={{
                border: "1px solid",
                borderColor: "info.main",
                height: "30px",
                width: "30px",
              }}
              color="info"
            >
              <Typography variant="body1">{tasks.length}</Typography>
            </IconButton>
          )}
        </Box>
      </AccordionSummary>
      <AccordionDetails>
        {tasks.map((item: ITask) => {
          return <TaskItem item={item} key={item._id} />;
        })}
      </AccordionDetails>
    </Accordion>
  );
};

export default TaskAccordion;
