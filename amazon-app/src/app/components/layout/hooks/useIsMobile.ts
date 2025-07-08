import { useEffect, useState } from 'react';

// Breakpoints al estilo Tailwind
const breakpoints: Record<string, number> = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
};

export function useIsMobile(breakpoint: number | keyof typeof breakpoints = 'md') {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const width = typeof breakpoint === 'string' ? breakpoints[breakpoint] : breakpoint;

    const checkScreen = () => {
      setIsMobile(window.innerWidth < width);
    };

    checkScreen();
    window.addEventListener('resize', checkScreen);
    return () => window.removeEventListener('resize', checkScreen);
  }, [breakpoint]);

  return isMobile;
}
