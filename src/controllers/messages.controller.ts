import { Context } from "hono";
import Message from "../models/message.model";

export const getChats = async (c: Context) => {
  const user = c.req.query("user");
  if (!user) return c.json({ error: "User is not provided" });
  // Get latest message (by _id) in messages model grouped by chat field
  const chats = await Message.aggregate([
    { $match: { user: user } },
    { $group: { _id: "$chatId", messages: { $push: "$$ROOT" } } },
    { $sort: { _id: -1 } },
  ]);

  console.log(chats);

  return c.json(chats);
};

export const getMessages = async (c: Context) => {
  const chat = c.req.query("chat");
  if (!chat) return c.json({ error: "Chat is not provided" });

  const messages = await Message.find({ chatId: chat });

  return c.json(messages);
};
