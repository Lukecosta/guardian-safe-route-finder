interface AreaStats {
  totalCrimes: number;
  categories: [string, number][];
  outcomes: [string, number][];
  monthlyTrends: [string, number][];
}

interface GuardianStatsProps {
  stats: AreaStats | null;
}

export const GuardianStats = ({ stats }: GuardianStatsProps) => {
  if (!stats) return null;

  const topCategories = stats.categories.slice(0, 5);
  const recentMonths = stats.monthlyTrends.slice(0, 3);
  const topOutcomes = stats.outcomes.slice(0, 5);

  return (
    <div className="guardian-feature-card mt-6">
      <h4>Area Crime Statistics</h4>
      <div>
        <h5>Total Reported Crimes: {stats.totalCrimes}</h5>
        
        <h6>Top Crime Categories</h6>
        <ul>
          {topCategories.map(([category, count]) => (
            <li key={category}>
              {category.replace(/-/g, ' ').toUpperCase()}: {count} cases
            </li>
          ))}
        </ul>

        <h6>Monthly Trends</h6>
        <ul>
          {recentMonths.map(([month, count]) => (
            <li key={month}>
              {month}: {count} incidents
            </li>
          ))}
        </ul>

        <h6>Case Outcomes</h6>
        <ul>
          {topOutcomes.map(([outcome, count]) => (
            <li key={outcome}>
              {outcome}: {count} cases
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};