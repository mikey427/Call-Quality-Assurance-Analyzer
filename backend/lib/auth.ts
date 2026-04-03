import { betterAuth, Schema } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "./db/db.js"; // your drizzle instance
import * as schema from "./db/schema.js"

export const auth = betterAuth({
	database: drizzleAdapter(db, {
		provider: "pg",
		schema: schema,
	}),
	trustedOrigins: ["http://localhost:5173"],
	emailAndPassword: {
		enabled: true,
	},
	socialProviders: {
		// github: {
		// 	clientId: process.env.GITHUB_CLIENT_ID as string,
		// 	clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
		// },
	},
});
