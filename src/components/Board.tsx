import type { Card, MatchMode } from '../types'
import { prettyTeamName } from '../data/cards'

type Props = {
  cards: Card[]
  busy: boolean
  selectedIds: string[]
  matchedPairs: number
  currentTeam: number
  gridClass: string
  gridMinWidth: string
  matchMode: MatchMode
  onCardClick: (id: string) => void
}

export function Board({
  cards,
  busy,
  selectedIds,
  matchedPairs,
  currentTeam,
  gridClass,
  gridMinWidth,
  matchMode,
  onCardClick,
}: Props) {
  return (
    <section className="rounded-3xl border border-white/60 bg-white/80 p-4 shadow-lg backdrop-blur overflow-x-auto">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2 text-sm font-semibold text-slate-600">
        <span>차례: <span className="text-cyan-700 font-black">{prettyTeamName(currentTeam)}</span></span>
        <span>전체 카드: 36장 · 남은 쌍 {18 - matchedPairs}</span>
      </div>
      <div className={`grid ${gridClass} gap-3 ${gridMinWidth}`}>
        {cards.map((card, idx) => {
          const label = idx + 1
          const flipped = card.isFlipped || card.matched
          return (
            <button
              key={card.id}
              onClick={() => onCardClick(card.id)}
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
                  <div className="text-[60px] font-black text-cyan-700">{label}</div>
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
                            className="h-24 w-full object-contain drop-shadow-sm"
                          />
                        )}
                        <span className="text-xl font-extrabold text-cyan-800">{card.text}</span>
                      </div>
                    ) : (
                      <p
                        className={`${matchMode === 'cross' ? 'text-lg md:text-xl' : 'text-base'} font-bold leading-relaxed text-slate-800 text-center break-words whitespace-pre-line`}
                      >
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
  )
}
