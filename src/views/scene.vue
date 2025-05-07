<template>
  <v-main class="h-screen w-screen">
    <div class="h-full flex justify-center content-center" v-if="preparing">
      <div class="flex justify-center flex-col text-center max-w-[360px]">
        <v-progress-circular indeterminate class="mx-auto mb-3" />
        <p class="text-xl font-bold">洗牌中</p>
        <p class="opacity-50 text-sm">
          你知道吗：系统随机数根据时间生成，为了避免两边相同和让你看到我的广告位，所以还请稍等一下哦～
        </p>
      </div>
    </div>
    <div class="h-full overflow-hidden" v-else>
      <v-row class="h-full" no-gutters>
        <!-- Player 1 Side -->
        <PlayerSide
          player="player1"
          bgColor="bg-blue-100"
          :playerStatus="gameplay.playerStatus['player1']"
          :playerScores="gameplay.playerScores['player1']"
          :playerMistakes="gameplay.playerMistakes['player1']"
          :playerTimes="gameplay.playerTimes['player1']"
          :playerWords="player1Words"
          :playerSelection="player1Selection"
          :selectWord="(word) => selectWord('player1', word)"
        />

        <!-- Player 2 Side -->
        <PlayerSide
          player="player2"
          bgColor="bg-green-100"
          :playerStatus="gameplay.playerStatus['player2']"
          :playerScores="gameplay.playerScores['player2']"
          :playerMistakes="gameplay.playerMistakes['player2']"
          :playerTimes="gameplay.playerTimes['player2']"
          :playerWords="player2Words"
          :playerSelection="player2Selection"
          :selectWord="(word) => selectWord('player2', word)"
        />
      </v-row>
    </div>

    <!-- Overlay Button to Finish Game Early -->
    <div
      class="absolute top-12 left-4 right-4 flex content-center justify-center z-10000"
      v-if="!preparing && !gameplay.isFinished"
    >
      <v-btn color="red" @click="gameplay.finishGame">结束游戏</v-btn>
    </div>

    <!-- Result Dialog -->
    <v-dialog :model-value="gameplay.isFinished" max-width="520">
      <v-card title="结算" prepend-icon="mdi-check-decagram">
        <v-card-text>
          <p v-if="gameplay.whoWins !== 'tie'" class="font-bold">
            {{ gameplay.whoWins === 'player1' ? '左侧玩家 · 一号' : '右侧玩家 · 二号' }} 获胜！
          </p>
          <p v-else class="font-bold">看起来这是一场平局……</p>
          <v-divider class="my-3" />
          <div>
            <h2 class="font-bold">左侧玩家 · 一号</h2>
            <v-card border :elevation="0" class="mt-2" density="compact">
              <v-table density="compact">
                <tbody>
                  <tr>
                    <td>正确作答</td>
                    <td>{{ gameplay.playerScores['player1'] }}</td>
                  </tr>
                  <tr>
                    <td>错误作答</td>
                    <td>{{ gameplay.playerMistakes['player1'] }}</td>
                  </tr>
                  <tr>
                    <td>耗时</td>
                    <td>{{ gameplay.playerTimes['player1'] }}</td>
                  </tr>
                  <tr>
                    <td>正确率</td>
                    <td>
                      {{
                        (
                          (gameplay.playerScores['player1'] /
                            (gameplay.playerScores['player1'] +
                              gameplay.playerMistakes['player1'])) *
                          100
                        ).toFixed(1)
                      }}%
                    </td>
                  </tr>
                  <tr>
                    <td>总分</td>
                    <td>
                      {{ gameplay.playerScores['player1'] - gameplay.playerMistakes['player1'] }}
                    </td>
                  </tr>
                </tbody>
              </v-table>
            </v-card>
          </div>
          <div class="mt-6">
            <h2 class="font-bold">右侧玩家 · 二号</h2>
            <v-card border :elevation="0" class="mt-2" density="compact">
              <v-table density="compact">
                <tbody>
                  <tr>
                    <td>正确作答</td>
                    <td>{{ gameplay.playerScores['player2'] }}</td>
                  </tr>
                  <tr>
                    <td>错误作答</td>
                    <td>{{ gameplay.playerMistakes['player2'] }}</td>
                  </tr>
                  <tr>
                    <td>耗时</td>
                    <td>{{ gameplay.playerTimes['player2'] }}</td>
                  </tr>
                  <tr>
                    <td>正确率</td>
                    <td>
                      {{
                        (
                          (gameplay.playerScores['player2'] /
                            (gameplay.playerScores['player2'] +
                              gameplay.playerMistakes['player2'])) *
                          100
                        ).toFixed(1)
                      }}%
                    </td>
                  </tr>
                  <tr>
                    <td>总分</td>
                    <td>
                      {{ gameplay.playerScores['player2'] - gameplay.playerMistakes['player2'] }}
                    </td>
                  </tr>
                </tbody>
              </v-table>
            </v-card>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-btn block text @click="resetGame">结束并返回开始菜单</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-main>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import PlayerSide from '@/components/PlayerSide.vue'

