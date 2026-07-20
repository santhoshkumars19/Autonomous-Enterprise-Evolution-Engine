import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt, { SignOptions } from "jsonwebtoken";
import { z } from "zod";
import { query } from "../config/db";
import { env } from "../config/env";
import { authenticate, AuthRequest } from "../middleware/auth";

const router = Router();

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
  company: z.string().optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

const socialLoginSchema = z.object({
  provider: z.enum(["google", "microsoft"]),
  email: z.string().email(),
  name: z.string().optional(),
});

// POST /api/auth/register
router.post("/register", async (req: Request, res: Response): Promise<void> => {
  try {
    const body = registerSchema.parse(req.body);

    // Check if user exists
    const existing = await query<{ id: string }>(
      "SELECT id FROM users WHERE email = $1",
      [body.email]
    );
    if (existing.length > 0) {
      res.status(409).json({ success: false, message: "Email already registered" });
      return;
    }

    const passwordHash = await bcrypt.hash(body.password, 12);

    const [user] = await query<{ id: string; email: string; name: string; role: string }>(
      `INSERT INTO users (name, email, password_hash, company, role)
       VALUES ($1, $2, $3, $4, 'user')
       RETURNING id, email, name, role`,
      [body.name, body.email, passwordHash, body.company ?? null]
    );

    const signOptions: SignOptions = { expiresIn: env.JWT_EXPIRES_IN as SignOptions["expiresIn"] };
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      env.JWT_SECRET,
      signOptions
    );

    res.status(201).json({
      success: true,
      message: "Account created successfully",
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ success: false, errors: error.flatten().fieldErrors });
      return;
    }
    console.error("Register error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// POST /api/auth/login
router.post("/login", async (req: Request, res: Response): Promise<void> => {
  try {
    const body = loginSchema.parse(req.body);

    const [user] = await query<{
      id: string;
      email: string;
      name: string;
      role: string;
      password_hash: string;
    }>(
      "SELECT id, email, name, role, password_hash FROM users WHERE email = $1",
      [body.email]
    );

    if (!user) {
      res.status(401).json({ success: false, message: "Invalid credentials" });
      return;
    }

    const passwordMatch = await bcrypt.compare(body.password, user.password_hash);
    if (!passwordMatch) {
      res.status(401).json({ success: false, message: "Invalid credentials" });
      return;
    }

    // Update last login
    await query("UPDATE users SET last_login_at = NOW() WHERE id = $1", [user.id]);

    const signOptions: SignOptions = { expiresIn: env.JWT_EXPIRES_IN as SignOptions["expiresIn"] };
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      env.JWT_SECRET,
      signOptions
    );

    res.json({
      success: true,
      message: "Login successful",
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ success: false, errors: error.flatten().fieldErrors });
      return;
    }
    console.error("Login error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// POST /api/auth/admin/login
router.post("/admin/login", async (req: Request, res: Response): Promise<void> => {
  try {
    const body = loginSchema.parse(req.body);

    const [user] = await query<{
      id: string;
      email: string;
      name: string;
      role: string;
      company: string;
      password_hash: string;
    }>(
      "SELECT id, email, name, role, company, password_hash FROM users WHERE LOWER(email) = LOWER($1)",
      [body.email]
    );

    if (!user) {
      res.status(401).json({ success: false, message: "Invalid admin credentials" });
      return;
    }

    if (user.role.toLowerCase() !== "admin") {
      res.status(403).json({ success: false, message: "Access denied. Admin privileges required." });
      return;
    }

    const passwordMatch = await bcrypt.compare(body.password, user.password_hash);
    if (!passwordMatch) {
      res.status(401).json({ success: false, message: "Invalid admin credentials" });
      return;
    }

    // Update last login
    await query("UPDATE users SET last_login_at = NOW() WHERE id = $1", [user.id]);

    const signOptions: SignOptions = { expiresIn: env.JWT_EXPIRES_IN as SignOptions["expiresIn"] };
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      env.JWT_SECRET,
      signOptions
    );

    const refreshToken = jwt.sign(
      { id: user.id, type: "refresh" },
      env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      success: true,
      message: "Admin authentication successful",
      token,
      refreshToken,
      user: { id: user.id, name: user.name, email: user.email, role: user.role, company: user.company },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ success: false, errors: error.flatten().fieldErrors });
      return;
    }
    console.error("Admin login error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// POST /api/auth/social-login
router.post("/social-login", async (req: Request, res: Response): Promise<void> => {
  try {
    const body = socialLoginSchema.parse(req.body);

    let [user] = await query<{
      id: string;
      email: string;
      name: string;
      role: string;
      company: string;
    }>(
      "SELECT id, email, name, role, company FROM users WHERE LOWER(email) = LOWER($1)",
      [body.email]
    );

    if (!user) {
      const defaultName = body.name || body.email.split("@")[0].replace(/[._]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
      const passwordHash = await bcrypt.hash(`SocialOAuth_${Date.now()}_SecretKey!`, 12);

      const [newUser] = await query<{ id: string; email: string; name: string; role: string; company: string }>(
        `INSERT INTO users (name, email, password_hash, company, role)
         VALUES ($1, $2, $3, $4, 'user')
         RETURNING id, email, name, role, company`,
        [defaultName, body.email, passwordHash, `${defaultName}'s Enterprise`]
      );
      user = newUser;
    }

    await query("UPDATE users SET last_login_at = NOW() WHERE id = $1", [user.id]);

    const signOptions: SignOptions = { expiresIn: env.JWT_EXPIRES_IN as SignOptions["expiresIn"] };
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      env.JWT_SECRET,
      signOptions
    );

    res.json({
      success: true,
      message: `Successfully authenticated via ${body.provider === 'google' ? 'Google' : 'Microsoft'}`,
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role, company: user.company },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ success: false, errors: error.flatten().fieldErrors });
      return;
    }
    console.error("Social login error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// GET /api/auth/me
router.get("/me", authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const [user] = await query<{ id: string; name: string; email: string; role: string; company: string; created_at: string }>(
      "SELECT id, name, email, role, company, created_at FROM users WHERE id = $1",
      [req.user!.id]
    );

    if (!user) {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }

    res.json({ success: true, user });
  } catch (error) {
    console.error("Get me error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// POST /api/auth/verify-email
router.post("/verify-email", async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = z.object({ email: z.string().email() }).parse(req.body);

    const [user] = await query<{ id: string; email: string; name: string }>(
      "SELECT id, email, name FROM users WHERE LOWER(email) = LOWER($1)",
      [email]
    );

    if (!user) {
      res.status(404).json({
        success: false,
        message: "No registered account found with this email address.",
      });
      return;
    }

    res.json({
      success: true,
      message: "Email address verified successfully.",
      user: { id: user.id, email: user.email, name: user.name },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ success: false, message: "Invalid email format" });
      return;
    }
    console.error("Verify email error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// POST /api/auth/reset-password
router.post("/reset-password", async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, newPassword } = z
      .object({
        email: z.string().email(),
        newPassword: z.string().min(6, "Password must be at least 6 characters"),
      })
      .parse(req.body);

    const [user] = await query<{ id: string }>(
      "SELECT id FROM users WHERE LOWER(email) = LOWER($1)",
      [email]
    );

    if (!user) {
      res.status(404).json({
        success: false,
        message: "No registered account found with this email address.",
      });
      return;
    }

    const passwordHash = await bcrypt.hash(newPassword, 12);
    await query(
      "UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2",
      [passwordHash, user.id]
    );

    res.json({
      success: true,
      message: "Password reset successfully! You can now sign in with your new password.",
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ success: false, message: error.errors[0]?.message || "Invalid input data" });
      return;
    }
    console.error("Reset password error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

export default router;
