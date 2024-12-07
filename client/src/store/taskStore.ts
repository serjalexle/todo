import { ITask } from "interfaces/tasks";
import { create } from "zustand";

interface ITaskState {
  taskDetailsModal: {
    isOpen: boolean;
    task: ITask | null;
  };
}
interface ITaskStore extends ITaskState {
  setTaskDetailsModal: (task: ITask | null) => void;
}

const initialState: ITaskState = {
  taskDetailsModal: {
    isOpen: false,
    task: null,
  },
};

const useTaskStore = create<ITaskStore>((set) => ({
  ...initialState,
  setTaskDetailsModal: (task: ITask | null) => {
    set((state) => ({
      taskDetailsModal: {
        ...state.taskDetailsModal,
        isOpen: !!task,
        task,
      },
    }));
  },
}));

export default useTaskStore;
