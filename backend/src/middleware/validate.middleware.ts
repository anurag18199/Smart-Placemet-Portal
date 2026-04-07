import { Request, Response, NextFunction } from "express";
import { ZodType } from "zod";


export const validate = (schema: ZodType) => {
  return (req: Request, res: Response, next: NextFunction) => {
    console.log("REQ BODY:", req.body); // 👈 add this
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (err: any) {
      console.log("VALIDATION ERROR:", JSON.stringify(err, null, 2));
      console.log("ERR ISSUES:", err?.issues);
      console.log("ERR MESSAGE:", err?.message);
      return res.status(400).json({ message: "Validation error" });
    }
  };
};