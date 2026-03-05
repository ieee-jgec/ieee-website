import mongoose, { models, Schema } from "mongoose";

const noticeSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    isPinned: {
      type: Boolean,
      default: false,
    },
    pdfUrl: {
      type: String,
    },
    pdfTitle: {
      type: String,
    },
  },
  { timestamps: true },
);

if (process.env.NODE_ENV === "development" && models.Notice) {
  delete models.Notice;
}

export const Notice = models.Notice || mongoose.model("Notice", noticeSchema);
