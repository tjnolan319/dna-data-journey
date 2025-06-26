
import { Navigation } from "@/components/Navigation";
import { GanttChart } from "@/components/GanttChart";

const TimelinePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navigation />
      <GanttChart />
    </div>
  );
};

export default TimelinePage;
