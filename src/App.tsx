import React from 'react';
import { Footer } from '@/components/Footer';
import { Navbar } from '@/components/Navbar';
import { useTheme } from '@/hooks/useTheme';
import { DevelopmentSection } from '@/sections/DevelopmentSection';
import { DownloadsSection } from '@/sections/DownloadsSection';
import { FaqSection } from '@/sections/FaqSection';
import { FeaturesSection } from '@/sections/FeaturesSection';
import { HeroSection } from '@/sections/HeroSection';
import { RoadmapSection } from '@/sections/RoadmapSection';
import { ScreenshotsSection } from '@/sections/ScreenshotsSection';

export function App(): React.ReactElement {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#home"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-xl focus:bg-[#3B82F6] focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
      >
        Skip to main content
      </a>

      <Navbar theme={theme} onToggleTheme={toggleTheme} />

      <main className="flex-1">
        <HeroSection />
        <FeaturesSection />
        <ScreenshotsSection />
        <RoadmapSection />
        <DownloadsSection />
        <DevelopmentSection />
        <FaqSection />
      </main>

      <Footer />
    </div>
  );
}

export default App;
