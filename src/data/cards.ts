import somyeongImg from '../assets/소명.png'
import jungsaengImg from '../assets/중생.png'
import hoesimImg from '../assets/회심.png'
import mideumImg from '../assets/믿음.png'
import chinguiImg from '../assets/칭의.png'
import yangjaImg from '../assets/양자.png'
import seonghwaImg from '../assets/성화.png'
import gyeoninImg from '../assets/견인.png'
import yeonghwaImg from '../assets/영화.png'
import type { Card } from '../types'

export const TEAM_IDS = [1, 2, 3, 4] as const

export const WORDS = [
  '소명',
  '중생',
  '회심',
  '믿음',
  '칭의',
  '양자',
  '성화',
  '견인',
  '영화',
]

export const MEANINGS = [
  '하나님은 내가 태어나기 전부터 나를 사랑하고 불러주셨어요.',
  '예수님을 믿으면 마음이 새로워져요.',
  '잘못된 길에서 예수님께로 방향을 바꿔요.',
  '예수님께 나의 삶과 마음을 맡겨요.',
  '예수님께서 내 죄를 대신 담당하시고, 나를 의롭다고 하셨어요.',
  '하나님은 나를 용서하신 것에서 끝나지 않고, 자녀로 받아 주셨어요.',
  '예수님을 닮아가며, 매일매일 더 거룩해져 가요.',
  '하나님이 우리를 보호해 주시고, 포기하지 않도록 지켜 주세요.',
  '예수님이 다시 오실 때, 죄가 사라지고 하나님과 영원히 함께해요.',
]

export const WORD_IMAGES: Record<string, string> = {
  소명: somyeongImg,
  중생: jungsaengImg,
  회심: hoesimImg,
  믿음: mideumImg,
  칭의: chinguiImg,
  양자: yangjaImg,
  성화: seonghwaImg,
  견인: gyeoninImg,
  영화: yeonghwaImg,
}

export const prettyTeamName = (id: number) => `${id}조`

export const makeDeck = (): Card[] => {
  const cards: Card[] = []
  WORDS.forEach((word) => {
    for (let i = 0; i < 2; i++) {
      cards.push({
        id: `word-${word}-${i}`,
        type: 'word',
        text: word,
        matched: false,
        isFlipped: false,
        image: WORD_IMAGES[word],
      })
    }
  })
  MEANINGS.forEach((meaning, index) => {
    for (let i = 0; i < 2; i++) {
      cards.push({
        id: `meaning-${index}-${i}`,
        type: 'meaning',
        text: meaning,
        matched: false,
        isFlipped: false,
      })
    }
  })

  for (let i = cards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[cards[i], cards[j]] = [cards[j], cards[i]]
  }
  return cards
}
