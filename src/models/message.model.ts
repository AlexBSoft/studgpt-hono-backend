import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema(
  {
    user: { type: String, required: false },
    ip: { type: String, required: false },
    chatId: { type: String, required: true },
    model: { type: String, required: true },
    result: { type: Object, required: false },
    ragDocument: { type: String, required: false },
    messages: { type: Array, required: true },
    totalTokens: { type: Number, required: false },
  },
  { timestamps: true }
);

export type Message = mongoose.InferSchemaType<typeof MessageSchema>;

export default mongoose.model<Message>("Message", MessageSchema);
