import mongoose from "mongoose";

const ragDocumentSchema = new mongoose.Schema(
  {
    fileName: {
      type: String,
      required: false,
    },
    text: {
      type: String,
      required: false,
    },
    contentUrl: {
      type: String,
      required: false,
    },
    embeddings: {
      type: [Number],
      required: false,
    },
    fileType: {
      type: String,
      required: true,
    },
    user: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

export type RagDocument = mongoose.InferSchemaType<typeof ragDocumentSchema>;

export default mongoose.model<RagDocument>("RagDocument", ragDocumentSchema);
