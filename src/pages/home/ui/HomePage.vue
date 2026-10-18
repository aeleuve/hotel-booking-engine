<template>
  <q-page>
    <HeroSection />
    <PriceStrip />
    <AvailabilityResults />
    <RoomsSection />
    <OffersSection />
    <ServicesSection />
    <LocationSection />
    <ReviewsSection />
    <FaqSection />
  </q-page>
</template>

<script setup lang="ts">
import { PriceStrip } from 'src/features/flexible-search'
import { AvailabilityResults } from 'src/widgets/availability-results'
import { FaqSection } from 'src/widgets/faq-section'
import { HeroSection } from 'src/widgets/hero'
import { LocationSection } from 'src/widgets/location-section'
import { OffersSection } from 'src/widgets/offers-section'
import { ReviewsSection } from 'src/widgets/reviews-section'
import { RoomsSection } from 'src/widgets/rooms-section'
import { ServicesSection } from 'src/widgets/services-section'
</script>
