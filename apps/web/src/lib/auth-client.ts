"use client";

import { createAuthClient } from "better-auth/react";

/**
 * Better Auth browser client.
 * Points to the Express API server where Better Auth is configured (Phase 2).
 * Exports signIn, signOut, useSession for use in Client Components.
 */
export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "",
});

export const { signIn, signOut, useSession } = authClient;
