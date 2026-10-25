import { request } from "@/lib/api/fetcher";
import type { MessageEnvelope } from "@/types/api";

export interface LoginInput {
  user: string;
  pwd: string;
}

export interface RegisterInput {
  user: string;
  email: string;
  pwd: string;
}

export interface TokenResponse {
  accessToken: string;
}

export function login(input: LoginInput): Promise<TokenResponse> {
  return request<TokenResponse>("/auth/login", {
    method: "POST",
    body: input,
    auth: false,
  });
}

export function register(input: RegisterInput): Promise<MessageEnvelope> {
  return request<MessageEnvelope>("/auth/register", {
    method: "POST",
    body: input,
    auth: false,
  });
}

export function logout(): Promise<void> {
  return request<void>("/auth/logout", { method: "POST", auth: false });
}

export function verifyEmail(token: string): Promise<MessageEnvelope> {
  return request<MessageEnvelope>("/auth/verify-email", {
    method: "POST",
    body: { token },
    auth: false,
  });
}

export function resendVerification(email: string): Promise<MessageEnvelope> {
  return request<MessageEnvelope>("/auth/resend-verification", {
    method: "POST",
    body: { email },
    auth: false,
  });
}

export function forgotPassword(email: string): Promise<MessageEnvelope> {
  return request<MessageEnvelope>("/auth/password/forgot", {
    method: "POST",
    body: { email },
    auth: false,
  });
}

export function resetPassword(token: string, newPwd: string): Promise<MessageEnvelope> {
  return request<MessageEnvelope>("/auth/password/reset", {
    method: "PATCH",
    body: { token, newPwd },
    auth: false,
  });
}
