export interface InsurancePolicy {
  id: number;
  name: string;
  title: string;
  description: string;
  coverageAmount: number[];
  minAmount: number;
  maxAmount: number;
  riskLevel: 'Low' | 'Medium' | 'Medium-High' | 'High';
  premiumRate: number;
  popularity: number;
  icon: string;
  currentCoverage?: number;
  isStablecoin?: boolean;
}

export interface ActivePolicy extends InsurancePolicy {
  currentCoverage: number;
  monthlyPremium: number;
  expiresIn: number;
}

export interface ActivityLog {
  id: number;
  type: 'payment' | 'renewal' | 'coverage_change';
  title: string;
  description: string;
  timestamp: string;
  status: string;
  statusColor: 'green' | 'blue' | 'orange';
}

export interface CoverageOption {
  id: number;
  name: string;
  description: string;
  minAmount: number;
  maxAmount: number;
  premiumRate: number;
  riskLevel: 'Low' | 'Medium' | 'High';
} 