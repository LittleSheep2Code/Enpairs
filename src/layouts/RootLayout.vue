<template>
  <v-app>
    <v-app-bar app fixed class="px-5">
      <v-btn icon="mdi-library" />

      <v-app-bar-title>Enpairs 英配</v-app-bar-title>

      <v-spacer />

      <v-window :model-value="promoteStage" :show-arrows="false" class="text-right">
        <v-window-item :value="0">
          <div class="text-sm pr-4 text-right">
            <p>广告位招租</p>
            <a href="mailto:lily@solsynth.dev" class="underline flex text-xs">
              欢迎写信到：
              <address class="font-mono">lily[at]solsynth[dot]dev</address></a
            >
          </div>
        </v-window-item>
        <v-window-item :value="1">
          <div class="text-sm pr-4 text-right">
            <p>看看小羊别的产品 👉 Solar Network</p>
            <a
              href="https://solsynth.dev/products/solar-network"
              class="underline flex text-xs font-mono"
              target="_blank"
            >
              sn.solsynth.dev
            </a>
          </div>
        </v-window-item>
        <v-window-item :value="1">
          <div class="text-sm pr-4 text-right">
            <p>We're hiring / 英才招募</p>
            <a
              href="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
              class="underline flex text-xs font-mono"
              target="_blank"
            >
              jobs.solsynth.dev
            </a>
          </div>
        </v-window-item>
      </v-window>
    </v-app-bar>

    <slot />
  </v-app>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'

const promoteStage = ref(0)
const maxPromoteStage = 3

onMounted(() => {
  setInterval(() => {
    promoteStage.value = (promoteStage.value + 1) % maxPromoteStage
  }, 3000)
})
</script>
