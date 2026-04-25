
export interface AnalysisResult {
  total_income: number;
  total_expenditure: number;
  fuliza_repayment_speed: 'fast' | 'medium' | 'slow' | 'none';
  utility_consistency: 'high' | 'medium' | 'low';
  savings_frequency: 'regular' | 'occasional' | 'none';
  top_insights: string[];
  behavioral_advice: string;
  resilienceScore: number;
  status: string;
}

export function calculateResilienceScore(data: any): number {
  let score = 500; // Base score

  // 1. Fuliza Repayment Velocity
  if (data.fuliza_repayment_speed === 'fast') score += 120;
  if (data.fuliza_repayment_speed === 'medium') score += 50;
  if (data.fuliza_repayment_speed === 'slow') score -= 100;

  // 2. Utility Consistency
  if (data.utility_consistency === 'high') score += 100;
  if (data.utility_consistency === 'medium') score += 30;
  if (data.utility_consistency === 'low') score -= 50;

  // 3. Savings Behavior
  if (data.savings_frequency === 'regular') score += 80;

  // 4. Volume Multiplier
  if (data.total_income > 50000) score += 50;

  return Math.min(Math.max(score, 300), 850);
}

export function getStatusFromScore(score: number): string {
  if (score >= 700) return 'Strategic';
  if (score >= 550) return 'Steady';
  return 'Developing';
}
