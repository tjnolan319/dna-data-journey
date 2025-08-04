
import { DNAHero } from "@/components/DNAHero";
import { TimelinePreview } from "@/components/TimelinePreview";
import { Navigation } from "@/components/Navigation";
import { TechStack } from "@/components/TechStack";
import { ProjectTabs } from "@/components/ProjectTabs";
import { DataGallery } from "@/components/DataGallery";
import { ContactForm } from "@/components/ContactForm";
import ResumeDownloadButton from "@/components/ResumeDownloadButton";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navigation />
      <DNAHero />
      <TechStack />
      <ProjectTabs />
      <TimelinePreview />
      <DataGallery />
      <div className="max-w-4xl mx-auto px-6 py-8 text-center">
        <h2 className="text-2xl font-bold text-slate-900 mb-4">Download My Resume</h2>
        <ResumeDownloadButton />
      </div>
      <ContactForm />
    </div>
  );
};

export default Index;
