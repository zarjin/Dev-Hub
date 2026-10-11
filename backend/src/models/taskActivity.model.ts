import { Schema, model, Types } from "mongoose";
import type { TaskStatus } from "./task.model.ts";

export type TaskActivityAction =
  | "created"
  | "assigned"
  | "status_changed"
  | "commented"
  | "updated"
  | "reviewed";

export interface ITaskActivity {
  taskId: Types.ObjectId;
  teamId: Types.ObjectId;
  actorId: Types.ObjectId;
  action: TaskActivityAction;
  fromStatus?: TaskStatus | null;
  toStatus?: TaskStatus | null;
  message?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const taskActivitySchema = new Schema<ITaskActivity>(
  {
    taskId: {
      type: Schema.Types.ObjectId,
      ref: "Task",
      required: true,
    },
    teamId: {
      type: Schema.Types.ObjectId,
      ref: "Team",
      required: true,
    },
    actorId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    action: {
      type: String,
      enum: [
        "created",
        "assigned",
        "status_changed",
        "commented",
        "updated",
        "reviewed",
      ],
      required: true,
    },
    fromStatus: {
      type: String,
      enum: [
        "todo",
        "in_progress",
        "pending_review",
        "changes_requested",
        "completed",
      ],
      default: null,
    },
    toStatus: {
      type: String,
      enum: [
        "todo",
        "in_progress",
        "pending_review",
        "changes_requested",
        "completed",
      ],
      default: null,
    },
    message: {
      type: String,
      trim: true,
      maxlength: 2000,
    },
  },
  { timestamps: true },
);

taskActivitySchema.index({ taskId: 1, createdAt: -1 });
taskActivitySchema.index({ teamId: 1, createdAt: -1 });

export const TaskActivity = model<ITaskActivity>(
  "TaskActivity",
  taskActivitySchema,
);
