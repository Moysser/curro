import { useMemo } from "react";
import { Doughnut, Pie } from "react-chartjs-2";

const ApplicationStatsChart = ({
  applications = [],
  chartType = "doughnut",
}) => {
  const stats = useMemo(() => {
    const totals = {
      totalApplications: applications.length,
      totalApplied: 0,
      totalRejected: 0,
      totalInterviews: 0,
      totalOffers: 0,
    };

    applications.forEach((app) => {
      switch (app.status) {
        case "applied":
          totals.totalApplied++;
          break;
        case "rejected":
          totals.totalRejected++;
          break;
        case "interview":
          totals.totalInterviews++;
          break;
        case "offer":
          totals.totalOffers++;
          break;
        default:
          break;
      }
    });

    return totals;
  }, [applications]);

  const {
    totalApplications,
    totalApplied,
    totalRejected,
    totalInterviews,
    totalOffers,
  } = stats;

  const data = {
    labels: ["Applied", "Rejected", "Interviews", "Offers"],
    datasets: [
      {
        data: [totalApplied, totalRejected, totalInterviews, totalOffers],
        backgroundColor: ["#3B82F6", "#EF4444", "#F59E0B", "#10B981"],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
      },
    },
  };

  const ChartComponent = chartType === "doughnut" ? Doughnut : Pie;

  return (
    <div>
      <div className="max-h-[400px] flex gap-20 items-center">
        <div className="w-[300px] h-[300px]">
          <ChartComponent data={data} options={options} />
        </div>

        {/* Tablet stats */}
        <div className="space-y-2 hidden md:block lg:hidden">
          <Stat label="Total Applications" value={totalApplications} />
          <Stat label="Total Rejected" value={totalRejected} />
          <Stat label="Total Interviews" value={totalInterviews} />
          <Stat label="Total Offers" value={totalOffers} />
        </div>
      </div>

      {/* Mobile / Large screens */}
      <div className="mt-4 grid grid-cols-2 gap-2 md:hidden lg:grid">
        <Stat label="Total Applications" value={totalApplications} />
        <Stat label="Total Rejected" value={totalRejected} />
        <Stat label="Total Interviews" value={totalInterviews} />
        <Stat label="Total Offers" value={totalOffers} />
      </div>
    </div>
  );
};

function Stat({ label, value }) {
  return (
    <div className="flex items-center">
      <p className="text-sm text-gray mr-1">{label}:</p>
      <p className="font-bold text-primary-text">{value}</p>
    </div>
  );
}

export default ApplicationStatsChart;
