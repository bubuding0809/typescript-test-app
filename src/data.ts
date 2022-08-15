type TodoTask = {
  title: string;
  description: string;
  isChecked: boolean;
  subtasks: string[];
};

type TodoTaskObj = {
  [key: string]: TodoTask;
};

type Panel = {
  [key: string]: {
    title: string;
    active: string[];
    completed: string[];
  };
};

const data = {
  todoTasks: {
    "task-1": {
      title: "Task 1",
      description: "Task 1 description",
      isChecked: false,
      subtasks: ["task-7"],
    },
    "task-2": {
      title: "Task 2",
      description: "Task 2 description",
      isChecked: false,
      subtasks: [],
    },
    "task-3": {
      title: "Task 3",
      description: "Task 3 description",
      isChecked: false,
      subtasks: [],
    },
    "task-4": {
      title: "Task 4",
      description: "Task 4 description",
      isChecked: false,
      subtasks: [],
    },
    "task-5": {
      title: "Task 5",
      description: "Task 5 description",
      isChecked: false,
      subtasks: [],
    },
    "task-6": {
      title: "Task 6",
      description: "Task 6 description",
      isChecked: false,
      subtasks: [],
    },
    "task-7": {
      title: "Task 7",
      description: "Task 7 description",
      isChecked: false,
      subtasks: [],
    },
  } as TodoTaskObj,
  panels: {
    "panel-1": {
      title: "Panel 1",
      active: ["task-1", "task-2", "task-3"],
      completed: ["task-4", "task-5"],
    },
    "panel-2": {
      title: "Panel 2",
      active: ["task-6"],
      completed: [],
    },
  } as Panel,
  panelSequence: ["panel-1", "panel-2"] as string[],
};

export default data;
