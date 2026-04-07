import "server-only";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { betterAuth } from "better-auth";
import { getSessionCookie } from "better-auth/cookies";
import { nextCookies } from "better-auth/next-js";

import { getDb } from "@/server/db/client";
import { getRequiredEnv, getServerEnv } from "@/server/env";

function createAuth() {
  return betterAuth({
    baseURL: getServerEnv().appUrl,
    database: getDb(),
    emailAndPassword: {
      autoSignIn: true,
      enabled: true,
    },
    plugins: [nextCookies()],
    secret: getRequiredEnv("AUTH_SECRET"),
  });
}

type AuthInstance = ReturnType<typeof createAuth>;

let authInstance: AuthInstance | undefined;

export function getAuth() {
  if (!authInstance) {
    authInstance = createAuth();
  }

  return authInstance;
}

export const auth = new Proxy({} as AuthInstance, {
  get(_target, property) {
    return getAuth()[property as keyof AuthInstance];
  },
  has(_target, property) {
    return property in getAuth();
  },
}) as AuthInstance;

export async function getAuthSession() {
  return getAuth().api.getSession({
    headers: await headers(),
  });
}

export async function hasAuthSessionCookie() {
  return Boolean(getSessionCookie(await headers()));
}

export async function requireAuthSession() {
  const session = await getAuthSession();

  if (!session?.user) {
    redirect("/login");
  }

  return session;
}

export async function redirectIfAuthenticated() {
  const session = await getAuthSession();

  if (session?.user) {
    redirect("/notes");
  }
}
