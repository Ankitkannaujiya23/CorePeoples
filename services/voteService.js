import { api, MOCK_MODE } from "@/lib/api";

const delay = (ms = 400) => new Promise((r) => setTimeout(r, ms));

export const voteService = {
  async submitVote({ campaignId, candidateId, voterId }) {
    if (!MOCK_MODE) {
      return api.post(`/campaigns/${campaignId}/vote`, { candidateId });
    }

    await delay();
    return {
      success: true,
      campaignId,
      candidateId,
      voterId,
      submittedAt: new Date().toISOString(),
    };
  },
};