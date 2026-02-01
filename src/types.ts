export type CardType = 'word' | 'meaning'

export type Card = {
  id: string
  type: CardType
  text: string
  matched: boolean
  isFlipped: boolean
  image?: string
  pairKey?: string
}

export type MatchPopupPayload = {
  cards: Card[]
  mode: MatchMode
}

export type Phase = 'setup' | 'playing' | 'finished'
export type MatchMode = 'homogeneous' | 'cross'
export type LayoutPreset = 'hom-6x6' | 'hom-9x4' | 'cross-6x3'
