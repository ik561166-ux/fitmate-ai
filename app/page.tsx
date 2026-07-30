export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-200">

      <section className="max-w-6xl mx-auto px-6 py-16">

        <div className="text-center">

          <h1 className="text-6xl font-extrabold">
            👕 FitMate AI
          </h1>

          <p className="mt-6 text-xl text-gray-600">
            AI가 당신의 옷장을 분석하고
            <br />
            오늘 가장 잘 어울리는 코디를 추천합니다.
          </p>

          <button className="mt-10 rounded-full bg-black px-8 py-4 text-white text-lg hover:bg-gray-800 transition">
            AI 코디 추천 시작하기
          </button>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-20">

          <div className="rounded-3xl bg-white shadow-xl p-8">

            <div className="text-5xl">
              📷
            </div>

            <h2 className="text-2xl font-bold mt-4">
              사진으로 옷 분석
            </h2>

            <p className="mt-3 text-gray-500">
              사진을 올리면 AI가 색상, 원단, 핏을 자동으로 분석합니다.
            </p>

          </div>

          <div className="rounded-3xl bg-white shadow-xl p-8">

            <div className="text-5xl">
              👔
            </div>

            <h2 className="text-2xl font-bold mt-4">
              내 옷장
            </h2>

            <p className="mt-3 text-gray-500">
              가지고 있는 옷만 등록하면 AI가 조합을 추천합니다.
            </p>

          </div>

          <div className="rounded-3xl bg-white shadow-xl p-8">

            <div className="text-5xl">
              🌤
            </div>

            <h2 className="text-2xl font-bold mt-4">
              오늘 날씨
            </h2>

            <p className="mt-3 text-gray-500">
              현재 날씨에 맞는 코디를 자동 추천합니다.
            </p>

          </div>

          <div className="rounded-3xl bg-white shadow-xl p-8">

            <div className="text-5xl">
              ⭐
            </div>

            <h2 className="text-2xl font-bold mt-4">
              스타일 점수
            </h2>

            <p className="mt-3 text-gray-500">
              오늘 입은 코디를 AI가 100점 만점으로 평가합니다.
            </p>

          </div>

        </div>

      </section>

    </main>
  );
}