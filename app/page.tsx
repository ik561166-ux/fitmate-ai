import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-8">
      <h1 className="mb-10 text-5xl font-bold">FitMate AI</h1>

      <div className="grid w-full max-w-xl grid-cols-2 gap-6">
        <Link
          href="/recommend"
          className="rounded-2xl bg-white p-8 text-center text-xl font-semibold shadow-lg transition hover:scale-105"
        >
          👕 AI 추천
        </Link>

        <Link
          href="/closet"
          className="rounded-2xl bg-white p-8 text-center text-xl font-semibold shadow-lg transition hover:scale-105"
        >
          👔 내 옷 등록
        </Link>

        <Link
          href="/outfit"
          className="rounded-2xl bg-white p-8 text-center text-xl font-semibold shadow-lg transition hover:scale-105"
        >
          ✨ 코디 보기
        </Link>

        <Link
          href="/analyze"
          className="rounded-2xl bg-white p-8 text-center text-xl font-semibold shadow-lg transition hover:scale-105"
        >
          📷 사진으로 옷 분석
        </Link>
      </div>
    </main>
  );
}