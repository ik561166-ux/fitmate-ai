import Link from "next/link";

const recommendations = {
  출근: {
    top: "네이비 셔츠",
    bottom: "차콜 슬랙스",
    shoes: "검정 로퍼",
    title: "단정하고 신뢰감 있는 출근 코디",
    description:
      "네이비와 차콜 조합은 차분하고 깔끔한 인상을 줍니다. 검정 로퍼를 더하면 전체적인 분위기가 정돈돼 출근용으로 잘 어울려요.",
  },
  데이트: {
    top: "검정 옥스포드 셔츠",
    bottom: "아이보리 와이드 팬츠",
    shoes: "흰색 스니커즈",
    title: "깔끔하고 세련된 데이트 코디",
    description:
      "검정 상의와 아이보리 하의의 대비가 또렷해서 인상이 정돈돼 보입니다. 흰색 스니커즈를 더하면 부담 없이 세련된 분위기가 완성돼요.",
  },
  백화점: {
    top: "오프화이트 니트",
    bottom: "검정 슬랙스",
    shoes: "독일군 스니커즈",
    title: "고급스럽고 편안한 백화점 코디",
    description:
      "오프화이트와 검정 조합은 깔끔하면서도 고급스러운 느낌을 줍니다. 오래 걸어도 편한 스니커즈를 매치해 실용성도 챙겼어요.",
  },
  여행: {
    top: "린넨 셔츠",
    bottom: "베이지 반바지",
    shoes: "뉴발란스 스니커즈",
    title: "가볍고 편안한 여행 코디",
    description:
      "통기성이 좋은 린넨 셔츠와 편안한 반바지 조합입니다. 활동량이 많은 여행을 고려해 쿠션감 있는 스니커즈를 추천해요.",
  },
  운동: {
    top: "기능성 반팔 티셔츠",
    bottom: "검정 조거팬츠",
    shoes: "러닝화",
    title: "활동성과 편안함을 살린 운동 코디",
    description:
      "땀 배출이 빠른 기능성 상의와 움직임이 편한 조거팬츠 조합입니다. 운동 종류에 맞는 러닝화를 더하면 실용적인 착장이 완성돼요.",
  },
  "편하게 외출": {
    top: "화이트 오버핏 티셔츠",
    bottom: "그레이 스웨트팬츠",
    shoes: "흰색 스니커즈",
    title: "꾸안꾸 느낌의 편안한 외출 코디",
    description:
      "화이트 티셔츠와 그레이 팬츠는 편안하면서도 깔끔한 조합입니다. 흰색 스니커즈를 더하면 너무 집 앞 차림처럼 보이지 않아요.",
  },
};

type Situation = keyof typeof recommendations;

export default async function ResultPage({
  searchParams,
}: {
  searchParams: Promise<{
    situation?: string | string[];
  }>;
}) {
  const params = await searchParams;

  const rawSituation = Array.isArray(params.situation)
    ? params.situation[0]
    : params.situation;

  const situation: Situation =
    rawSituation && rawSituation in recommendations
      ? (rawSituation as Situation)
      : "데이트";

  const result = recommendations[situation];

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

          <p className="mt-4 inline-block rounded-full bg-gray-100 px-4 py-2 text-sm font-semibold">
            선택한 상황: {situation}
          </p>

          <h1 className="mt-5 text-3xl font-bold md:text-4xl">
            {result.title}
          </h1>

          <p className="mt-3 text-gray-500">
            선택한 상황을 기준으로 코디를 추천했어요.
          </p>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            <div className="rounded-3xl border border-gray-200 p-6">
              <div className="text-5xl">👕</div>
              <p className="mt-5 text-sm font-semibold text-gray-500">상의</p>
              <h2 className="mt-1 text-xl font-bold">{result.top}</h2>
              <p className="mt-3">★★★★★</p>
            </div>

            <div className="rounded-3xl border border-gray-200 p-6">
              <div className="text-5xl">👖</div>
              <p className="mt-5 text-sm font-semibold text-gray-500">하의</p>
              <h2 className="mt-1 text-xl font-bold">{result.bottom}</h2>
              <p className="mt-3">★★★★★</p>
            </div>

            <div className="rounded-3xl border border-gray-200 p-6">
              <div className="text-5xl">👟</div>
              <p className="mt-5 text-sm font-semibold text-gray-500">신발</p>
              <h2 className="mt-1 text-xl font-bold">{result.shoes}</h2>
              <p className="mt-3">★★★★★</p>
            </div>
          </div>

          <div className="mt-8 rounded-3xl bg-black p-7 text-white">
            <p className="text-sm font-semibold text-gray-300">AI 분석</p>

            <h2 className="mt-2 text-2xl font-bold">{result.title}</h2>

            <p className="mt-4 leading-7 text-gray-300">
              {result.description}
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