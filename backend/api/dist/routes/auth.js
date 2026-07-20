"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const zod_1 = require("zod");
const db_1 = require("../config/db");
const env_1 = require("../config/env");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
const registerSchema = zod_1.z.object({
    name: zod_1.z.string().min(2),
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(8),
    company: zod_1.z.string().optional(),
});
const loginSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(1),
});
const socialLoginSchema = zod_1.z.object({
    provider: zod_1.z.enum(["google", "microsoft"]),
    email: zod_1.z.string().email(),
    name: zod_1.z.string().optional(),
});
// POST /api/auth/register
router.post("/register", async (req, res) => {
    try {
        const body = registerSchema.parse(req.body);
        // Check if user exists
        const existing = await (0, db_1.query)("SELECT id FROM users WHERE LOWER(email) = LOWER($1)", [body.email]);
        if (existing.length > 0) {
            res.status(409).json({ success: false, message: "Email already registered" });
            return;
        }
        const passwordHash = await bcryptjs_1.default.hash(body.password, 12);
        const companyName = body.company || `${body.name}'s Enterprise`;
        // 1. Create company record
        const [company] = await (0, db_1.query)(`INSERT INTO companies (name, setup_completed)
       VALUES ($1, FALSE)
       RETURNING id`, [companyName]);
        // 2. Create user record linked to company
        const [user] = await (0, db_1.query)(`INSERT INTO users (name, email, password_hash, company, company_id, role, setup_completed)
       VALUES ($1, $2, $3, $4, $5, 'user', FALSE)
       RETURNING id, email, name, role, company, company_id, setup_completed`, [body.name, body.email, passwordHash, companyName, company.id]);
        const signOptions = { expiresIn: env_1.env.JWT_EXPIRES_IN };
        const token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email, role: user.role }, env_1.env.JWT_SECRET, signOptions);
        const refreshToken = jsonwebtoken_1.default.sign({ id: user.id, type: "refresh" }, env_1.env.JWT_SECRET, { expiresIn: "7d" });
        res.status(201).json({
            success: true,
            message: "Account created successfully",
            token,
            refreshToken,
            role: user.role,
            company_id: user.company_id,
            user_id: user.id,
            business_setup_completed: false,
            setup_completed: false,
            user: {
                id: user.id,
                user_id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                company: user.company,
                company_id: user.company_id,
                business_setup_completed: false,
                setup_completed: false,
            },
        });
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            res.status(400).json({ success: false, errors: error.flatten().fieldErrors });
            return;
        }
        console.error("Register error:", error);
        res.status(500).json({ success: false, message: error?.message || "Internal server error" });
    }
});
// POST /api/auth/login
router.post("/login", async (req, res) => {
    try {
        const body = loginSchema.parse(req.body);
        const [user] = await (0, db_1.query)(`SELECT u.id, u.email, u.name, u.role, u.company, u.company_id,
              COALESCE(u.setup_completed, FALSE) as setup_completed,
              COALESCE(c.setup_completed, FALSE) as company_setup_completed,
              u.password_hash
       FROM users u
       LEFT JOIN companies c ON u.company_id = c.id
       WHERE LOWER(u.email) = LOWER($1)`, [body.email]);
        if (!user) {
            res.status(401).json({ success: false, message: "Invalid credentials" });
            return;
        }
        const passwordMatch = await bcryptjs_1.default.compare(body.password, user.password_hash);
        if (!passwordMatch) {
            res.status(401).json({ success: false, message: "Invalid credentials" });
            return;
        }
        // Ensure company_id exists if missing
        let companyId = user.company_id;
        if (!companyId) {
            const companyName = user.company || `${user.name}'s Enterprise`;
            const [newComp] = await (0, db_1.query)("INSERT INTO companies (name, setup_completed) VALUES ($1, FALSE) RETURNING id", [companyName]);
            companyId = newComp.id;
            await (0, db_1.query)("UPDATE users SET company_id = $1 WHERE id = $2", [companyId, user.id]);
        }
        // Update last login
        await (0, db_1.query)("UPDATE users SET last_login_at = NOW() WHERE id = $1", [user.id]);
        const signOptions = { expiresIn: env_1.env.JWT_EXPIRES_IN };
        const token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email, role: user.role }, env_1.env.JWT_SECRET, signOptions);
        const refreshToken = jsonwebtoken_1.default.sign({ id: user.id, type: "refresh" }, env_1.env.JWT_SECRET, { expiresIn: "7d" });
        const isSetupCompleted = Boolean(user.role === "admin" ||
            (Boolean(user.setup_completed) && Boolean(user.company_setup_completed)));
        res.json({
            success: true,
            message: "Login successful",
            token,
            refreshToken,
            role: user.role,
            company_id: companyId,
            user_id: user.id,
            business_setup_completed: isSetupCompleted,
            setup_completed: isSetupCompleted,
            user: {
                id: user.id,
                user_id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                company: user.company,
                company_id: companyId,
                business_setup_completed: isSetupCompleted,
                setup_completed: isSetupCompleted,
            },
        });
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            res.status(400).json({ success: false, errors: error.flatten().fieldErrors });
            return;
        }
        console.error("Login error:", error);
        res.status(500).json({ success: false, message: error?.message || "Internal server error" });
    }
});
// POST /api/auth/admin/login
router.post("/admin/login", async (req, res) => {
    try {
        const body = loginSchema.parse(req.body);
        const [user] = await (0, db_1.query)("SELECT id, email, name, role, company, company_id, setup_completed, password_hash FROM users WHERE LOWER(email) = LOWER($1)", [body.email]);
        if (!user) {
            res.status(401).json({ success: false, message: "Invalid admin credentials" });
            return;
        }
        if (user.role.toLowerCase() !== "admin") {
            res.status(403).json({ success: false, message: "Access denied. Admin privileges required." });
            return;
        }
        const passwordMatch = await bcryptjs_1.default.compare(body.password, user.password_hash);
        if (!passwordMatch) {
            res.status(401).json({ success: false, message: "Invalid admin credentials" });
            return;
        }
        // Update last login
        await (0, db_1.query)("UPDATE users SET last_login_at = NOW() WHERE id = $1", [user.id]);
        const signOptions = { expiresIn: env_1.env.JWT_EXPIRES_IN };
        const token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email, role: user.role }, env_1.env.JWT_SECRET, signOptions);
        const refreshToken = jsonwebtoken_1.default.sign({ id: user.id, type: "refresh" }, env_1.env.JWT_SECRET, { expiresIn: "7d" });
        res.json({
            success: true,
            message: "Admin authentication successful",
            token,
            refreshToken,
            role: user.role,
            company_id: user.company_id || null,
            user_id: user.id,
            business_setup_completed: true,
            setup_completed: true,
            user: {
                id: user.id,
                user_id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                company: user.company,
                company_id: user.company_id || null,
                business_setup_completed: true,
                setup_completed: true,
            },
        });
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            res.status(400).json({ success: false, errors: error.flatten().fieldErrors });
            return;
        }
        console.error("Admin login error:", error);
        res.status(500).json({ success: false, message: error?.message || "Internal server error" });
    }
});
// POST /api/auth/social-login
router.post("/social-login", async (req, res) => {
    try {
        const body = socialLoginSchema.parse(req.body);
        let [user] = await (0, db_1.query)(`SELECT u.id, u.email, u.name, u.role, u.company, u.company_id,
              COALESCE(u.setup_completed, FALSE) as setup_completed,
              COALESCE(c.setup_completed, FALSE) as company_setup_completed
       FROM users u
       LEFT JOIN companies c ON u.company_id = c.id
       WHERE LOWER(u.email) = LOWER($1)`, [body.email]);
        if (!user) {
            const defaultName = body.name || body.email.split("@")[0].replace(/[._]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
            const companyName = `${defaultName}'s Enterprise`;
            const passwordHash = await bcryptjs_1.default.hash(`SocialOAuth_${Date.now()}_SecretKey!`, 12);
            const [newComp] = await (0, db_1.query)("INSERT INTO companies (name, setup_completed) VALUES ($1, FALSE) RETURNING id", [companyName]);
            const [newUser] = await (0, db_1.query)(`INSERT INTO users (name, email, password_hash, company, company_id, role, setup_completed)
         VALUES ($1, $2, $3, $4, $5, 'user', FALSE)
         RETURNING id, email, name, role, company, company_id, setup_completed, FALSE as company_setup_completed`, [defaultName, body.email, passwordHash, companyName, newComp.id]);
            user = newUser;
        }
        await (0, db_1.query)("UPDATE users SET last_login_at = NOW() WHERE id = $1", [user.id]);
        const signOptions = { expiresIn: env_1.env.JWT_EXPIRES_IN };
        const token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email, role: user.role }, env_1.env.JWT_SECRET, signOptions);
        const refreshToken = jsonwebtoken_1.default.sign({ id: user.id, type: "refresh" }, env_1.env.JWT_SECRET, { expiresIn: "7d" });
        const isSetupCompleted = Boolean(user.role === "admin" ||
            (Boolean(user.setup_completed) && Boolean(user.company_setup_completed)));
        res.json({
            success: true,
            message: `Successfully authenticated via ${body.provider === 'google' ? 'Google' : 'Microsoft'}`,
            token,
            refreshToken,
            role: user.role,
            company_id: user.company_id,
            user_id: user.id,
            business_setup_completed: isSetupCompleted,
            setup_completed: isSetupCompleted,
            user: {
                id: user.id,
                user_id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                company: user.company,
                company_id: user.company_id,
                business_setup_completed: isSetupCompleted,
                setup_completed: isSetupCompleted,
            },
        });
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            res.status(400).json({ success: false, errors: error.flatten().fieldErrors });
            return;
        }
        console.error("Social login error:", error);
        res.status(500).json({ success: false, message: error?.message || "Internal server error" });
    }
});
// GET /api/auth/me
router.get("/me", auth_1.authenticate, async (req, res) => {
    try {
        const [user] = await (0, db_1.query)(`SELECT u.id, u.name, u.email, u.role, u.company, u.company_id,
              COALESCE(u.setup_completed, FALSE) as setup_completed,
              COALESCE(c.setup_completed, FALSE) as company_setup_completed,
              u.created_at
       FROM users u
       LEFT JOIN companies c ON u.company_id = c.id
       WHERE u.id = $1`, [req.user.id]);
        if (!user) {
            res.status(404).json({ success: false, message: "User not found" });
            return;
        }
        const isSetupCompleted = Boolean(user.role === "admin" ||
            (Boolean(user.setup_completed) && Boolean(user.company_setup_completed)));
        res.json({
            success: true,
            user: {
                ...user,
                user_id: user.id,
                business_setup_completed: isSetupCompleted,
                setup_completed: isSetupCompleted,
            },
        });
    }
    catch (error) {
        console.error("Get me error:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});
// POST /api/auth/verify-email
router.post("/verify-email", async (req, res) => {
    try {
        const { email } = zod_1.z.object({ email: zod_1.z.string().email() }).parse(req.body);
        const [user] = await (0, db_1.query)("SELECT id, email, name FROM users WHERE LOWER(email) = LOWER($1)", [email]);
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
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            res.status(400).json({ success: false, message: "Invalid email format" });
            return;
        }
        console.error("Verify email error:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});
// POST /api/auth/reset-password
router.post("/reset-password", async (req, res) => {
    try {
        const { email, newPassword } = zod_1.z
            .object({
            email: zod_1.z.string().email(),
            newPassword: zod_1.z.string().min(6, "Password must be at least 6 characters"),
        })
            .parse(req.body);
        const [user] = await (0, db_1.query)("SELECT id FROM users WHERE LOWER(email) = LOWER($1)", [email]);
        if (!user) {
            res.status(404).json({
                success: false,
                message: "No registered account found with this email address.",
            });
            return;
        }
        const passwordHash = await bcryptjs_1.default.hash(newPassword, 12);
        await (0, db_1.query)("UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2", [passwordHash, user.id]);
        res.json({
            success: true,
            message: "Password reset successfully! You can now sign in with your new password.",
        });
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            res.status(400).json({ success: false, message: error.errors[0]?.message || "Invalid input data" });
            return;
        }
        console.error("Reset password error:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});
exports.default = router;
//# sourceMappingURL=auth.js.map