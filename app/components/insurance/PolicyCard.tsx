import type { ActivePolicy } from '../../types/insurance';

interface PolicyCardProps {
  policy: ActivePolicy;
}

export function PolicyCard({ policy }: PolicyCardProps) {
  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <div>Policy: {policy.title}</div>
    </div>
  );
} 