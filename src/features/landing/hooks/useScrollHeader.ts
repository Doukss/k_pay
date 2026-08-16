import { useEffect, useState } from 'react';

// Détecte le scroll pour appliquer un fond/ombre au header une fois qu'on quitte le hero
export function useScrollHeader(threshold = 20) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > threshold);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [threshold]);

  return isScrolled;
}