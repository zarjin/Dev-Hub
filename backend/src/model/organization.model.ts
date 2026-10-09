import { Schema, model, Types } from "mongoose";

export interface IOrganization {
  name: string;
  slug: string;
  description?: string;
  logo?: string;
  ownerId: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

const organizationSchema = new Schema<IOrganization>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 1000,
    },
    logo: {
      type: String,
      trim: true,
    },
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
  },
  { timestamps: true },
);

export const Organization = model<IOrganization>(
  "Organization",
  organizationSchema,
);
