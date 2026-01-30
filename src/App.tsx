import { useEffect, useMemo, useState } from 'react'
import './index.css'
import somyeongImg from './assets/소명.png'
import jungsaengImg from './assets/중생.png'
import hoesimImg from './assets/회심.png'
import mideumImg from './assets/믿음.png'
import chinguiImg from './assets/칭의.png'
import yangjaImg from './assets/양자.png'
import seonghwaImg from './assets/성화.png'
import gyeoninImg from './assets/견인.png'
import yeonghwaImg from './assets/영화.png'

type CardType = 'word' | 'meaning'

type Card = {
  id: string
  type: CardType
  text: string
  matched: boolean
  isFlipped: boolean
  image?: string
}

type Phase = 'setup' | 'playing' | 'finished'
type GridMode = '6x6' | '4x9'

const TEAM_IDS = [1, 2, 3, 4] as const

const WORDS = [
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

const MEANINGS = [
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

const WORD_IMAGES: Record<string, string> = {
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

const makeDeck = (): Card[] => {
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

  // Fisher-Yates shuffle
  for (let i = cards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[cards[i], cards[j]] = [cards[j], cards[i]]
  }
  return cards
}

const prettyTeamName = (id: number) => `${id}조`

function App() {
  const [phase, setPhase] = useState<Phase>('setup')
  const [teamOrder, setTeamOrder] = useState<number[]>([1, 2, 3, 4])
  const [scores, setScores] = useState<Record<number, number>>({
    1: 0,
    2: 0,
    3: 0,
    4: 0,
  })
  const [currentTurnIndex, setCurrentTurnIndex] = useState(0)
  const [cards, setCards] = useState<Card[]>([])
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [busy, setBusy] = useState(false)
  const [hinting, setHinting] = useState(false)
  const [popupCard, setPopupCard] = useState<Card | null>(null)
  const [showHud, setShowHud] = useState(true)
  const [gridMode, setGridMode] = useState<GridMode>('6x6')

  const currentTeam = teamOrder[currentTurnIndex]

  useEffect(() => {
    // Prepare a shuffled deck for the initial view even before start
    setCards(makeDeck())
  }, [])

  useEffect(() => {
    if (phase !== 'playing') return
    if (cards.length && cards.every((c) => c.matched)) {
      setPhase('finished')
      setBusy(false)
      setSelectedIds([])
    }
  }, [cards, phase])

  useEffect(() => {
    if (selectedIds.length !== 2 || phase !== 'playing') return

    const [firstId, secondId] = selectedIds
    const first = cards.find((c) => c.id === firstId)
    const second = cards.find((c) => c.id === secondId)
    if (!first || !second) return

    setBusy(true)
    const isMatch = first.type === second.type && first.text === second.text

    if (isMatch) {
      setCards((prev) =>
        prev.map((c) =>
          selectedIds.includes(c.id)
            ? { ...c, matched: true, isFlipped: true }
            : c,
        ),
      )
      const gained = first.type === 'word' ? 1 : 2
      setScores((prev) => ({ ...prev, [currentTeam]: prev[currentTeam] + gained }))

      setTimeout(() => {
        setPopupCard(first)
        setSelectedIds([])
        advanceTurn()
        // stay busy while popup is open
      }, 450)
    } else {
      setTimeout(() => {
        setCards((prev) =>
          prev.map((c) =>
            selectedIds.includes(c.id) && !c.matched
              ? { ...c, isFlipped: false }
              : c,
          ),
        )
        setSelectedIds([])
        advanceTurn()
        setBusy(false)
      }, 2000)
    }
  }, [selectedIds, phase, currentTeam])

  const advanceTurn = () => {
    setCurrentTurnIndex((prev) => (prev + 1) % teamOrder.length)
  }

  const startGame = () => {
    setScores({ 1: 0, 2: 0, 3: 0, 4: 0 })
    setCards(makeDeck())
    setSelectedIds([])
    setCurrentTurnIndex(0)
    setPhase('playing')
    setBusy(false)
    setHinting(false)
    setPopupCard(null)
  }

  const restartGame = () => {
    startGame()
  }

  const handleCardClick = (cardId: string) => {
    if (phase !== 'playing' || busy) return
    if (selectedIds.length === 2) return

    setCards((prev) =>
      prev.map((c) =>
        c.id === cardId && !c.matched ? { ...c, isFlipped: true } : c,
      ),
    )

    setSelectedIds((prev) => {
      if (prev.includes(cardId)) return prev
      return [...prev, cardId]
    })
  }

  const handleHint = () => {
    if (phase !== 'playing' || busy) return
    setBusy(true)
    setHinting(true)
    setSelectedIds([])
    setCards((prev) => prev.map((c) => ({ ...c, isFlipped: true })))
    setTimeout(() => {
      setCards((prev) =>
        prev.map((c) => (c.matched ? c : { ...c, isFlipped: false })),
      )
      setHinting(false)
      setBusy(false)
    }, 600)
  }

  const handleOrderChange = (position: number, teamId: number) => {
    setTeamOrder((prev) => {
      const next = [...prev]
      const conflictIndex = next.indexOf(teamId)
      if (conflictIndex !== -1) {
        next[conflictIndex] = next[position]
      }
      next[position] = teamId
      return next
    })
  }

  const rankedResults = useMemo(() => {
    const list = [...TEAM_IDS].sort((a, b) => scores[b] - scores[a])
    const output: { team: number; score: number; rank: number }[] = []
    let currentRank = 1
    list.forEach((team, idx) => {
      if (idx > 0 && scores[team] < scores[list[idx - 1]]) {
        currentRank = idx + 1
      }
      output.push({ team, score: scores[team], rank: currentRank })
    })
    return output
  }, [scores])

  const matchedPairs = cards.filter((c) => c.matched).length / 2

  const canStart = new Set(teamOrder).size === TEAM_IDS.length

  const gridClass =
    gridMode === '6x6'
      ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6'
      : 'grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-9'

  const gridMinWidth = gridMode === '4x9' ? 'min-w-[1356px]' : ''

  return (
    <div className="min-h-screen pb-12 text-slate-900">
      <main className="relative z-10 mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 md:px-6 pt-8">
        {phase === 'setup' ? (
          <section className="rounded-3xl bg-white/90 shadow-lg backdrop-blur-md border border-white/60 p-6 md:p-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="inline-flex items-center gap-2 rounded-full bg-cyan-50 px-3 py-1 text-sm font-semibold text-cyan-700">
                  시작 준비
                </p>
                <h1 className="mt-2 text-3xl md:text-4xl font-black text-slate-900">게임 시작 전 순서 정하기</h1>
                <p className="mt-2 text-sm text-slate-600">4개 조의 진행 순서를 정하고 “게임 시작”을 눌러주세요. 단어끼리 / 뜻끼리만 맞춥니다.</p>
                <div className="mt-3 flex flex-wrap gap-2 text-xs font-semibold">
                  <span className="rounded-full bg-cyan-100 px-3 py-1 text-cyan-800">✅ 단어↔단어 / 문장↔문장 매칭</span>
                  <span className="rounded-full bg-amber-100 px-3 py-1 text-amber-900">⏱️ 실패 시 2초 뒤집힘</span>
                  <span className="rounded-full bg-pink-100 px-3 py-1 text-pink-900">🪄 힌트 0.5초 전체 공개</span>
                </div>
              </div>
              <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm">
                순서를 모두 다르게 선택해야 시작할 수 있어요.
              </div>
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {teamOrder.map((teamId, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-slate-200 bg-slate-50/60 p-3 shadow-sm"
                >
                  <p className="text-xs font-semibold text-slate-500">차례 {idx + 1}</p>
                  <select
                    className="mt-1 w-full rounded-xl border border-cyan-200 bg-white px-3 py-2 text-base font-bold text-cyan-700 outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-200"
                    value={teamId}
                    onChange={(e) => handleOrderChange(idx, Number(e.target.value))}
                  >
                    {TEAM_IDS.map((id) => (
                      <option key={id} value={id}>
                        {prettyTeamName(id)}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4 shadow-sm">
                <p className="text-xs font-semibold text-slate-500">배치 선택</p>
                <div className="mt-2 flex flex-col gap-2 text-sm font-semibold text-slate-700">
                  <label className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 hover:border-cyan-200">
                    <input
                      type="radio"
                      name="grid"
                      value="6x6"
                      checked={gridMode === '6x6'}
                      onChange={() => setGridMode('6x6')}
                    />
                    6 x 6 (정사각형)
                  </label>
                  <label className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 hover:border-cyan-200">
                    <input
                      type="radio"
                      name="grid"
                      value="4x9"
                      checked={gridMode === '4x9'}
                      onChange={() => setGridMode('4x9')}
                    />
                    4 x 9 (가로 9칸)
                  </label>
                </div>
              </div>
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <button
                onClick={startGame}
                disabled={!canStart}
                className="rounded-2xl bg-cyan-500 px-5 py-3 text-lg font-black text-white shadow-lg shadow-cyan-200 transition hover:-translate-y-0.5 hover:bg-cyan-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                게임 시작
              </button>
            </div>
          </section>
        ) : (
          <>
            <section className="rounded-3xl border border-white/60 bg-white/80 p-4 shadow-lg backdrop-blur overflow-x-auto">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2 text-sm font-semibold text-slate-600">
                <span>차례: <span className="text-cyan-700 font-black">{prettyTeamName(currentTeam)}</span></span>
                <span>전체 카드: 36장 · 남은 쌍 {18 - matchedPairs}</span>
              </div>
              <div className={`grid ${gridClass} gap-3 ${gridMinWidth}`}>
                {cards.map((card) => {
                  const flipped = card.isFlipped || card.matched
                  return (
                    <button
                      key={card.id}
                      onClick={() => handleCardClick(card.id)}
                      disabled={busy || card.matched || selectedIds.includes(card.id)}
                      className={`card-3d group relative w-full aspect-square min-h-[120px] md:min-h-[140px] rounded-2xl text-left transition focus:outline-none ${
                        card.matched
                          ? 'cursor-default border-2 border-emerald-300 bg-emerald-50'
                          : 'hover:-translate-y-1 hover:shadow-lg'
                      } ${busy ? 'cursor-not-allowed' : ''} ${flipped ? 'card-flipped' : ''}`}
                    >
                      <div
                        className={`card-inner h-full w-full rounded-2xl ${flipped ? 'is-flipped' : ''}`}
                      >
                        <div className="card-face absolute inset-0 flex h-full w-full flex-col justify-center rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 p-4 text-center shadow-sm">
                          <div className="flex flex-1 items-center justify-center">
                            <div className="text-xl font-black text-slate-500">?
                            </div>
                          </div>
                          <p className="text-[11px] font-semibold text-slate-500">뒤집어 보세요</p>
                        </div>

                        <div
                          className={`card-face card-back absolute inset-0 flex h-full w-full flex-col rounded-2xl border-2 ${
                            card.type === 'word'
                              ? 'border-cyan-300 bg-cyan-50'
                              : 'border-amber-300 bg-amber-50'
                          } p-3 shadow-md`}
                        >
                          <div className="flex items-center justify-end text-[11px] font-extrabold uppercase tracking-wide text-slate-500">
                            {card.matched && (
                              <span className="rounded-full bg-emerald-500 px-2 py-1 text-[10px] font-black text-white">
                                MATCH!
                              </span>
                            )}
                          </div>
                          <div className="mt-1 flex flex-1 items-center justify-center">
                            {card.type === 'word' ? (
                              <div className="flex flex-col items-center gap-2 text-center">
                                {card.image && (
                                  <img
                                    src={card.image}
                                    alt={card.text}
                                    className="h-16 w-full object-contain drop-shadow-sm"
                                  />
                                )}
                                <span className="text-lg font-black text-cyan-800">{card.text}</span>
                              </div>
                            ) : (
                              <p className="text-sm font-bold leading-snug text-slate-800">
                                {card.text}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>
            </section>

            <div className="flex justify-end">
              <button
                onClick={() => setShowHud((v) => !v)}
                className="mt-3 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-cyan-200 hover:text-cyan-700"
              >
                {showHud ? '메뉴/점수 숨기기' : '메뉴/점수 보기'}
              </button>
            </div>

            {showHud && (
              <>
                <section className="rounded-3xl border border-white/60 bg-white/90 p-4 shadow-sm backdrop-blur">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="rounded-full bg-cyan-100 px-3 py-1 text-sm font-black text-cyan-800">현재 턴: {prettyTeamName(currentTeam)}</span>
                      <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-bold text-green-800">맞춘 쌍 {matchedPairs} / 18</span>
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700">남은 쌍 {18 - matchedPairs}</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={handleHint}
                        disabled={phase !== 'playing' || busy}
                        className="rounded-xl bg-amber-400 px-3 py-2 text-xs font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-amber-500 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        🪄 힌트 0.5초
                      </button>
                      <button
                        onClick={restartGame}
                        className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-cyan-200 hover:text-cyan-700"
                      >
                        다시 시작
                      </button>
                      <button
                        onClick={() => setPhase('setup')}
                        className="rounded-xl border border-cyan-200 bg-cyan-50 px-3 py-2 text-xs font-semibold text-cyan-700 shadow-sm transition hover:-translate-y-0.5 hover:border-cyan-300"
                      >
                        순서 다시 정하기
                      </button>
                    </div>
                  </div>
                </section>

                <section className="grid gap-3 md:grid-cols-4">
                  {TEAM_IDS.map((teamId) => (
                    <div
                      key={teamId}
                      className={`rounded-2xl border p-4 shadow-sm transition ${
                        currentTeam === teamId
                          ? 'border-cyan-400 bg-white/90 shadow-cyan-100'
                          : 'border-slate-100 bg-white/80'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-100 text-lg font-black text-cyan-700">
                            {teamId}
                          </span>
                          <div>
                            <p className="text-sm font-semibold text-slate-500">팀</p>
                            <p className="text-lg font-black text-slate-900">{prettyTeamName(teamId)}</p>
                          </div>
                        </div>
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-extrabold text-slate-700">
                          {scores[teamId]} 점
                        </span>
                      </div>
                    </div>
                  ))}
                </section>
              </>
            )}
          </>
        )}
      </main>

      {/* Match popup */}
      {popupCard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center modal-backdrop">
          <div className="fade-slide-up glass relative max-w-lg rounded-3xl border border-white/70 p-8 shadow-2xl">
            <p className="text-xs font-black uppercase text-cyan-600">짝 찾기 성공!</p>
            <h3 className="mt-2 text-2xl font-black text-slate-900">{popupCard.type === 'word' ? '단어 카드' : '뜻 카드'}</h3>
            <div className="mt-4 rounded-2xl border border-cyan-100 bg-white/90 p-4 text-center shadow-inner">
              {popupCard.type === 'word' ? (
                <div className="flex flex-col items-center gap-3">
                  {popupCard.image && (
                    <img
                      src={popupCard.image}
                      alt={popupCard.text}
                      className="mx-auto h-28 object-contain"
                    />
                  )}
                  <span className="text-2xl font-black text-cyan-800">{popupCard.text}</span>
                </div>
              ) : (
                <p className="text-lg font-bold leading-relaxed text-slate-800">
                  {popupCard.text}
                </p>
              )}
            </div>
            <button
              className="mt-6 w-full rounded-xl bg-cyan-500 px-4 py-3 text-sm font-black text-white shadow-lg shadow-cyan-200 transition hover:-translate-y-0.5 hover:bg-cyan-600"
              onClick={() => {
                setPopupCard(null)
                setBusy(false)
              }}
            >
              확인하고 계속 진행하기
            </button>
          </div>
        </div>
      )}

      {/* Game finished */}
      {phase === 'finished' && (
        <div className="fixed inset-0 z-40 flex items-center justify-center modal-backdrop">
          <div className="fade-slide-up glass w-[90%] max-w-3xl rounded-3xl border border-white/70 p-8 shadow-2xl">
            <p className="text-sm font-bold text-emerald-600">모든 짝을 찾았어요!</p>
            <h3 className="text-3xl font-black text-slate-900">최종 순위</h3>
            <p className="mt-1 text-sm text-slate-600">동점은 공동 순위로 표시돼요.</p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {rankedResults.map((item) => (
                <div
                  key={item.team}
                  className="flex items-center justify-between rounded-2xl border border-slate-100 bg-white/90 px-4 py-3 shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-cyan-100 text-lg font-black text-cyan-700">
                      {item.rank}위
                    </span>
                    <div>
                      <p className="text-xs font-semibold text-slate-500">{prettyTeamName(item.team)}</p>
                      <p className="text-lg font-black text-slate-900">{item.score} 점</p>
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-slate-500">턴 순서 {teamOrder.indexOf(item.team) + 1}번</span>
                </div>
              ))}
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <button
                onClick={restartGame}
                className="rounded-2xl bg-emerald-500 px-5 py-3 text-sm font-black text-white shadow-lg shadow-emerald-200 transition hover:-translate-y-0.5 hover:bg-emerald-600"
              >
                다시 하기
              </button>
              <button
                onClick={() => setPhase('setup')}
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-cyan-200 hover:text-cyan-700"
              >
                순서 다시 정하기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Input blocker while busy */}
      {(busy || hinting) && (
        <div className="pointer-events-auto fixed inset-0 z-30" aria-hidden />
      )}
    </div>
  )
}

export default App
