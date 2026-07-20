import { Router, Response } from "express";
import { z } from "zod";
import { query } from "../config/db";
import { authenticate, AuthRequest } from "../middleware/auth";
import { env } from "../config/env";

const router = Router();
router.use(authenticate);

const chatSchema = z.object({
  message: z.string().min(1).max(4000),
  session_id: z.string().optional(),
  provider: z.enum(["openai", "gemini"]).default("openai"),
});

import { getCompanyContext, getIndustrySystemPrompt } from "../services/industryEngine";

// POST /api/chat — Send message to AI microservice
router.post("/", async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const body = chatSchema.parse(req.body);
    const ctx = await getCompanyContext(req.user!.id);
    const industryPrompt = getIndustrySystemPrompt(ctx);

    // Save user message to chat history
    const sessionId = body.session_id ?? crypto.randomUUID();
    await query(
      `INSERT INTO chat_sessions (id, user_id, role, content, provider)
       VALUES ($1, $2, 'user', $3, $4)
       ON CONFLICT DO NOTHING`,
      [sessionId, req.user!.id, body.message, body.provider]
    );

    // Proxy to Python AI microservice
    const aiResponse = await fetch(`${env.AI_SERVICE_URL}/ai/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: body.message,
        session_id: sessionId,
        provider: body.provider,
        user_id: req.user!.id,
        system_prompt: industryPrompt,
      }),
    });

    if (!aiResponse.ok) {
      const errText = await aiResponse.text();
      console.error("AI service error:", errText);
      res.status(502).json({ success: false, message: "AI service unavailable" });
      return;
    }

    const aiData = await aiResponse.json() as { response: string };

    // Save AI response to chat history
    await query(
      `INSERT INTO chat_sessions (id, user_id, role, content, provider)
       VALUES ($1, $2, 'assistant', $3, $4)`,
      [crypto.randomUUID(), req.user!.id, aiData.response, body.provider]
    );

    res.json({
      success: true,
      session_id: sessionId,
      response: aiData.response,
      provider: body.provider,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ success: false, errors: error.flatten().fieldErrors });
      return;
    }
    console.error("Chat error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// GET /api/chat/history — Get chat history for current user
router.get("/history", async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const limit = parseInt(req.query.limit as string) || 50;
    const messages = await query(
      `SELECT id, role, content, provider, created_at
       FROM chat_sessions WHERE user_id = $1
       ORDER BY created_at DESC LIMIT $2`,
      [req.user!.id, limit]
    );
    res.json({ success: true, messages: messages.reverse() });
  } catch (error) {
    console.error("Chat history error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

export default router;
