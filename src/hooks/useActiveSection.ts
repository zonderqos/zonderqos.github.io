import { useEffect, useState } from 'react';
import type { NavSectionId } from '@/types/site';

const SECTION_IDS: NavSectionId[] = [
  'home',
  'features',
  'screenshots',
  'roadmap',
  'downloads',
  'virtual-machines',
  'installation',
  'development',
  'faq',
];

export function useActiveSection(): NavSectionId {
  const [activeSection, setActiveSection] = useState<NavSectionId>('home');

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 180;
      let current: NavSectionId = 'home';

      for (const id of SECTION_IDS) {
        const element = document.getElementById(id);
        if (element) {
          const offsetTop = element.offsetTop;
          if (scrollPosition >= offsetTop) {
            current = id;
          }
        }
      }
      setActiveSection(current);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return activeSection;
}
