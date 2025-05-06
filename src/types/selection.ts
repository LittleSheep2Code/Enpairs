export interface PlayerSelection {
  text?: string | null
  translation?: string | null
}

export interface DisplayingWord {
  isText: boolean
  isDisabled?: boolean
  text: string
  translation: string
}
