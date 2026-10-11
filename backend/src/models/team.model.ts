import { Schema, model, Types } from "mongoose";

export interface ITeam {
  organizationId: Types.ObjectId;
  name: string;
  slug: string;
  description?: string;
  createdBy: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

const teamSchema = new Schema<ITeam>(
  {
    organizationId: {
      type: Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    slug: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 1000,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

teamSchema.index({ organizationId: 1, slug: 1 }, { unique: true });

teamSchema.index({ organizationId: 1, createdAt: -1 });

export const Team = model<ITeam>("Team", teamSchema);
