import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    avatar: { type: String, required: false },
    role: { type: String, required: true },
    tgid: { type: String, required: false },
  },
  { timestamps: true }
);

export type Message = mongoose.InferSchemaType<typeof MessageSchema>;

export default mongoose.model<Message>("Message", MessageSchema);
