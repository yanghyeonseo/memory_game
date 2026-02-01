import { prettyTeamName } from '../data/cards'

type RankedItem = { team: number; score: number; rank: number }

type Props = {
  results: RankedItem[]
  onConfirm: () => void
}

export function FinishedModal({ results, onConfirm }: Props) {
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center modal-backdrop">
      <div className="fade-slide-up glass w-[90%] max-w-xl rounded-3xl border border-white/70 p-8 shadow-2xl text-center">
        <p className="text-sm font-bold text-emerald-600">모든 짝을 찾았어요!</p>
        <h3 className="text-3xl font-black text-slate-900">최종 순위</h3>
        <p className="mt-1 text-sm text-slate-600">동점은 공동 순위로 표시돼요.</p>
        <div className="mt-5 flex flex-col items-center gap-3">
          {results.map((item, idx) => {
            const isFirst = item.rank === 1 && (idx === 0 || results[idx - 1].score === item.score)
            return (
              <div
                key={item.team}
                className={`w-full max-w-md flex items-center justify-between rounded-2xl border px-4 py-3 shadow-sm ${
                  isFirst
                    ? 'border-amber-300 bg-amber-50/90 shadow-amber-100'
                    : 'border-slate-100 bg-white/90'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`flex h-12 w-12 items-center justify-center rounded-2xl text-lg font-black ${
                      isFirst ? 'bg-amber-400 text-white ring-4 ring-amber-200' : 'bg-cyan-100 text-cyan-700'
                    }`}
                  >
                    {item.rank}위
                  </span>
                  <p className={`text-2xl font-black ${isFirst ? 'text-amber-700' : 'text-slate-900'}`}>
                    {prettyTeamName(item.team)}
                  </p>
                </div>
                <span className="text-sm font-semibold text-slate-500">{item.score} 점</span>
              </div>
            )
          })}
        </div>
        <div className="mt-6 flex justify-center">
          <button
            onClick={onConfirm}
            className="rounded-2xl bg-cyan-500 px-5 py-3 text-sm font-black text-white shadow-lg shadow-cyan-200 transition hover:-translate-y-0.5 hover:bg-cyan-600"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  )
}
