<template>
  <v-col :cols="6" :class="bgColor" class="flex flex-col justify-center items-center px-4 pb-4">
    <div class="text-center my-6 font-mono">
      <p class="text-xl">{{ playerScores }} 分</p>
      <p>{{ playerMistakes }} 次错误 · 花费 {{ playerTimes }} 秒</p>
    </div>
    <v-expand-transition>
      <v-alert
        v-show="playerStatus === 'finished'"
        width="100%"
        max-height="48"
        flat
        type="success"
        title="已完成"
        density="compact"
        class="mb-6"
      >
      </v-alert>
    </v-expand-transition>
    <v-row cols="6" dense>
      <v-col v-for="(word, index) in playerWords" :key="index" cols="3">
        <v-card
          class="pa-3 h-full w-full flex justify-center content-center text-center"
          :disabled="word.isDisabled"
          :color="
            isWordSelected(word).value ? 'grey-darken-1' : word.isDisabled ? 'green' : undefined
          "
          :elevation="isWordSelected(word).value ? 20 : 0"
          @click="selectWord(word)"
        >
          <p class="text-lg">{{ word.isText ? word.text : word.translation }}</p>
        </v-card>
      </v-col>
    </v-row>
  </v-col>
</template>

<script setup lang="ts">
import { defineProps, computed } from 'vue'

import type { DisplayingWord, PlayerSelection } from '@/types/selection'
import type { PlayerStatus } from '@/stores/gameplay'

const props = defineProps<{
  player: String
  bgColor: String
  playerStatus: PlayerStatus
  playerScores: Number
  playerMistakes: Number
  playerTimes: Number
  playerWords: DisplayingWord[]
  playerSelection: PlayerSelection
  selectWord: (word: DisplayingWord) => void
}>()

// Use computed to derive state based on props
const isWordSelected = (word: DisplayingWord) => {
  return computed(() => {
    return word.isText
      ? props.playerSelection.text === word.text
      : props.playerSelection.translation === word.translation
  })
}
</script>
