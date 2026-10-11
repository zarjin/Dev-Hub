import { Schema, model, Types } from "mongoose";

export type NotificationType =
  | "task_assigned"
  | "task_review"
  | "task_completed"
  | "comment"
  | "team_invitation"
  | "organization_invitation"
  | "system";

export interface INotification {
  userId: Types.ObjectId;
  type: NotificationType;
  title: string;
  message: string;
  taskId?: Types.ObjectId | null;
  teamId?: Types.ObjectId | null;
  organizationId?: Types.ObjectId | null;
  isRead: boolean;
  readAt?: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
}

const notificationSchema = new Schema<INotification>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: [
        "task_assigned",
        "task_review",
        "task_completed",
        "comment",
        "team_invitation",
        "organization_invitation",
        "system",
      ],
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
    },
    taskId: {
      type: Schema.Types.ObjectId,
      ref: "Task",
      default: null,
    },
    teamId: {
      type: Schema.Types.ObjectId,
      ref: "Team",
      default: null,
    },
    organizationId: {
      type: Schema.Types.ObjectId,
      ref: "Organization",
      default: null,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    readAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true },
);

notificationSchema.index({ userId: 1, isRead: 1, createdAt: -1 });

export const Notification = model<INotification>(
  "Notification",
  notificationSchema,
);
