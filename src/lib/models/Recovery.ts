import mongoose, { Schema, Document, Model } from "mongoose";

export interface IRecovery extends Document {
  name: string;
  role: string;
  username: string;
  platform: string;
  followers: string;
  verified: boolean;
  avatar: string;
  recoveryType: string;
  recoveryDate: string;
  popupId?: string;
  enabled: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const RecoverySchema = new Schema<IRecovery>(
  {
    name: { type: String, required: true },
    role: { type: String, default: "" },
    username: { type: String, required: true },
    platform: { type: String, required: true },
    followers: { type: String, default: "" },
    verified: { type: Boolean, default: true },
    avatar: { type: String, default: "" },
    recoveryType: { type: String, default: "" },
    recoveryDate: { type: String, default: "" },
    popupId: { type: String },
    enabled: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true },
);

let RecoveryModel: Model<IRecovery>;

try {
  RecoveryModel = mongoose.model<IRecovery>("Recovery");
} catch {
  RecoveryModel = mongoose.model<IRecovery>("Recovery", RecoverySchema);
}

export { RecoveryModel };
