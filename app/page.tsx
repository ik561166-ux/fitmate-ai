import Link from "next/link";

const menuItems = [
  {
    href: "/recommend",
    eyebrow: "STYLE ADVISOR",
    title: "AI 코디 추천",
    description: "상황과 분위기에 맞는 클래식한 코디를 추천합니다.",
    icon: "♞",
  },
  {
    href: "/closet",
    eyebrow: "MY WARDROBE",
    title: "내 옷장",
    description: "가지고 있는 옷을 등록하고 나만의 옷장을 관리하세요.",
    icon: "◈",
  },
  {
    href: "/analyze",
    eyebrow: "GARMENT ANALYSIS",
    title: "사진으로 옷 분석",
    description: "옷 사진을 올려 색상, 원단, 핏을 확인해보세요.",
    icon: "◉",
  },
  {
    href: "/outfit",
    eyebrow: "CURATED LOOKS",
    title: "코디 보기",
    description: "저장한 코디와 추천 스타일을 한눈에 살펴보세요.",
    icon: "✦",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#efe8da] text-[#1f2d27]">
      <header className="border-b border-[#b7aa93] bg-[#f8f3e9]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <Link href="/" className="font-serif text-2xl font-bold tracking-wide">
            FitMate AI
          </Link>

          <div className="hidden items-center gap-8 text-sm font-semibold text-[#4e594e] md:flex">
            <Link href="/recommend" className="transition hover:text-[#102d25]">
              Style
            </Link>
            <Link href="/closet" className="transition hover:text-[#102d25]">
              Wardrobe
            </Link>
            <Link href="/analyze" className="transition hover:text-[#102d25]">
              Analysis
            </Link>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden bg-[#18372d] text-[#f7f0df]">
        <div className="absolute -right-24 top-12 h-80 w-80 rounded-full border border-[#d0b071]/25" />
        <div className="absolute -bottom-36 -left-24 h-96 w-96 rounded-full border border-[#d0b071]/20" />

        <div className="relative mx-auto grid max-w-7xl gap-12 px-6 py-20 md:grid-cols-[1.15fr_0.85fr] md:py-28">
          <div className="flex flex-col justify-center">
            <p className="text-sm font-semibold tracking-[0.28em] text-[#d5bd83]">
              PERSONAL STYLE, REFINED
            </p>

            <h1 className="mt-5 max-w-3xl font-serif text-5xl font-bold leading-tight md:text-7xl">
              클래식한 취향을
              <br />
              오늘의 코디로.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-[#ded7c8]">
              날씨, 상황, 옷장의 색감을 함께 고려해
              오래 입을수록 멋이 나는 코디를 추천합니다.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/recommend"
                className="rounded-full bg-[#d2b06d] px-7 py-4 text-center font-bold text-[#18372d] transition hover:-translate-y-0.5 hover:bg-[#e0c48a]"
              >
                오늘의 코디 추천
              </Link>

              <Link
                href="/closet"
                className="rounded-full border border-[#d9d1c0] px-7 py-4 text-center font-bold text-[#f7f0df] transition hover:bg-white/10"
              >
                내 옷장 보기
              </Link>
            </div>
          </div>

          <div className="rounded-[2rem] border border-[#d2b06d]/40 bg-[#f6efdf] p-6 text-[#213129] shadow-2xl">
            <div className="rounded-[1.5rem] border border-[#b5a98f] bg-[#e9dfcc] p-6">
              <p className="text-xs font-semibold tracking-[0.25em] text-[#6b6457]">
                TODAY'S EDIT
              </p>

              <h2 className="mt-3 font-serif text-3xl font-bold">
                Heritage Casual
              </h2>

              <div className="mt-8 space-y-5">
                <div className="flex items-center justify-between border-b border-[#c4b79e] pb-4">
                  <span className="text-sm text-[#6d675b]">TOP</span>
                  <span className="font-semibold">네이비 옥스포드 셔츠</span>
                </div>

                <div className="flex items-center justify-between border-b border-[#c4b79e] pb-4">
                  <span className="text-sm text-[#6d675b]">BOTTOM</span>
                  <span className="font-semibold">크림 치노 팬츠</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#6d675b]">SHOES</span>
                  <span className="font-semibold">브라운 로퍼</span>
                </div>
              </div>

              <div className="mt-8 rounded-2xl bg-[#18372d] p-5 text-[#f7f0df]">
                <p className="text-sm text-[#d8cfbb]">STYLE NOTE</p>
                <p className="mt-2 leading-7">
                  네이비와 크림의 대비에 브라운을 더해 차분하고 품위 있는
                  프레피 무드를 완성했습니다.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16 md:py-24">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-semibold tracking-[0.25em] text-[#8a6f3d]">
              FITMATE SERVICES
            </p>

            <h2 className="mt-3 font-serif text-4xl font-bold md:text-5xl">
              나만의 스타일 도구
            </h2>
          </div>

          <p className="max-w-xl leading-7 text-[#657067]">
            유행보다 취향을, 충동보다 조합을 중요하게 생각하는 사람을 위한
            개인 스타일 서비스입니다.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group rounded-[1.75rem] border border-[#b8aa90] bg-[#f7f1e5] p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold tracking-[0.22em] text-[#8a6f3d]">
                    {item.eyebrow}
                  </p>

                  <h3 className="mt-3 font-serif text-3xl font-bold">
                    {item.title}
                  </h3>
                </div>

                <span className="text-4xl text-[#a47d3f] transition group-hover:scale-110">
                  {item.icon}
                </span>
              </div>

              <p className="mt-5 max-w-lg leading-7 text-[#68716a]">
                {item.description}
              </p>

              <div className="mt-7 flex items-center gap-2 font-semibold text-[#18372d]">
                바로가기
                <span className="transition group-hover:translate-x-1">→</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-y border-[#b7aa93] bg-[#d8c9ae]">
        <div className="mx-auto grid max-w-7xl gap-8 px-6 py-12 md:grid-cols-3">
          <div>
            <p className="text-sm font-semibold tracking-[0.22em] text-[#6a5530]">
              WEATHER
            </p>
            <p className="mt-3 font-serif text-2xl font-bold">날씨에 맞게</p>
            <p className="mt-2 text-[#4e584f]">
              기온과 습도를 고려해 실용적인 조합을 추천합니다.
            </p>
          </div>

          <div>
            <p className="text-sm font-semibold tracking-[0.22em] text-[#6a5530]">
              COLOR
            </p>
            <p className="mt-3 font-serif text-2xl font-bold">색감은 클래식하게</p>
            <p className="mt-2 text-[#4e584f]">
              네이비, 크림, 브라운처럼 오래 가는 색을 중심으로 분석합니다.
            </p>
          </div>

          <div>
            <p className="text-sm font-semibold tracking-[0.22em] text-[#6a5530]">
              WARDROBE
            </p>
            <p className="mt-3 font-serif text-2xl font-bold">내 옷 안에서</p>
            <p className="mt-2 text-[#4e584f]">
              새 옷을 사기 전에 가진 옷으로 가능한 조합을 먼저 찾아줍니다.
            </p>
          </div>
        </div>
      </section>

      <footer className="bg-[#132a23] px-6 py-10 text-center text-sm text-[#cfc7b8]">
        <p className="font-serif text-lg font-bold text-[#f5eddd]">FitMate AI</p>
        <p className="mt-2">Classic style, thoughtfully curated.</p>
      </footer>
    </main>
  );
}