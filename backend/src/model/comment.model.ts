import { Schema, model, Types } from "mongoose";

export interface IComment {
  taskId: Types.ObjectId;
  userId: Types.ObjectId;
  text: string;
  parentId?: Types.ObjectId | null;
  createdAt?: Date;
  updatedAt?: Date;
}

const commentSchema = new Schema<IComment>(
  {
    taskId: {
      type: Schema.Types.ObjectId,
      ref: "Task",
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 5000,
    },
    parentId: {
      type: Schema.Types.ObjectId,
      ref: "Comment",
      default: null,
    },
  },
  { timestamps: true },
);

commentSchema.index({ taskId: 1, createdAt: 1 });
commentSchema.index({ parentId: 1, createdAt: 1 });

export const Comment = model<IComment>("Comment", commentSchema);
