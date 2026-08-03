import Link from "next/link";

export default function ResultPage() {
  return (
    <main className="min-h-screen bg-gray-100 px-6 py-12">
      <section className="mx-auto max-w-4xl">
        <Link
          href="/recommend"
          className="inline-flex items-center text-sm font-medium text-gray-600 transition hover:text-black"
        >
          ← 다시 선택하기
        </Link>

        <div className="mt-8 rounded-3xl bg-white p-8 shadow-xl md:p-12">
          <p className="text-sm font-semibold tracking-widest text-gray-500">
            FITMATE AI
          </p>

          <h1 className="mt-3 text-3xl font-bold md:text-4xl">
            오늘의 추천 코디
          </h1>

          <p className="mt-3 text-gray-500">
            선택한 상황과 스타일을 기준으로 코디를 추천했어요.
          </p>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            <div className="rounded-3xl border border-gray-200 p-6">
              <div className="text-5xl">👕</div>
              <p className="mt-5 text-sm font-semibold text-gray-500">상의</p>
              <h2 className="mt-1 text-xl font-bold">
                검정 옥스포드 셔츠
              </h2>
              <p className="mt-3 text-yellow-500">★★★★★</p>
            </div>

            <div className="rounded-3xl border border-gray-200 p-6">
              <div className="text-5xl">👖</div>
              <p className="mt-5 text-sm font-semibold text-gray-500">하의</p>
              <h2 className="mt-1 text-xl font-bold">
                아이보리 와이드 팬츠
              </h2>
              <p className="mt-3 text-yellow-500">★★★★★</p>
            </div>

            <div className="rounded-3xl border border-gray-200 p-6">
              <div className="text-5xl">👟</div>
              <p className="mt-5 text-sm font-semibold text-gray-500">신발</p>
              <h2 className="mt-1 text-xl font-bold">
                흰색 스니커즈
              </h2>
              <p className="mt-3 text-yellow-500">★★★★★</p>
            </div>
          </div>

          <div className="mt-8 rounded-3xl bg-black p-7 text-white">
            <p className="text-sm font-semibold text-gray-300">AI 분석</p>

            <h2 className="mt-2 text-2xl font-bold">
              깔끔하고 균형 잡힌 조합이에요.
            </h2>

            <p className="mt-4 leading-7 text-gray-300">
              검정 상의와 아이보리 하의는 명도 대비가 좋아 전체적인
              인상을 정돈해 줍니다. 흰색 스니커즈를 더하면 하의와 자연스럽게
              연결되어 가볍고 세련된 분위기가 완성됩니다.
            </p>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <Link
              href="/recommend"
              className="rounded-2xl border border-gray-300 px-6 py-4 text-center font-semibold transition hover:border-black"
            >
              다시 추천받기
            </Link>

            <Link
              href="/"
              className="rounded-2xl bg-black px-6 py-4 text-center font-semibold text-white transition hover:bg-gray-800"
            >
              홈으로 돌아가기
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}