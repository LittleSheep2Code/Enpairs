export interface WordEntry {
  text?: string
  type?: string
  translation?: string
  asterisk?: boolean
}

export interface WordBankRecord {
  alias: string
  name: string
  from: string
  words: Record<string, WordEntry>
}

export const wordBanks: WordBankRecord[] = [
  {
    alias: 'nj-8b-unit4',
    name: 'Unit 4 · 卡通和漫画',
    from: '牛津版 八年级下',
    words: {}
  },
  {
    alias: 'nj-8b-unit5',
    name: 'Unit 5 · 拯救濒危动物',
    from: '牛津版 八年级下',
    words: {}
  }
]
