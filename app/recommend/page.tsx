import Link from "next/link";

const options = [
  "출근",
  "데이트",
  "백화점",
  "여행",
  "운동",
  "편하게 외출",
];

export default function RecommendPage() {
  return (
    <main className="min-h-screen bg-gray-100 px-6 py-12">
      <section className="mx-auto max-w-3xl">
        <Link
          href="/"
          className="inline-flex items-center text-sm font-medium text-gray-600 transition hover:text-black"
        >
          ← 홈으로 돌아가기
        </Link>

        <div className="mt-10 rounded-3xl bg-white p-8 shadow-lg md:p-12">
          <p className="text-sm font-semibold text-gray-500">FITMATE AI</p>

          <h1 className="mt-3 text-3xl font-bold md:text-4xl">
            오늘 어디에 가시나요?
          </h1>

          <p className="mt-3 text-gray-500">
            상황을 선택하면 날씨와 스타일을 고려해 코디를 추천해드려요.
          </p>

          <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3">
            {options.map((option) => (
              <button
                key={option}
                type="button"
                className="rounded-2xl border border-gray-200 bg-white px-4 py-5 font-semibold transition hover:-translate-y-1 hover:border-black hover:shadow-md active:scale-95"
              >
                {option}
              </button>
            ))}
          </div>

          <button
            type="button"
            className="mt-10 w-full rounded-2xl bg-black px-6 py-4 text-lg font-semibold text-white transition hover:bg-gray-800 active:scale-[0.98]"
          >
            코디 추천받기
          </button>
        </div>
      </section>
    </main>
  );
}