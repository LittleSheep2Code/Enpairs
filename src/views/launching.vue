<template>
  <v-main class="flex justify-center content-center w-screen h-screen">
    <v-container max-width="480" height="fit">
      <div class="flex flex-col gap-8">
        <div class="mb-2">
          <h1 class="text-center text-2xl font-bold">英配 Enpairs</h1>
          <p class="text-center opacity-75">英语配对小游戏 · 课堂互动助手</p>
        </div>
        <div>
          <v-card
            class="mt-2"
            title="选择一个词汇库"
            prepend-icon="mdi-book-alphabet"
            density="compact"
          >
            <v-list slim>
              <v-list-item
                v-for="wordbank in wordBanks"
                :key="wordbank.alias"
                :active="selectedWordbank === wordbank.alias"
                :append-icon="selectedWordbank === wordbank.alias ? 'mdi-check' : ''"
                @click="selectWordbank(wordbank.alias)"
              >
                <v-list-item-title>{{ wordbank.name }}</v-list-item-title>
                <v-list-item-subtitle>{{ wordbank.from }}</v-list-item-subtitle>
              </v-list-item>
            </v-list>
          </v-card>
        </div>
        <div class="w-[450px]">
          <v-number-input
            :reverse="false"
            controlVariant="default"
            label="最大词数"
            :hideInput="false"
            :inset="false"
            v-model="gameplay.settings.maxWords"
          ></v-number-input>
        </div>
        <div class="mx-auto">
          <v-btn @click="startGame" color="primary" :disabled="!canStartGame" :loading="loading"
            >开始游戏
          </v-btn>
        </div>
        <div class="text-sm opacity-50 text-center font-mono">
          Made by
          <a href="https://github.com/littlesheep2code" target="_blank" class="font-bold underline">
            @littlesheep
          </a>
          with work-overtime
          <p>
            由
            <a href="https://sn.solsynth.dev" target="_blank" class="font-bold underline">
              Solar Network / Solian
            </a>
            强力驱动
          </p>
        </div>
      </div>
    </v-container>
  </v-main>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

import { wordBanks } from '@/types/wordbank'
import { useGameplayStore } from '@/stores/gameplay'

const router = useRouter()
const gameplay = useGameplayStore()

const selectedWordbank = ref<string | null>(null)
const loading = ref(false)

const canStartGame = computed(() => {
  return selectedWordbank.value !== null
})

function selectWordbank(alias: string) {
  selectedWordbank.value = alias
}

function startGame() {
  if (selectedWordbank.value) {
    console.log(`[Gameplay] Starting game with wordbank: ${selectedWordbank.value}`)
    loading.value = true
    gameplay.loadWords(selectedWordbank.value).then(() => {
      loading.value = false
      router.push('/scene')
    })
  }
}
</script>

<style scoped>
/* Add any custom styles here */
</style>
