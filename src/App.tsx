import { useEffect, useMemo, useState } from 'react'
import './index.css'
import type { Card, GridMode, Phase } from './types'
import { Board } from './components/Board'
import { HudSection } from './components/HudSection'
import { SetupPanel } from './components/SetupPanel'
import { MatchPopup } from './components/MatchPopup'
import { FinishedModal } from './components/FinishedModal'
import { TEAM_IDS, makeDeck } from './data/cards'

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
          <SetupPanel
            teamOrder={teamOrder}
            onOrderChange={handleOrderChange}
            canStart={canStart}
            onStart={startGame}
            gridMode={gridMode}
            onGridChange={setGridMode}
          />
        ) : (
          <>
            <Board
              cards={cards}
              busy={busy}
              selectedIds={selectedIds}
              matchedPairs={matchedPairs}
              currentTeam={currentTeam}
              gridClass={gridClass}
              gridMinWidth={gridMinWidth}
              onCardClick={handleCardClick}
            />

            <HudSection
              show={showHud}
              onToggle={() => setShowHud((v) => !v)}
              currentTeam={currentTeam}
              matchedPairs={matchedPairs}
              remainingPairs={18 - matchedPairs}
              scores={scores}
              teamOrder={teamOrder}
              phase={phase}
              busy={busy}
              onHint={handleHint}
              onRestart={restartGame}
              onBackToSetup={() => setPhase('setup')}
            />
          </>
        )}
      </main>

      {popupCard && (
        <MatchPopup
          card={popupCard}
          onClose={() => {
            setPopupCard(null)
            setBusy(false)
          }}
        />
      )}

      {phase === 'finished' && (
        <FinishedModal
          results={rankedResults}
          teamOrder={teamOrder}
          onRestart={restartGame}
          onBackToSetup={() => setPhase('setup')}
        />
      )}

      {(busy || hinting) && (
        <div className="pointer-events-auto fixed inset-0 z-30" aria-hidden />
      )}
    </div>
  )
}

export default App
