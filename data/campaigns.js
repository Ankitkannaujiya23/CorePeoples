export const campaigns = [
  {
    id: "camp_aug_2026",
    name: "Employee of the Month — August 2026",
    description:
      "Recognize the teammate who made the biggest impact across the org this month.",
    type: "employee_of_the_month",
    status: "active",
    startDate: "2026-08-01",
    endDate: "2026-08-30",
    votingMode: "public",
    resultVisibility: "after_voting_ends",
    candidateIds: ["emp_1", "emp_2", "emp_3", "emp_4", "emp_5", "emp_6"],
    totalEligibleVoters: 8,
    votes: {
      emp_1: 42,
      emp_2: 12,
      emp_3: 31,
      emp_4: 4,
      emp_5: 2,
      emp_6: 0,
    },
    voterIds: [],
  },
  {
    id: "camp_jul_2026",
    name: "Employee of the Month — July 2026",
    description: "July's recognition campaign, celebrating consistent impact.",
    type: "employee_of_the_month",
    status: "completed",
    startDate: "2026-07-01",
    endDate: "2026-07-31",
    votingMode: "public",
    resultVisibility: "after_voting_ends",
    candidateIds: ["emp_1", "emp_2", "emp_3", "emp_4", "emp_7", "emp_8"],
    totalEligibleVoters: 8,
    votes: {
      emp_1: 58,
      emp_2: 19,
      emp_3: 23,
      emp_4: 11,
      emp_7: 40,
      emp_8: 33,
    },
    voterIds: ["emp_2", "emp_3", "emp_4", "emp_5", "emp_6", "emp_7", "emp_8"],
    winnerId: "emp_1",
  },
  {
    id: "camp_jun_2026",
    name: "Employee of the Month — June 2026",
    description: "June's recognition campaign.",
    type: "employee_of_the_month",
    status: "completed",
    startDate: "2026-06-01",
    endDate: "2026-06-30",
    votingMode: "public",
    resultVisibility: "after_voting_ends",
    candidateIds: ["emp_3", "emp_5", "emp_6", "emp_7", "emp_8"],
    totalEligibleVoters: 8,
    votes: {
      emp_3: 12,
      emp_5: 61,
      emp_6: 18,
      emp_7: 27,
      emp_8: 9,
    },
    voterIds: ["emp_1", "emp_2", "emp_4", "emp_6", "emp_7"],
    winnerId: "emp_5",
  },
  {
    id: "camp_best_team_player",
    name: "Best Team Player — Q3 2026",
    description: "A draft campaign recognizing collaboration across teams.",
    type: "employee_of_the_month",
    status: "draft",
    startDate: "2026-09-01",
    endDate: "2026-09-15",
    votingMode: "anonymous",
    resultVisibility: "admin_only",
    candidateIds: ["emp_2", "emp_4", "emp_6"],
    totalEligibleVoters: 8,
    votes: {},
    voterIds: [],
  },
];

export function getCampaignById(id) {
  return campaigns.find((c) => c.id === id) || null;
}

export function totalVotes(campaign) {
  return Object.values(campaign.votes || {}).reduce((a, b) => a + b, 0);
}

export function participationRate(campaign) {
  if (!campaign.totalEligibleVoters) return 0;
  const voters =
    campaign.voterIds?.length || totalVotes(campaign) > 0
      ? Math.max(campaign.voterIds?.length || 0, 1)
      : 0;
  const rate = (voters / campaign.totalEligibleVoters) * 100;
  return Math.min(100, Math.round(rate));
}

export function daysRemaining(endDate) {
  const end = new Date(endDate + "T23:59:59");
  const now = new Date("2026-08-23T09:00:00");
  const diff = Math.ceil((end - now) / (1000 * 60 * 60 * 24));
  return diff;
}
