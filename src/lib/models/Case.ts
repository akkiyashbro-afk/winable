import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICase extends Document {
  caseId: string;
  fullName: string;
  email: string;
  platform: string;
  otherPlatform?: string;
  caseType: string;
  username?: string;
  followers?: string;
  alreadySubmittedAppeal?: string;
  canStillLogin?: string;
  description: string;
  attachmentNames: string[];
  status: "new" | "in_progress" | "resolved" | "closed";
  submittedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const CaseSchema = new Schema<ICase>(
  {
    caseId: { type: String, required: true, unique: true, index: true },
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    platform: { type: String, required: true },
    otherPlatform: { type: String },
    caseType: { type: String, required: true },
    username: { type: String },
    followers: { type: String },
    alreadySubmittedAppeal: { type: String },
    canStillLogin: { type: String },
    description: { type: String, required: true },
    attachmentNames: { type: [String], default: [] },
    status: {
      type: String,
      enum: ["new", "in_progress", "resolved", "closed"],
      default: "new",
    },
    submittedAt: { type: Date, required: true },
  },
  { timestamps: true },
);

let CaseModel: Model<ICase>;

try {
  CaseModel = mongoose.model<ICase>("Case");
} catch {
  CaseModel = mongoose.model<ICase>("Case", CaseSchema);
}

export { CaseModel };
