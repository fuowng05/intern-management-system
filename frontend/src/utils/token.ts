import { jwtDecode } from "jwt-decode";
import type { JwtPayload } from "../types/jwt";

const ROLE_CLAIM =
  "http://schemas.microsoft.com/ws/2008/06/identity/claims/role";

const NAME_CLAIM =
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name";

export const getTokenPayload = (): JwtPayload | null => {
  const token = localStorage.getItem("accessToken");

  if (!token) {
    return null;
  }

  try {
    return jwtDecode<JwtPayload>(token);
  } catch {
    return null;
  }
};

export const getRoles = (): string[] => {
  const payload = getTokenPayload();

  if (!payload) {
    return [];
  }

  const role = payload[ROLE_CLAIM];

  if (!role) {
    return [];
  }

  return Array.isArray(role) ? role : [role];
};

export const getPermissions = (): string[] => {
  const payload = getTokenPayload();

  if (!payload?.permission) {
    return [];
  }

  return Array.isArray(payload.permission)
    ? payload.permission
    : [payload.permission];
};

export const getUserName = (): string => {
  const payload = getTokenPayload();

  return payload?.[NAME_CLAIM] ?? "";
};

export const getUserEmail = (): string => {
  const payload = getTokenPayload();

  return payload?.email ?? "";
};

export const hasRole = (role: string): boolean => {
  return getRoles().some(
    (currentRole) =>
      currentRole.toLowerCase() === role.toLowerCase()
  );
};

export const hasPermission = (
  permission: string
): boolean => {
  return getPermissions().includes(permission);
};

export const isTokenExpired = (): boolean => {
  const payload = getTokenPayload();

  if (!payload?.exp) {
    return true;
  }

  return payload.exp * 1000 <= Date.now();
};