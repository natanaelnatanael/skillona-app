export const FREE_PLAN_LIMIT = 3; // broj besplatnih videa
export const BASIC_PLAN_LIMIT = 30;
export const PRO_PLAN_LIMIT = 999;

export function getLimitByPlan(plan: string) {
  switch (plan) {
    case "basic":
      return BASIC_PLAN_LIMIT;
    case "pro":
      return PRO_PLAN_LIMIT;
    default:
      return FREE_PLAN_LIMIT;
  }
}

