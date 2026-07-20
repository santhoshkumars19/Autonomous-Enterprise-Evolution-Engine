"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const zod_1 = require("zod");
const db_1 = require("../config/db");
const auth_1 = require("../middleware/auth");
const env_1 = require("../config/env");
const router = (0, express_1.Router)();
router.use(auth_1.authenticate);
const chatSchema = zod_1.z.object({
    message: zod_1.z.string().min(1).max(4000),
    session_id: zod_1.z.string().optional(),
    provider: zod_1.z.enum(["openai", "gemini"]).default("openai"),
});
const industryEngine_1 = require("../services/industryEngine");
// POST /api/chat — Send message to AI microservice
router.post("/", async (req, res) => {
    try {
        const body = chatSchema.parse(req.body);
        const ctx = await (0, industryEngine_1.getCompanyContext)(req.user.id);
        const industryPrompt = (0, industryEngine_1.getIndustrySystemPrompt)(ctx);
        // Save user message to chat history
        const sessionId = body.session_id ?? crypto.randomUUID();
        await (0, db_1.query)(`INSERT INTO chat_sessions (id, user_id, role, content, provider)
       VALUES ($1, $2, 'user', $3, $4)
       ON CONFLICT DO NOTHING`, [sessionId, req.user.id, body.message, body.provider]);
        // Proxy to Python AI microservice
        const aiResponse = await fetch(`${env_1.env.AI_SERVICE_URL}/ai/chat`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                message: body.message,
                session_id: sessionId,
                provider: body.provider,
                user_id: req.user.id,
                system_prompt: industryPrompt,
            }),
        });
        if (!aiResponse.ok) {
            const errText = await aiResponse.text();
            console.error("AI service error:", errText);
            res.status(502).json({ success: false, message: "AI service unavailable" });
            return;
        }
        const aiData = await aiResponse.json();
        // Save AI response to chat history
        await (0, db_1.query)(`INSERT INTO chat_sessions (id, user_id, role, content, provider)
       VALUES ($1, $2, 'assistant', $3, $4)`, [crypto.randomUUID(), req.user.id, aiData.response, body.provider]);
        res.json({
            success: true,
            session_id: sessionId,
            response: aiData.response,
            provider: body.provider,
        });
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            res.status(400).json({ success: false, errors: error.flatten().fieldErrors });
            return;
        }
        console.error("Chat error:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});
// GET /api/chat/history — Get chat history for current user
router.get("/history", async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 50;
        const messages = await (0, db_1.query)(`SELECT id, role, content, provider, created_at
       FROM chat_sessions WHERE user_id = $1
       ORDER BY created_at DESC LIMIT $2`, [req.user.id, limit]);
        res.json({ success: true, messages: messages.reverse() });
    }
    catch (error) {
        console.error("Chat history error:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});
exports.default = router;
//# sourceMappingURL=chat.js.map