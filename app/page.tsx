"use client";

export default function Home() {
  const handleRecommendClick = () => {
    alert("AI 코디 추천 기능을 준비 중이에요!");
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-200">
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="text-center">
          <h1 className="text-5xl font-extrabold md:text-6xl">
            👕 FitMate AI
          </h1>

          <p className="mt-6 text-xl text-gray-600">
            AI가 당신의 옷장을 분석하고
            <br />
            오늘 가장 잘 어울리는 코디를 추천합니다.
          </p>

          <button
            type="button"
            onClick={handleRecommendClick}
            className="mt-10 rounded-full bg-black px-8 py-4 text-lg text-white transition hover:scale-105 hover:bg-gray-800 active:scale-95"
          >
            AI 코디 추천 시작하기
          </button>
        </div>

        <div className="mt-20 grid grid-cols-1 gap-8 md:grid-cols-2">
          <button
            type="button"
            onClick={() => alert("사진 분석 기능을 준비 중이에요!")}
            className="rounded-3xl bg-white p-8 text-left shadow-xl transition hover:-translate-y-1 hover:shadow-2xl"
          >
            <div className="text-5xl">📷</div>
            <h2 className="mt-4 text-2xl font-bold">사진으로 옷 분석</h2>
            <p className="mt-3 text-gray-500">
              사진을 올리면 AI가 색상, 원단, 핏을 자동으로 분석합니다.
            </p>
          </button>

          <button
            type="button"
            onClick={() => alert("내 옷장 기능을 준비 중이에요!")}
            className="rounded-3xl bg-white p-8 text-left shadow-xl transition hover:-translate-y-1 hover:shadow-2xl"
          >
            <div className="text-5xl">👔</div>
            <h2 className="mt-4 text-2xl font-bold">내 옷장</h2>
            <p className="mt-3 text-gray-500">
              가지고 있는 옷만 등록하면 AI가 조합을 추천합니다.
            </p>
          </button>

          <button
            type="button"
            onClick={() => alert("날씨 연동 기능을 준비 중이에요!")}
            className="rounded-3xl bg-white p-8 text-left shadow-xl transition hover:-translate-y-1 hover:shadow-2xl"
          >
            <div className="text-5xl">🌤️</div>
            <h2 className="mt-4 text-2xl font-bold">오늘 날씨</h2>
            <p className="mt-3 text-gray-500">
              현재 날씨에 맞는 코디를 자동 추천합니다.
            </p>
          </button>

          <button
            type="button"
            onClick={() => alert("스타일 점수 기능을 준비 중이에요!")}
            className="rounded-3xl bg-white p-8 text-left shadow-xl transition hover:-translate-y-1 hover:shadow-2xl"
          >
            <div className="text-5xl">⭐</div>
            <h2 className="mt-4 text-2xl font-bold">스타일 점수</h2>
            <p className="mt-3 text-gray-500">
              오늘 입은 코디를 AI가 100점 만점으로 평가합니다.
            </p>
          </button>
        </div>
      </section>
    </main>
  );
}