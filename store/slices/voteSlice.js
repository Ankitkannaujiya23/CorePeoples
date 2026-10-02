import { createSlice } from "@reduxjs/toolkit";

const VOTES_STORAGE_KEY = "votedesk_votes_v1";

function loadStoredVotes() {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(window.localStorage.getItem(VOTES_STORAGE_KEY) || "{}");
  } catch {
    return {};
  }
}

function persistVotes(votes) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(VOTES_STORAGE_KEY, JSON.stringify(votes));
}

const initialState = {
  userVotes: {}, // { [voterId]: { [campaignId]: candidateId } }
  status: "idle",
  bootstrapped: false,
};

const voteSlice = createSlice({
  name: "votes",
  initialState,
  reducers: {
    bootstrapVotes(state) {
      state.userVotes = loadStoredVotes();
      state.bootstrapped = true;
    },
    voteRequestStarted(state) {
      state.status = "loading";
    },
    voteRequestFailed(state) {
      state.status = "failed";
    },
    recordVote(state, action) {
      state.status = "succeeded";
      const { campaignId, candidateId, voterId } = action.payload;
      if (!state.userVotes[voterId]) state.userVotes[voterId] = {};
      state.userVotes[voterId][campaignId] = candidateId;
      persistVotes(state.userVotes);
    },
  },
});

export const { bootstrapVotes, voteRequestStarted, voteRequestFailed, recordVote } =
  voteSlice.actions;
export default voteSlice.reducer;
