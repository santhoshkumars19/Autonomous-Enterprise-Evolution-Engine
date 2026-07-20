import { Pool } from "pg";
export declare const pool: Pool;
export declare const query: <T = unknown>(text: string, params?: unknown[]) => Promise<T[]>;
export declare const connectDB: () => Promise<void>;
//# sourceMappingURL=db.d.ts.map