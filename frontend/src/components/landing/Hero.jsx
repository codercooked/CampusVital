import React from 'react';
import { Hero as ShadcnHero } from '../ui/hero-1';

export default function Hero() {
  return (
    <ShadcnHero 
      title="Campus runs on data. Not guesswork."
      subtitle="CampusVitals connects every room, booking, and resource to a Databricks Genie Space — ask anything in plain English and get answers backed by real SQL against your campus data."
      eyebrow="Databricks Genie Space × Campus Intelligence"
      ctaLabel="Open Dashboard"
      ctaHref="/dashboard"
    />
  );
}
