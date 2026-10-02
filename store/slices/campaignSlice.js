import { createSlice, nanoid } from "@reduxjs/toolkit";

const initialState = {
  campaigns: [],
  activeCampaignId: null,
  status: "idle",
  error: null,
};

const campaignSlice = createSlice({
  name: "campaigns",
  initialState,
  reducers: {
    campaignsRequestStarted(state) {
      state.status = "loading";
      state.error = null;
    },
    campaignsRequestFailed(state, action) {
      state.status = "failed";
      state.error = action.payload || "Something went wrong.";
    },
    setCampaigns(state, action) {
      state.status = "succeeded";
      state.campaigns = action.payload;
    },
    addCampaign(state, action) {
      state.status = "succeeded";
      state.campaigns.unshift(action.payload);
    },
    setActiveCampaign(state, action) {
      state.activeCampaignId = action.payload;
    },
    registerVote(state, action) {
      const { campaignId, candidateId, voterId } = action.payload;
      const campaign = state.campaigns.find((c) => c.id === campaignId);
      if (!campaign) return;
      campaign.votes[candidateId] = (campaign.votes[candidateId] || 0) + 1;
      if (!campaign.voterIds.includes(voterId)) {
        campaign.voterIds.push(voterId);
      }
    },
    updateCampaignStatus(state, action) {
      const { campaignId, status } = action.payload;
      const campaign = state.campaigns.find((c) => c.id === campaignId);
      if (campaign) campaign.status = status;
    },
    deleteCampaign(state, action) {
      state.campaigns = state.campaigns.filter((c) => c.id !== action.payload);
    },
    duplicateCampaign(state, action) {
      const source = state.campaigns.find((c) => c.id === action.payload);
      if (!source) return;
      state.campaigns.unshift({
        ...source,
        id: `camp_${nanoid(6)}`,
        name: `${source.name} (Copy)`,
        status: "draft",
        votes: {},
        voterIds: [],
      });
    },
  },
});

export const {
  campaignsRequestStarted,
  campaignsRequestFailed,
  setCampaigns,
  addCampaign,
  setActiveCampaign,
  registerVote,
  updateCampaignStatus,
  deleteCampaign,
  duplicateCampaign,
} = campaignSlice.actions;
export default campaignSlice.reducer;
