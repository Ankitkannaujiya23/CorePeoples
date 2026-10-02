import { api } from "@/lib/api";

export const voteReviewService = {
    async submitResponse(campaignId, { targetEmployeeId, answers }) {
        return api.post(`/campaigns/${campaignId}/responses`, { targetEmployeeId, answers });
    },

    async getMyResponse(campaignId) {
        return api.get(`/campaigns/${campaignId}/my-response`);
    },

    async getResponses(campaignId) {
        return api.get(`/campaigns/${campaignId}/responses`);
    },
};