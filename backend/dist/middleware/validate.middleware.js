"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const validate = (schema) => {
    return (req, res, next) => {
        console.log("REQ BODY:", req.body); // 👈 add this
        try {
            req.body = schema.parse(req.body);
            next();
        }
        catch (err) {
            console.log("VALIDATION ERROR:", JSON.stringify(err, null, 2));
            console.log("ERR ISSUES:", err?.issues);
            console.log("ERR MESSAGE:", err?.message);
            return res.status(400).json({ message: "Validation error" });
        }
    };
};
exports.validate = validate;
