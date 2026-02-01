import type { MatchPopupPayload } from '../types'

type Props = {
  payload: MatchPopupPayload
  onClose: () => void
}

export function MatchPopup({ payload, onClose }: Props) {
  const { cards, mode } = payload
  const primary = cards[0]
  const secondary = cards[1]

  const isCross = mode === 'cross' && cards.length >= 2

  const wordCard = isCross
    ? cards.find((c) => c.type === 'word') ?? primary
    : primary
  const meaningCard = isCross
    ? cards.find((c) => c.type === 'meaning') ?? secondary ?? primary
    : secondary

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center modal-backdrop">
      <div className="fade-slide-up glass relative max-w-lg rounded-3xl border border-white/70 p-8 shadow-2xl">
        <p className="text-xs font-black uppercase text-cyan-600">짝 찾기 성공!</p>
        <h3 className="mt-2 text-2xl font-black text-slate-900">
          {isCross ? '단어 ↔ 뜻 매칭' : primary.type === 'word' ? '단어 카드' : '뜻 카드'}
        </h3>

        <div className="mt-4 grid gap-3 rounded-2xl border border-cyan-100 bg-white/90 p-4 text-center shadow-inner">
          {isCross ? (
            <>
              <div className="rounded-xl bg-cyan-50/70 p-3 flex flex-col items-center gap-2">
                {wordCard.image && (
                  <img src={wordCard.image} alt={wordCard.text} className="h-28 object-contain" />
                )}
                <span className="text-2xl font-extrabold text-cyan-800">{wordCard.text}</span>
              </div>
              <div className="rounded-xl bg-amber-50/80 p-3">
                <p className="text-xl font-bold leading-relaxed text-slate-800 text-center break-words whitespace-pre-line">
                  {meaningCard?.text}
                </p>
              </div>
            </>
          ) : primary.type === 'word' ? (
            <div className="flex flex-col items-center gap-3">
              {primary.image && (
                <img
                  src={primary.image}
                  alt={primary.text}
                  className="mx-auto h-32 object-contain"
                />
              )}
              <span className="text-3xl font-extrabold text-cyan-800">{primary.text}</span>
            </div>
          ) : (
            <p className="text-xl font-bold leading-relaxed text-slate-800 text-center break-words whitespace-pre-line">
              {primary.text}
            </p>
          )}
        </div>
        <button
          className="mt-6 w-full rounded-xl bg-cyan-500 px-4 py-3 text-sm font-black text-white shadow-lg shadow-cyan-200 transition hover:-translate-y-0.5 hover:bg-cyan-600"
          onClick={onClose}
        >
          확인하고 계속 진행하기
        </button>
      </div>
    </div>
  )
}
