import { Schema, model, Types } from "mongoose";

export type TaskStatus =
  "todo" | "in_progress" | "pending_review" | "changes_requested" | "completed";

export type TaskPriority = "low" | "medium" | "high" | "urgent";

export interface ITask {
  organizationId: Types.ObjectId;
  teamId: Types.ObjectId;
  title: string;
  description?: string;
  assignedTo?: Types.ObjectId | null;
  createdBy: Types.ObjectId;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: Date | null;
  completedAt?: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
}

const taskSchema = new Schema<ITask>(
  {
    organizationId: {
      type: Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
    },
    teamId: {
      type: Schema.Types.ObjectId,
      ref: "Team",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 10000,
    },
    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: [
        "todo",
        "in_progress",
        "pending_review",
        "changes_requested",
        "completed",
      ],
      default: "todo",
      required: true,
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high", "urgent"],
      default: "medium",
      required: true,
    },
    dueDate: {
      type: Date,
      default: null,
    },
    completedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true },
);

taskSchema.index({ teamId: 1, status: 1, createdAt: -1 });
taskSchema.index({ assignedTo: 1, status: 1 });
taskSchema.index({ organizationId: 1, createdAt: -1 });

export const Task = model<ITask>("Task", taskSchema);
