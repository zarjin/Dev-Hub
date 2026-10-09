import { Schema, model, Types } from "mongoose";

export type OrganizationRole = "owner" | "admin" | "member";
export type OrganizationMemberStatus = "active" | "invited" | "suspended";

export interface IOrganizationMember {
  organizationId: Types.ObjectId;
  userId: Types.ObjectId;
  role: OrganizationRole;
  status: OrganizationMemberStatus;
  joinedAt?: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
}

const organizationMemberSchema = new Schema<IOrganizationMember>(
  {
    organizationId: {
      type: Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    role: {
      type: String,
      enum: ["owner", "admin", "member"],
      default: "member",
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "invited", "suspended"],
      default: "invited",
      required: true,
    },
    joinedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true },
);

organizationMemberSchema.index(
  { organizationId: 1, userId: 1 },
  { unique: true },
);

organizationMemberSchema.index({ userId: 1, status: 1 });

export const OrganizationMember = model<IOrganizationMember>(
  "OrganizationMember",
  organizationMemberSchema,
);
