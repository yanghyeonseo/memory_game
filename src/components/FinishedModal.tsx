import { prettyTeamName } from '../data/cards'

type RankedItem = { team: number; score: number; rank: number }

type Props = {
  results: RankedItem[]
  teamOrder: number[]
  onRestart: () => void
  onBackToSetup: () => void
}

export function FinishedModal({ results, teamOrder, onRestart, onBackToSetup }: Props) {
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center modal-backdrop">
      <div className="fade-slide-up glass w-[90%] max-w-3xl rounded-3xl border border-white/70 p-8 shadow-2xl">
        <p className="text-sm font-bold text-emerald-600">모든 짝을 찾았어요!</p>
        <h3 className="text-3xl font-black text-slate-900">최종 순위</h3>
        <p className="mt-1 text-sm text-slate-600">동점은 공동 순위로 표시돼요.</p>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {results.map((item) => (
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
            onClick={onRestart}
            className="rounded-2xl bg-emerald-500 px-5 py-3 text-sm font-black text-white shadow-lg shadow-emerald-200 transition hover:-translate-y-0.5 hover:bg-emerald-600"
          >
            다시 하기
          </button>
          <button
            onClick={onBackToSetup}
            className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-cyan-200 hover:text-cyan-700"
          >
            순서 다시 정하기
          </button>
        </div>
      </div>
    </div>
  )
}
