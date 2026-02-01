import { TEAM_IDS, prettyTeamName } from '../data/cards'
import type { Phase } from '../types'

type Props = {
  show: boolean
  onToggle: () => void
  currentTeam: number
  matchedPairs: number
  remainingPairs: number
  scores: Record<number, number>
  teamOrder: number[]
  phase: Phase
  busy: boolean
  onHint: () => void
  onRestart: () => void
  onBackToSetup: () => void
}

export function HudSection({
  show,
  onToggle,
  currentTeam,
  matchedPairs,
  remainingPairs,
  scores,
  teamOrder,
  phase,
  busy,
  onHint,
  onRestart,
  onBackToSetup,
}: Props) {
  return (
    <>
      <div className="flex justify-end">
        <button
          onClick={onToggle}
          className="mt-3 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-cyan-200 hover:text-cyan-700"
        >
          {show ? '메뉴/점수 숨기기' : '메뉴/점수 보기'}
        </button>
      </div>

      {show && (
        <>
          <section className="rounded-3xl border border-white/60 bg-white/90 p-4 shadow-sm backdrop-blur">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="rounded-full bg-cyan-100 px-3 py-1 text-sm font-black text-cyan-800">현재 턴: {prettyTeamName(currentTeam)}</span>
                <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-bold text-green-800">맞춘 쌍 {matchedPairs} / 18</span>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700">남은 쌍 {remainingPairs}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={onHint}
                  disabled={phase !== 'playing' || busy}
                  className="rounded-xl bg-amber-400 px-3 py-2 text-xs font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-amber-500 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  🪄 힌트 0.5초
                </button>
                <button
                  onClick={onRestart}
                  className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-cyan-200 hover:text-cyan-700"
                >
                  다시 시작
                </button>
                <button
                  onClick={onBackToSetup}
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
                <p className="mt-1 text-[11px] text-slate-500">순서 {teamOrder.indexOf(teamId) + 1}번</p>
              </div>
            ))}
          </section>
        </>
      )}
    </>
  )
}
