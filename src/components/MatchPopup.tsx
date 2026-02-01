import type { Card } from '../types'

type Props = {
  card: Card
  onClose: () => void
}

export function MatchPopup({ card, onClose }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center modal-backdrop">
      <div className="fade-slide-up glass relative max-w-lg rounded-3xl border border-white/70 p-8 shadow-2xl">
        <p className="text-xs font-black uppercase text-cyan-600">짝 찾기 성공!</p>
        <h3 className="mt-2 text-2xl font-black text-slate-900">{card.type === 'word' ? '단어 카드' : '뜻 카드'}</h3>
        <div className="mt-4 rounded-2xl border border-cyan-100 bg-white/90 p-4 text-center shadow-inner">
          {card.type === 'word' ? (
            <div className="flex flex-col items-center gap-3">
              {card.image && (
                <img
                  src={card.image}
                  alt={card.text}
                  className="mx-auto h-28 object-contain"
                />
              )}
              <span className="text-2xl font-black text-cyan-800">{card.text}</span>
            </div>
          ) : (
            <p className="text-lg font-bold leading-relaxed text-slate-800">
              {card.text}
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
