import mongoose, { Schema, Document, Model } from "mongoose";

export interface IFaq extends Document {
  id: string;
  q: string;
  a: string;
  enabled: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const FaqSchema = new Schema<IFaq>(
  {
    id: { type: String, required: true, unique: true },
    q: { type: String, required: true },
    a: { type: String, required: true },
    enabled: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true },
);

let FaqModel: Model<IFaq>;

try {
  FaqModel = mongoose.model<IFaq>("Faq");
} catch {
  FaqModel = mongoose.model<IFaq>("Faq", FaqSchema);
}

export { FaqModel };
