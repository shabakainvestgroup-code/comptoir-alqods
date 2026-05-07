import { cookies } from "next/headers";
import { env } from "@/lib/env";

export const ADMIN_SESSION_COOKIE = "comptoir_alqods_admin";

export function isAdminPasswordValid(password: string) {
  return password.length > 0 && password === env.adminPassword;
}

export function isAdminAuthenticated() {
  return cookies().get(ADMIN_SESSION_COOKIE)?.value === "authenticated";
}
