import Hero from '../../components/sections/home/Hero';
import Categories from '../../components/sections/home/Categories';
import HowItWorks from '../../components/sections/home/HowItWorks';
import FeaturedPros from '../../components/sections/home/FeaturedPros';
import Testimonials from '../../components/sections/home/Testimonials';
import CTA from '../../components/sections/home/CTA';

export default function HomePage() {
  return (
    <>
      <Hero />
      <Categories />
      <HowItWorks />
      <FeaturedPros />
      <Testimonials />
      <CTA />
    </>
  );
}
