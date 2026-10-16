<template>
  <q-layout view="hHh lpR fff">
    <SiteHeader />
    <q-page-container>
      <router-view />
    </q-page-container>
    <SiteFooter />
    <SyrivoChatBridge />
  </q-layout>
</template>

<script setup lang="ts">
import { useHotelStore } from 'src/entities/hotel'
import { SyrivoChatBridge } from 'src/features/syrivo-chat'
import { SiteFooter } from 'src/widgets/site-footer'
import { SiteHeader } from 'src/widgets/site-header'

void useHotelStore().load()
</script>
