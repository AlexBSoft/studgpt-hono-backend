import { Context } from "hono";


export const getDocuments = async (c: Context) => {
    const user = c.req.query("user");
    if (!user) return c.json({ error: "User is not provided" });
  
    return c.json({dev: true});
};
  
export const getDocument = async (c: Context) => {
    const user = c.req.query("user");
    if (!user) return c.json({ error: "User is not provided" });
  
    return c.json({dev: true});
};
  
export const deleteDocument = async (c: Context) => {
    const user = c.req.query("user");
    if (!user) return c.json({ error: "User is not provided" });
  
    return c.json({dev: true});
};

export const uploadDocument = async (c: Context) => {
    const user = c.req.query("user");
    if (!user) return c.json({ error: "User is not provided" });
  
    return c.json({dev: true});
};