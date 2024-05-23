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
    // Add field "name" values the value of text of first message
    {
      $unwind: "$messages",
    },
    {
      $unwind: "$messages.messages",
    },

    { $addFields: { name: "$messages.messages.parts.text" } },
    { $group: { _id: "$_id", name: { $first: "$name" } } },

    { $project: { name: 1, id: "$_id" } },
    { $sort: { _id: -1 } },
    { $limit: 100 },
  ]);

  console.log(chats);

  return c.json(chats);
};

export const getMessages = async (c: Context) => {
  const chat = c.req.query("chat");
  if (!chat) return c.json({ error: "Chat is not provided" });

  const messages = await Message.findOne({ chatId: chat }).sort({ _id: -1 });

  return c.json(messages);
};
