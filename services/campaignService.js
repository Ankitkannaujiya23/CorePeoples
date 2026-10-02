import { api, MOCK_MODE } from "@/lib/api";
import { campaigns as mockCampaigns, getCampaignById } from "@/data/campaigns";

const delay = (ms = 250) => new Promise((r) => setTimeout(r, ms));

export const campaignService = {
  async getCampaigns() {
    if (!MOCK_MODE) {
      return api.get("/campaigns");
    }

    await delay();
    return mockCampaigns;
  },

  async getCampaignById(id) {
    if (!MOCK_MODE) {
      return api.get(`/campaigns/${id}`);
    }

    await delay(150);
    return getCampaignById(id);
  },

  async createCampaign(payload) {
    if (!MOCK_MODE) {
      return api.post("/campaigns", payload);
    }

    await delay(300);
    return {
      id: `camp_${Date.now()}`,
      status: payload.saveAsDraft ? "draft" : "active",
      votes: {},
      voterIds: [],
      totalEligibleVoters: 8,
      ...payload,
    };
  },

  async updateCampaignStatus(id, status) {
    if (!MOCK_MODE) {
      return api.patch(`/campaigns/${id}/status`, { status });
    }

    await delay(200);
    return { id, status };
  },

  async deleteCampaign(id) {
    if (!MOCK_MODE) {
      return api.delete(`/campaigns/${id}`);
    }

    await delay(200);
    return { success: true, id };
  },

  // Admin-only — submissions from a public-link campaign (no login
  // involved on the voter's side, but viewing results still requires
  // an admin session).
  async getPublicSubmissions(id) {
    return api.get(`/campaigns/${id}/public-submissions`);
  },
};