import type { LayoutPreset } from '../types'
import { TEAM_IDS, prettyTeamName } from '../data/cards'

type Props = {
  teamOrder: number[]
  onOrderChange: (position: number, teamId: number) => void
  canStart: boolean
  onStart: () => void
  preset: LayoutPreset
  onPresetChange: (preset: LayoutPreset) => void
}

export function SetupPanel({
  teamOrder,
  onOrderChange,
  canStart,
  onStart,
  preset,
  onPresetChange,
}: Props) {
  return (
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
              onChange={(e) => onOrderChange(idx, Number(e.target.value))}
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

      <div className="mt-6 grid gap-4">
        <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4 shadow-sm">
          <p className="text-xs font-semibold text-slate-500">게임 방식 선택</p>
          <div className="mt-2 flex flex-col gap-2 text-sm font-semibold text-slate-700">
            <label className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 hover:border-cyan-200">
              <input
                type="radio"
                name="preset"
                value="hom-6x6"
                checked={preset === 'hom-6x6'}
                onChange={() => onPresetChange('hom-6x6')}
              />
              단어↔단어 / 뜻↔뜻 (6 x 6)
            </label>
            <label className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 hover:border-cyan-200">
              <input
                type="radio"
                name="preset"
                value="hom-9x4"
                checked={preset === 'hom-9x4'}
                onChange={() => onPresetChange('hom-9x4')}
              />
              단어↔단어 / 뜻↔뜻 (9 x 4)
            </label>
            <label className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 hover:border-cyan-200">
              <input
                type="radio"
                name="preset"
                value="cross-6x3"
                checked={preset === 'cross-6x3'}
                onChange={() => onPresetChange('cross-6x3')}
              />
              단어↔뜻 (6 x 3)
            </label>
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <button
          onClick={onStart}
          disabled={!canStart}
          className="rounded-2xl bg-cyan-500 px-5 py-3 text-lg font-black text-white shadow-lg shadow-cyan-200 transition hover:-translate-y-0.5 hover:bg-cyan-600 disabled:cursor-not-allowed disabled:opacity-60"
        >
          게임 시작
        </button>
      </div>
    </section>
  )
}
