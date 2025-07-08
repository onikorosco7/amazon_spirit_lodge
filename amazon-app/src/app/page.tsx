import HeroSection from './components/sections/HeroSection';
import GallerySection from './components/sections/GallerySection';
import AboutSection from './components/sections/AboutSection';
import ReviewsSection from './components/sections/ReviewsSection';
import ContactSection from './components/sections/ContactSection';

export default function HomePage() {
  return (
    <div>
      <HeroSection />
      <GallerySection />
      <AboutSection />
      <ReviewsSection />
      <ContactSection />
    </div>
  );
}
