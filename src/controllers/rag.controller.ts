import { Context } from "hono";
import RagDocument from "../models/ragDocument.model";

import fs from "node:fs/promises";

import {
  Document,
  MetadataMode,
  NodeWithScore,
  VectorStoreIndex,
  Settings,
  HuggingFaceEmbedding,
} from "llamaindex";

Settings.embedModel = new HuggingFaceEmbedding({
  modelType: "BAAI/bge-small-en-v1.5",
  quantized: false,
});

export const getDocuments = async (c: Context) => {
  const user = c.req.query("user");
  if (!user) return c.json({ error: "User is not provided" });

  const documents = await RagDocument.find({ user: user }).sort({ _id: -1 });

  return c.json(documents);
};

export const getDocument = async (c: Context) => {
  const id = c.req.query("id");
  if (!id) return c.json({ error: "id is not provided" });

  const document = await RagDocument.findById(id);

  return c.json(document);
};

export const deleteDocument = async (c: Context) => {
  const id = c.req.query("id");
  if (!id) return c.json({ error: "id is not provided" });

  const document = await RagDocument.findByIdAndDelete(id);

  if (!document) return c.json({ error: "Document not found" });
  return c.json({ ok: true });
};

export const uploadDocument = async (c: Context) => {
  const data = await c.req.json();

  if (!data.user) return c.json({ error: "User is not provided" });

  try {
    // Convert document to embeddings

    //const path = "node_modules/llamaindex/examples/abramov.txt";

    //const essay = await fs.readFile(path, "utf-8");

    // Create Document object with essay
    //const document = new Document({ text: essay, id_: path });

    // Split text and create embeddings. Store them in a VectorStoreIndex
    //const index = await VectorStoreIndex.fromDocuments([document]);

    // Todo: save embeddings to db

    //console.log(index);

    const ragDocument = new RagDocument({
      fileName: data.fileName,
      user: data.user,
      text: data.text,
      fileType: "text",
    });

    await ragDocument.save();

    return c.json(ragDocument);
  } catch (error: any) {
    return c.json({ error: error.message });
  }
};
