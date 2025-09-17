import Navbar from "@/components/Navbar";
import VRHero from "@/components/VRHero";
import FeaturePreview from "@/components/FeaturePreview";
import AuthSection from "@/components/AuthSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <VRHero />
        <FeaturePreview />
        <AuthSection />
      </main>
    </div>
  );
};

export default Index;
