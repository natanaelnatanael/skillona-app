export const FREE_LIMIT = 5;
export const BASIC_LIMIT = 200;
export const PRO_LIMIT = 1000;

export const PLAN_LIMITS = {
  free: FREE_LIMIT,
  basic: BASIC_LIMIT,
  pro: PRO_LIMIT,
};

export function sinceMonthStart() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), 1);
}

