import { api } from "@/lib/api";

// These hit /api/public/* on the backend — no auth header is required
// (and none gets attached, since there's no logged-in user on this page).
export const publicVoteService = {
  async getCampaign(token) {
    return api.get(`/public/campaigns/${token}`);
  },

  async submit(token, payload) {
    return api.post(`/public/campaigns/${token}/submit`, payload);
  },
};