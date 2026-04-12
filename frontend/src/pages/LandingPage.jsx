import React from 'react';
import HeroSection from '../components/landing/HeroSection';
import PlatformOverview from '../components/landing/PlatformOverview';
import FeaturesSection from '../components/landing/FeaturesSection';
import StatsSection from '../components/landing/StatsSection';
import CTASection from '../components/landing/CTASection';
import FooterSection from '../components/landing/FooterSection';

const LandingPage = () => (
  <div className="min-h-screen" data-testid="landing-page">
    <HeroSection />
    <PlatformOverview />
    <FeaturesSection />
    <StatsSection />
    <CTASection />
    <FooterSection />
  </div>
);

export default LandingPage;
