
import { DNAHero } from "@/components/DNAHero";
import { GanttChart } from "@/components/GanttChart";
import { DNATimeline } from "@/components/DNATimeline";
import { Navigation } from "@/components/Navigation";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navigation />
      <DNAHero />
      <GanttChart />
      <DNATimeline />
    </div>
  );
};

export default Index;