import { useGameplayStore } from '@/stores/gameplay'
import type { DisplayingWord, PlayerSelection } from '@/types/selection'

const router = useRouter()
const gameplay = useGameplayStore()

const preparing = ref(true)

const player1Words = ref<DisplayingWord[]>([])
const player2Words = ref<DisplayingWord[]>([])

const player1Selection = ref<PlayerSelection>({})
const player2Selection = ref<PlayerSelection>({})

const correctSfx = new Audio('/sfx/correct.mp3')
const wrongSfx = new Audio('/sfx/wrong.mp3')

function matchWord(player: 'player1' | 'player2') {
  const selection = player === 'player1' ? player1Selection.value : player2Selection.value
  console.log(`[Gameplay] Matching word: ${selection.text} -> ${selection.translation}`)
  const originalWord = gameplay.words.filter((e) => e.text === selection.text)[0]
  if (originalWord == null) {
    clearSelection(player)
    return
  }
  if (originalWord.translation === selection.translation) {
    gameplay.addScore(player)
    console.log(`[Gameplay] Player ${player} scored!`)
    new Audio(correctSfx.src).play()

    // Disable the matched words
    if (player === 'player1')
      player1Words.value.forEach((word) => {
        if (word.text === selection.text || word.translation === selection.translation) {
          word.isDisabled = true
        }
      })
    if (player === 'player2')
      player2Words.value.forEach((word) => {
        if (word.text === selection.text || word.translation === selection.translation) {
          word.isDisabled = true
        }
      })
  } else {
    gameplay.addMistake(player)
    new Audio(wrongSfx.src).play()
    console.log(`[Gameplay] Player ${player} made a mistake!`)
  }
  clearSelection(player)
}

function selectWord(player: 'player1' | 'player2', word: DisplayingWord) {
  const selection = player === 'player1' ? player1Selection : player2Selection
  if (word.isText) {
    if (selection.value.text === word.text) {
      selection.value.text = null
    } else {
      selection.value.text = word.text
    }
  } else {
    if (selection.value.translation === word.translation) {
      selection.value.translation = null
    } else {
      selection.value.translation = word.translation
    }
  }

  if (selection.value.text != null && selection.value.translation != null) {
    matchWord(player)
  }
}

function clearSelection(player: 'player1' | 'player2') {
  const selection = player === 'player1' ? player1Selection : player2Selection
  selection.value = {
    text: null,
    translation: null,
  }
}

function resetGame() {
  gameplay.resetGame()
  router.push('/')
}

onMounted(() => {
  if (gameplay.words.length == 0) {
    router.replace('/')
    return
  }

  // Shuffle the words for each player
  const allWords = [
    ...gameplay.words.map((word) => ({
      isText: false,
      text: word.text,
      translation: word.translation,
    })),
    ...gameplay.words.map((word) => ({
      isText: true,
      text: word.text,
      translation: word.translation,
    })),
  ]

  // Shuffle the words for each player
  // Create two independent shuffled arrays with different random seeds
  // Create a promise-based shuffle with delay
  const shuffleWithDelay = async (array: DisplayingWord[], delay: number) => {
    await new Promise((resolve) => setTimeout(resolve, delay))
    const shuffled = [...array]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
  }

  // Shuffle both arrays with different delays
  Promise.all([
    shuffleWithDelay(JSON.parse(JSON.stringify(allWords)), 500),
    shuffleWithDelay(JSON.parse(JSON.stringify(allWords)), 1000),
  ]).then(([shuffled1, shuffled2]) => {
    player1Words.value = shuffled1
    player2Words.value = shuffled2
    preparing.value = false
  })

  preparing.value = true
  gameplay.startTimer('player1')
  gameplay.startTimer('player2')
})
</script>

<style scoped>
/* Add any custom styles here */
</style>
