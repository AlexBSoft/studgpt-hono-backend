import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
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

export type User = mongoose.InferSchemaType<typeof UserSchema>;
export const User = mongoose.model<User>("User", UserSchema);
