import { Schema, model, Types } from "mongoose";

export type TeamRole = "team_lead" | "developer" | "designer" | "viewer";

export type TeamMemberStatus = "active" | "invited" | "removed";

export interface ITeamMember {
  teamId: Types.ObjectId;
  userId: Types.ObjectId;
  role: TeamRole;
  status: TeamMemberStatus;
  joinedAt?: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
}

const teamMemberSchema = new Schema<ITeamMember>(
  {
    teamId: {
      type: Schema.Types.ObjectId,
      ref: "Team",
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    role: {
      type: String,
      enum: ["team_lead", "developer", "designer", "viewer"],
      default: "developer",
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "invited", "removed"],
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

teamMemberSchema.index({ teamId: 1, userId: 1 }, { unique: true });

teamMemberSchema.index({ userId: 1, status: 1 });

export const TeamMember = model<ITeamMember>("TeamMember", teamMemberSchema);
