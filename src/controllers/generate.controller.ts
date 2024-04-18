import { Context } from "hono";
import axios from "axios";
import fetch from "node-fetch";
import { HttpsProxyAgent } from "https-proxy-agent";

const proxyAgent = process.env.PROXY_URL
  ? new HttpsProxyAgent(process.env.PROXY_URL)
  : null;

export const generate = async (c: Context) => {
  const data = await c.req.json();

  console.log(data);

  // Run ollama generation
  if (data.model == "ollama-wizardlm2") {
    try {
      const res = await axios.post("http://127.0.0.1:11434/api/chat", {
        model: "wizardlm2",
        messages: data.messages,
        stream: false,
      });

      // TODO: put message in DB

      return c.json(res.data);
    } catch (error: any) {
      console.log(`Data from Axios: ${JSON.stringify(error.response.data)}`);

      return c.json({ error: "Error" });
    }
  }

  // Run gemini generation
  if (data.model == "gemini") {
    try {
      // https://github.com/AlexBSoft/studgpt-gemini/blob/main/app/api/chat/route.tsx
    } catch (error: any) {
      console.log(`Data from Axios: ${JSON.stringify(error.response.data)}`);
      return c.json({ error: "Error" });
    }
  }

  return c.json({ x: "xx" });
};
