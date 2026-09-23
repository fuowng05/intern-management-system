import {
    createContext,
    useContext,
    useState,
    type ReactNode,
  } from "react";
  
  import authService from "../services/authService";
  import {
    getPermissions,
    getRoles,
    isTokenExpired,
  } from "../utils/token";
  
  interface AuthContextType {
    isAuthenticated: boolean;
    roles: string[];
    permissions: string[];
  
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
  
    hasRole: (role: string) => boolean;
    hasPermission: (permission: string) => boolean;
  }
  
  const AuthContext = createContext<AuthContextType | undefined>(
    undefined
  );
  
  export function AuthProvider({
    children,
  }: {
    children: ReactNode;
  }) {
    const [isAuthenticated, setIsAuthenticated] = useState(
      () =>
        !!localStorage.getItem("accessToken") &&
        !isTokenExpired()
    );
  
    const [roles, setRoles] = useState<string[]>(() =>
      getRoles()
    );
  
    const [permissions, setPermissions] = useState<string[]>(
      () => getPermissions()
    );
  
    const login = async (
      email: string,
      password: string
    ) => {
      await authService.login({
        email,
        password,
      });
  
      setIsAuthenticated(true);
      setRoles(getRoles());
      setPermissions(getPermissions());
    };
  
    const logout = async () => {
      await authService.logout();
  
      setIsAuthenticated(false);
      setRoles([]);
      setPermissions([]);
    };
  
    const hasRole = (role: string) => {
      return roles.some(
        (currentRole) =>
          currentRole.toLowerCase() === role.toLowerCase()
      );
    };
  
    const hasPermission = (permission: string) => {
      return permissions.includes(permission);
    };
  
    return (
      <AuthContext.Provider
        value={{
          isAuthenticated,
          roles,
          permissions,
          login,
          logout,
          hasRole,
          hasPermission,
        }}
      >
        {children}
      </AuthContext.Provider>
    );
  }
  
  export function useAuth() {
    const context = useContext(AuthContext);
  
    if (!context) {
      throw new Error(
        "useAuth phải được sử dụng bên trong AuthProvider"
      );
    }
  
    return context;
  }