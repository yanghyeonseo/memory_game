export type CardType = 'word' | 'meaning'

export type Card = {
  id: string
  type: CardType
  text: string
  matched: boolean
  isFlipped: boolean
  image?: string
}

export type Phase = 'setup' | 'playing' | 'finished'
export type GridMode = '6x6' | '4x9'
