import { Context } from "hono";
import axios from "axios";
import fetch from "node-fetch";
import { HttpsProxyAgent } from "https-proxy-agent";
import Message from "../models/message.model";

const proxyAgent = process.env.PROXY_URL
  ? new HttpsProxyAgent(process.env.PROXY_URL)
  : null;

export const generate = async (c: Context) => {
  const data = await c.req.json();

  console.log(data);

  // Run ollama generation
  if (data.model == "ictis-llama") {
    try {
      console.log(data.messages)

      // Convert Gemini format to ollama format
      let messages = data.messages.map((m: {role: string, parts: {text: string}})=> ({
        role: m.role == "model" ? "assistant" : m.role,
        content: m.parts.text
      }))

      // If request has first message - then add system prompt
      if(data.messages.length == 1){
        messages.unshift({
          role: "system",
          content: "Below is an instruction that describes a task. Write a response that appropriately completes the request."
        })
      }

      //const res = await axios.post("http://127.0.0.1:11434/api/chat", {
        //model: "ictis-llama",
      const res = await axios.post(process.env.LOCAL_LLM || "http://localhost:1234/v1/chat/completions", {
        model: "LM Studio Community/ictis",
        messages: messages,
        stream: false,
      });

      console.log("ollama res ",res.data)
      

      let result = {
        message: {
          role: "model",
          parts: {
            //text: res.data.message.content // ollama
            text:  res.data.choices[0].message.content
          },
        }
      };

      // TODO: put message in DB
      const gen = {
        model: data.model,
        chatId: data.chatId,
        messages: data.messages,
        result: result.message,
        user: data.user || null,
        //ip: ,
      };
      const m = new Message(gen);
      await m.save();

      return c.json(result);
    } catch (error: any) {
      console.log(error)
      console.log(`Data from Axios: ${JSON.stringify(error.response ? error.response.data : null)}`);

      return c.json({ error: "Error" });
    }
  }


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

      const content = {
        contents: [...data.messages],
        safetySettings: [
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_NONE",
          },
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_NONE",
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_NONE",
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_NONE",
          },
        ],
      };

      console.log("content", content.contents);

      //const model = data.files.length ? "gemini-pro-vision" : "gemini-pro";
      const model = "gemini-pro";
      const apiKey = process.env.GEMINI_API_KEY;

      let requestConfig: any = {
        method: "post",
        body: JSON.stringify(content),
        headers: {
          "Content-Type": "application/json",
        },
      };

      if (process.env.PROXY_URL) requestConfig.agent = proxyAgent;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
        requestConfig
      );
      const r: any = await response.json();

      console.log(r);

      let result = {
        message: {
          ...r.candidates[0].content,
          parts: r.candidates[0].content.parts[0],
        },
      };

      // TODO: put message in DB
      const gen = {
        model: data.model,
        chatId: data.chatId,
        messages: data.messages,
        result: result.message,
        user: data.user || null,
        //ip: ,
      };
      const m = new Message(gen);
      await m.save();

      return c.json(result);
    } catch (error: any) {
      console.log(error);
      console.log(`Data from Axios: ${JSON.stringify(error.response.data)}`);
      return c.json({ error: "Error" });
    }
  }

  return c.json({ error: "wrong model" });
};
