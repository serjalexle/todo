import AuthGuard from "@/shared/guards/AuthGuard";
import TasksTable from "@/widgets/tasks/TasksTable";
import React from "react";

const TaskPage = () => {
  return <AuthGuard>
    <TasksTable />
  </AuthGuard>;
};

export default TaskPage;
