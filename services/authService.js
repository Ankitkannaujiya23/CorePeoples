import { api, MOCK_MODE } from "@/lib/api";
import { findUserByEmail } from "@/data/users";

const delay = (ms = 250) => new Promise((r) => setTimeout(r, ms));

export const authService = {
  async login({ email, password }) {
    if (!MOCK_MODE) {
      return api.post("/auth/login", { email, password });
    }
    await delay();
    const user = findUserByEmail(email);
    if (!user || user.password !== password) {
      const err = new Error("Invalid email or password.");
      err.code = "INVALID_CREDENTIALS";
      throw err;
    }
    const { password: _pw, ...safeUser } = user;
    return { user: safeUser };
  },

  async createOrganization(payload) {
    
    if (!MOCK_MODE) {
      return api.post("/auth/signup", payload);
    }

    await delay(300);
    // In mock mode we just synthesize an admin session for the new org.
    return {
      user: {
        id: "user_admin_new",
        name: payload.adminName,
        email: payload.email,
        role: "admin",
        organizationId: "org_new",
        avatarColor: "#15171C",
      },
      organization: {
        id: "org_new",
        name: payload.organizationName,
        industry: payload.industry,
        employeeCount: Number(payload.employeeCount) || 0,
        plan: "Free Trial",
      },
    };
  },

  async logout() {
    if (!MOCK_MODE) {
      return api.post("/auth/logout");
    }

    await delay(100);
    return { success: true };
  },
};
