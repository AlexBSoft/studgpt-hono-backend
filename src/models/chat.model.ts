import mongoose from "mongoose";

const ChatSchema = new mongoose.Schema(
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

export type Chat = mongoose.InferSchemaType<typeof ChatSchema>;

export default mongoose.model<Chat>("Chat", ChatSchema);
