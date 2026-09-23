import api from "../api/axios";
import type {
  AuthResponse,
  LoginRequest,
  RefreshTokenRequest,
} from "../types/auth";

const authService = {
  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>("/Auth/login", data);

    localStorage.setItem("accessToken", response.data.accessToken);
    localStorage.setItem("refreshToken", response.data.refreshToken);

    return response.data;
  },

  async refresh(): Promise<AuthResponse> {
    const refreshToken = localStorage.getItem("refreshToken");

    if (!refreshToken) {
      throw new Error("Không có refresh token.");
    }

    const data: RefreshTokenRequest = {
      refreshToken,
    };

    const response = await api.post<AuthResponse>("/Auth/refresh", data);

    localStorage.setItem("accessToken", response.data.accessToken);
    localStorage.setItem("refreshToken", response.data.refreshToken);

    return response.data;
  },

  async logout(): Promise<void> {
    const refreshToken = localStorage.getItem("refreshToken");

    try {
      if (refreshToken) {
        await api.post("/Auth/logout", {
          refreshToken,
        });
      }
    } finally {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    }
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem("accessToken");
  },
};

export default authService;