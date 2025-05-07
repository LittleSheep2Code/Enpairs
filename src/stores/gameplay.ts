import type { WordEntry } from '@/types/wordbank'
import { defineStore } from 'pinia'
import { computed, reactive, ref } from 'vue'

export interface GameplaySetting {
  maxWords: number
}

export const useGameplayStore = defineStore('gameplay', () => {
  const settings = reactive<GameplaySetting>({
    maxWords: 20,
  })

  const words = ref<WordEntry[]>([])
  const playerScores = ref<{ player1: number; player2: number }>({ player1: 0, player2: 0 })
  const playerMistakes = ref<{ player1: number; player2: number }>({ player1: 0, player2: 0 })
  const playerTimes = ref<{ player1: number; player2: number }>({ player1: 0, player2: 0 })
  let timerInterval1: number | null = null
  let timerInterval2: number | null = null

  const totalScore = computed(() => words.value.length)

  const whoWins = computed(() => {
    const player1Score = playerScores.value.player1 - playerMistakes.value.player1
    const player2Score = playerScores.value.player2 - playerMistakes.value.player2

    if (player1Score === player2Score) {
      return 'tie'
    } else {
      return player1Score > player2Score ? 'player1' : 'player2'
    }
  })

  async function loadWords(alias: string) {
    try {
      const response = await fetch(`/wordbanks/${alias}.json`)
      if (!response.ok) {
        throw new Error(`Failed to fetch words: ${response.statusText}`)
      }
      words.value = await response.json()
      cropWords()
    } catch (error) {
      console.error('Error loading words:', error)
    }
  }

  function cropWords() {
    if (words.value.length > settings.maxWords) {
      // Fisher-Yates shuffle algorithm
      for (let i = words.value.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[words.value[i], words.value[j]] = [words.value[j], words.value[i]]
      }
      words.value = words.value.slice(0, settings.maxWords)
    }
  }

  function addScore(player: 'player1' | 'player2') {
    playerScores.value[player]++
    checkCompletion(player)
  }

  function addMistake(player: 'player1' | 'player2') {
    playerMistakes.value[player]++
  }

  function resetScores() {
    playerScores.value = { player1: 0, player2: 0 }
  }

  function startTimer(player: 'player1' | 'player2') {
    if (player === 'player1') {
      if (timerInterval1) clearInterval(timerInterval1)
      timerInterval1 = setInterval(() => {
        playerTimes.value.player1 += 1
      }, 1000)
    } else {
      if (timerInterval2) clearInterval(timerInterval2)
      timerInterval2 = setInterval(() => {
        playerTimes.value.player2 += 1
      }, 1000)
    }
  }

  function stopTimer(player: 'player1' | 'player2') {
    if (player === 'player1' && timerInterval1) {
      clearInterval(timerInterval1)
      timerInterval1 = null
    } else if (player === 'player2' && timerInterval2) {
      clearInterval(timerInterval2)
      timerInterval2 = null
    }
  }

  function resetTimes() {
    playerTimes.value = { player1: 0, player2: 0 }
  }

  function checkCompletion(player: 'player1' | 'player2') {
    if (playerScores.value[player] >= totalScore.value) {
      stopTimer(player)
      console.log(`[Gameplay] Player ${player} has completed the game!`)
      if (
        playerScores.value.player1 >= totalScore.value &&
        playerScores.value.player2 >= totalScore.value
      ) {
        finishGame()
      }
    }
  }

  const isFinished = ref(false)

  function finishGame() {
    console.log('[Gameplay] Both players have completed the game!')
    isFinished.value = true
    stopTimer('player1')
    stopTimer('player2')
  }

  function resetGame() {
    words.value = []
    playerScores.value = { player1: 0, player2: 0 }
    playerMistakes.value = { player1: 0, player2: 0 }
    playerTimes.value = { player1: 0, player2: 0 }
    isFinished.value = false
    stopTimer('player1')
    stopTimer('player2')
  }

  return {
    words,
    settings,
    playerScores,
    playerMistakes,
    playerTimes,
    totalScore,
    isFinished,
    whoWins,
    loadWords,
    addScore,
    addMistake,
    resetScores,
    startTimer,
    stopTimer,
    resetTimes,
    checkCompletion,
    finishGame,
    resetGame,
  }
})
