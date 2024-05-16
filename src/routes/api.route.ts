import { Hono } from "hono";
import { generate, messages } from "../controllers";
import { OpenAPIHono, createRoute, z } from "@hono/zod-openapi";
//import { isAdmin, protect } from "../middlewares";

const apis = new OpenAPIHono();

const generateRoute = createRoute({
  method: "post",
  path: "/generate",
  summary: "Generate with ai",
  request: {
    body: {
      description: "body",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              model: { schema: z.string().default("gpt-3.5-turbo") },
              messages: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    role: { type: "string" },
                    content: { type: "string" },
                  },
                },
              },
              user: { type: "string" },
              stream: { type: "boolean", default: false },
            },
          },
        },
      },
    },
  },
  responses: {
    200: {
      description: "OK",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              x: { type: "string" },
            },
          },
        },
      },
    },
  },
});

apis.openapi(generateRoute, (c) => generate.generate(c));

apis.get("/chats", (c) => messages.getChats(c));

apis.get("/messages", (c) => messages.getMessages(c));

export default apis;
