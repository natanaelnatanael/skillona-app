export const PLAN_LIMITS = { free: 5, basic: 50, pro: 200 };
export function sinceMonthStart() { const d = new Date(); d.setUTCDate(1); d.setUTCHours(0,0,0,0); return d; }
