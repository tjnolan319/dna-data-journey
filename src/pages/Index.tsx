
import { DNAHero } from "@/components/DNAHero";
import { TimelinePreview } from "@/components/TimelinePreview";
import { Navigation } from "@/components/Navigation";
import { TechStack } from "@/components/TechStack";
import { ProjectTabs } from "@/components/ProjectTabs";
import { DataGallery } from "@/components/DataGallery";
import { ContactForm } from "@/components/ContactForm";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navigation />
      <DNAHero />
      <TechStack />
      <ProjectTabs />
      <TimelinePreview />
      <DataGallery />
      <ContactForm />
    </div>
  );
};

export default Index;
