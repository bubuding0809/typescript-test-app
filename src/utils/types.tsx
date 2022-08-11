import { Moment } from "moment";

export type Todo = {
  readonly id: string;
  readonly message: string;
  readonly isChecked: boolean;
  readonly isDragged: boolean;
  readonly date: string | null;
  readonly time: string | null;
  readonly description: string | null;
  readonly subTasks: Todo[];
};

export type Entry = {
  readonly todoMessage: string;
  readonly todoDateTime: Moment | null;
  readonly todoDescription: string;
};
