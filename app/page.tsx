"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type ClothingItem = {
  id: number;
  category: string;
  name: string;
};

type WeatherData = {
  temperature: number;
  apparentTemperature: number;
  humidity: number;
  weatherCode: number;
};

const STORAGE_KEY = "fitmate-closet-items";

const dashboardMenus = [
  {
    href: "/recommend",
    eyebrow: "STYLE ADVISOR",
    title: "상황별 코디 추천",
    description: "데이트, 출근, 여행 등 오늘의 상황에 맞게 추천받으세요.",
    icon: "♞",
  },
  {
    href: "/closet",
    eyebrow: "MY WARDROBE",
    title: "내 옷장 관리",
    description: "가지고 있는 옷을 등록하고 삭제할 수 있어요.",
    icon: "◈",
  },
  {
    href: "/closet-recommend",
    eyebrow: "WEATHER & WARDROBE",
    title: "날씨 맞춤 옷장 추천",
    description: "현재 날씨와 내 옷장을 함께 반영해 코디를 조합합니다.",
    icon: "◇",
  },
  {
    href: "/analyze",
    eyebrow: "GARMENT ANALYSIS",
    title: "사진으로 옷 분석",
    description: "옷 사진을 올리고 색상, 소재와 핏을 분석해보세요.",
    icon: "◉",
  },
];

function getWeatherDescription(code: number) {
  if (code === 0) return "맑음";
  if ([1, 2].includes(code)) return "대체로 맑음";
  if (code === 3) return "흐림";
  if ([45, 48].includes(code)) return "안개";
  if ([51, 53, 55, 56, 57].includes(code)) return "이슬비";
  if ([61, 63, 65, 66, 67].includes(code)) return "비";
  if ([71, 73, 75, 77, 85, 86].includes(code)) return "눈";
  if ([80, 81, 82].includes(code)) return "소나기";
  if ([95, 96, 99].includes(code)) return "뇌우";

  return "날씨 정보";
}

function getWeatherIcon(code: number) {
  if (code === 0) return "☀️";
  if ([1, 2].includes(code)) return "🌤️";
  if (code === 3) return "☁️";
  if ([45, 48].includes(code)) return "🌫️";

  if (
    [51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82].includes(
      code,
    )
  ) {
    return "🌧️";
  }

  if ([71, 73, 75, 77, 85, 86].includes(code)) return "❄️";
  if ([95, 96, 99].includes(code)) return "⛈️";

  return "🌤️";
}

function getStyleAdvice(temperature: number, weatherCode: number) {
  const rainyCodes = [
    51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82, 95, 96, 99,
  ];

  const isRainy = rainyCodes.includes(weatherCode);

  if (temperature >= 30) {
    return isRainy
      ? "덥고 비가 올 수 있어요. 통기성이 좋고 빨리 마르는 옷을 추천해요."
      : "매우 더운 날이에요. 반팔, 반바지와 린넨 소재가 잘 맞아요.";
  }

  if (temperature >= 23) {
    return isRainy
      ? "가벼운 셔츠와 물에 강한 신발을 매치해보세요."
      : "반팔이나 얇은 셔츠를 입기 좋은 날씨예요.";
  }

  if (temperature >= 16) {
    return "긴팔 셔츠나 얇은 니트에 가벼운 재킷을 준비해보세요.";
  }

  if (temperature >= 8) {
    return "니트와 재킷, 긴바지처럼 보온성을 갖춘 코디가 좋아요.";
  }

  return "코트나 패딩처럼 따뜻한 아우터가 필요한 날씨예요.";
}

export default function Home() {
  const [items, setItems] = useState<ClothingItem[]>([]);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isWeatherLoading, setIsWeatherLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const savedItems = localStorage.getItem(STORAGE_KEY);

    if (savedItems) {
      try {
        setItems(JSON.parse(savedItems));
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }

    setIsLoaded(true);
  }, []);

  const loadWeather = () => {
    setIsWeatherLoading(true);
    setErrorMessage("");

    if (!navigator.geolocation) {
      setErrorMessage("현재 브라우저에서는 위치 정보를 사용할 수 없어요.");
      setIsWeatherLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;

          const response = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,apparent_temperature,relative_humidity_2m,weather_code&timezone=auto`,
          );

          if (!response.ok) {
            throw new Error("날씨 요청 실패");
          }

          const data = await response.json();

          setWeather({
            temperature: data.current.temperature_2m,
            apparentTemperature: data.current.apparent_temperature,
            humidity: data.current.relative_humidity_2m,
            weatherCode: data.current.weather_code,
          });
        } catch {
          setErrorMessage("날씨 정보를 불러오는 중 오류가 발생했어요.");
        } finally {
          setIsWeatherLoading(false);
        }
      },
      () => {
        setErrorMessage(
          "현재 위치의 날씨를 확인하려면 위치 권한을 허용해주세요.",
        );
        setIsWeatherLoading(false);
      },
    );
  };

  const categoryCount = (category: string) =>
    items.filter((item) => item.category === category).length;

  const recentItems = [...items].reverse().slice(0, 3);

  return (
    <main className="min-h-screen bg-[#eee6d8] text-[#1d2c25]">
      <header className="border-b border-[#b9aa90] bg-[#f8f2e7]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <Link href="/" className="font-serif text-2xl font-bold tracking-wide">
            FitMate AI
          </Link>

          <nav className="hidden items-center gap-8 text-sm font-semibold text-[#59635b] md:flex">
            <Link href="/recommend" className="hover:text-[#18372d]">
              Style
            </Link>

            <Link href="/closet" className="hover:text-[#18372d]">
              Wardrobe
            </Link>

            <Link href="/closet-recommend" className="hover:text-[#18372d]">
              Recommendation
            </Link>

            <Link href="/analyze" className="hover:text-[#18372d]">
              Analysis
            </Link>
          </nav>
        </div>
      </header>

      <section className="bg-[#18372d] text-[#f8f1e2]">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 py-16 lg:grid-cols-[1.15fr_0.85fr] lg:py-20">
          <div className="flex flex-col justify-center">
            <p className="text-sm font-semibold tracking-[0.28em] text-[#d3b16c]">
              YOUR PERSONAL STYLE DASHBOARD
            </p>

            <h1 className="mt-5 max-w-3xl font-serif text-5xl font-bold leading-tight md:text-7xl">
              오늘의 날씨와
              <br />
              내 옷장을 한눈에.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-[#ddd5c5]">
              등록한 옷과 현재 날씨를 바탕으로 오늘 입기 좋은 조합을
              찾아보세요.
            </p>

            <div className="mt-9 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/closet-recommend"
                className="rounded-full bg-[#d3b16c] px-7 py-4 text-center font-bold text-[#18372d] transition hover:-translate-y-0.5 hover:bg-[#e2c789]"
              >
                오늘의 코디 추천
              </Link>

              <Link
                href="/closet"
                className="rounded-full border border-[#d9d0bf] px-7 py-4 text-center font-bold transition hover:bg-white/10"
              >
                옷 등록하기
              </Link>
            </div>
          </div>

          <div className="rounded-[2rem] border border-[#d3b16c]/40 bg-[#f5eddd] p-6 text-[#1d2c25] shadow-2xl">
            <div className="rounded-[1.5rem] border border-[#b9aa90] bg-[#e7dbc5] p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold tracking-[0.24em] text-[#746b5c]">
                    TODAY&apos;S WEATHER
                  </p>

                  <h2 className="mt-3 font-serif text-3xl font-bold">
                    오늘의 스타일 날씨
                  </h2>
                </div>

                <div className="text-5xl">
                  {weather ? getWeatherIcon(weather.weatherCode) : "🌤️"}
                </div>
              </div>

              {!weather ? (
                <div className="mt-8">
                  <p className="leading-7 text-[#625e54]">
                    현재 위치를 확인하면 날씨에 맞는 옷차림 조언을
                    보여드려요.
                  </p>

                  <button
                    type="button"
                    onClick={loadWeather}
                    disabled={isWeatherLoading}
                    className="mt-6 w-full rounded-full bg-[#18372d] px-6 py-4 font-bold text-[#f8f1e2] transition hover:bg-[#244b3f] disabled:cursor-wait disabled:opacity-60"
                  >
                    {isWeatherLoading
                      ? "날씨 확인 중..."
                      : "현재 날씨 확인하기"}
                  </button>
                </div>
              ) : (
                <div className="mt-8">
                  <div className="flex items-end gap-3">
                    <p className="font-serif text-6xl font-bold">
                      {Math.round(weather.temperature)}°
                    </p>

                    <p className="pb-2 text-lg font-semibold text-[#5f5b51]">
                      {getWeatherDescription(weather.weatherCode)}
                    </p>
                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-4">
                    <div className="rounded-2xl bg-[#f8f2e7] p-4">
                      <p className="text-xs text-[#786f61]">체감온도</p>
                      <p className="mt-1 font-serif text-2xl font-bold">
                        {Math.round(weather.apparentTemperature)}°
                      </p>
                    </div>

                    <div className="rounded-2xl bg-[#f8f2e7] p-4">
                      <p className="text-xs text-[#786f61]">습도</p>
                      <p className="mt-1 font-serif text-2xl font-bold">
                        {weather.humidity}%
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 rounded-2xl bg-[#18372d] p-5 text-[#f8f1e2]">
                    <p className="text-xs font-semibold tracking-[0.2em] text-[#d3b16c]">
                      STYLE NOTE
                    </p>

                    <p className="mt-3 leading-7 text-[#ddd5c5]">
                      {getStyleAdvice(
                        weather.temperature,
                        weather.weatherCode,
                      )}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={loadWeather}
                    disabled={isWeatherLoading}
                    className="mt-5 w-full rounded-full border border-[#988b74] px-5 py-3 font-semibold transition hover:border-[#18372d] disabled:opacity-60"
                  >
                    날씨 새로고침
                  </button>
                </div>
              )}

              {errorMessage && (
                <div className="mt-5 rounded-2xl border border-[#9e5e50] bg-[#f5e6df] p-4 text-sm text-[#7a342c]">
                  {errorMessage}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-3xl border border-[#b9aa90] bg-[#f8f2e7] p-6">
            <p className="text-xs font-semibold tracking-[0.2em] text-[#8a6e39]">
              TOTAL ITEMS
            </p>
            <p className="mt-3 font-serif text-4xl font-bold">
              {isLoaded ? items.length : 0}
            </p>
            <p className="mt-2 text-sm text-[#687169]">등록된 전체 옷</p>
          </div>

          <div className="rounded-3xl border border-[#b9aa90] bg-[#f8f2e7] p-6">
            <p className="text-xs font-semibold tracking-[0.2em] text-[#8a6e39]">
              TOPS
            </p>
            <p className="mt-3 font-serif text-4xl font-bold">
              {categoryCount("상의")}
            </p>
            <p className="mt-2 text-sm text-[#687169]">등록된 상의</p>
          </div>

          <div className="rounded-3xl border border-[#b9aa90] bg-[#f8f2e7] p-6">
            <p className="text-xs font-semibold tracking-[0.2em] text-[#8a6e39]">
              BOTTOMS
            </p>
            <p className="mt-3 font-serif text-4xl font-bold">
              {categoryCount("하의")}
            </p>
            <p className="mt-2 text-sm text-[#687169]">등록된 하의</p>
          </div>

          <div className="rounded-3xl border border-[#b9aa90] bg-[#f8f2e7] p-6">
            <p className="text-xs font-semibold tracking-[0.2em] text-[#8a6e39]">
              SHOES
            </p>
            <p className="mt-3 font-serif text-4xl font-bold">
              {categoryCount("신발")}
            </p>
            <p className="mt-2 text-sm text-[#687169]">등록된 신발</p>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-6 pb-16 lg:grid-cols-[0.85fr_1.15fr]">
        <div className="rounded-[2rem] border border-[#b9aa90] bg-[#f8f2e7] p-7">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-xs font-semibold tracking-[0.2em] text-[#8a6e39]">
                RECENT WARDROBE
              </p>

              <h2 className="mt-3 font-serif text-3xl font-bold">
                최근 등록한 옷
              </h2>
            </div>

            <Link
              href="/closet"
              className="text-sm font-semibold text-[#18372d] hover:underline"
            >
              전체 보기
            </Link>
          </div>

          {recentItems.length === 0 ? (
            <div className="mt-7 rounded-3xl border border-dashed border-[#b9aa90] bg-[#eee4d3] p-8 text-center">
              <p className="font-serif text-xl font-bold">
                아직 등록된 옷이 없어요.
              </p>

              <Link
                href="/closet"
                className="mt-5 inline-block rounded-full bg-[#18372d] px-6 py-3 font-bold text-[#f8f1e2]"
              >
                첫 옷 등록하기
              </Link>
            </div>
          ) : (
            <div className="mt-7 space-y-3">
              {recentItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between rounded-2xl border border-[#c5b69d] bg-white p-4"
                >
                  <span className="text-xs font-semibold tracking-[0.18em] text-[#8a6e39]">
                    {item.category}
                  </span>

                  <span className="font-serif text-lg font-bold">
                    {item.name}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <div>
            <p className="text-xs font-semibold tracking-[0.22em] text-[#8a6e39]">
              FITMATE SERVICES
            </p>

            <h2 className="mt-3 font-serif text-4xl font-bold">
              스타일 도구
            </h2>
          </div>

          <div className="mt-7 grid gap-5 sm:grid-cols-2">
            {dashboardMenus.map((menu) => (
              <Link
                key={menu.href}
                href={menu.href}
                className="group rounded-[1.75rem] border border-[#b9aa90] bg-[#f8f2e7] p-6 transition hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-semibold tracking-[0.18em] text-[#8a6e39]">
                      {menu.eyebrow}
                    </p>

                    <h3 className="mt-3 font-serif text-2xl font-bold">
                      {menu.title}
                    </h3>
                  </div>

                  <span className="text-4xl text-[#a47d3f] transition group-hover:scale-110">
                    {menu.icon}
                  </span>
                </div>

                <p className="mt-4 leading-7 text-[#687169]">
                  {menu.description}
                </p>

                <p className="mt-6 font-semibold text-[#18372d]">
                  바로가기 →
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <footer className="bg-[#132a23] px-6 py-10 text-center text-sm text-[#cbc3b4]">
        <p className="font-serif text-lg font-bold text-[#f5eddd]">
          FitMate AI
        </p>
        <p className="mt-2">Classic style, thoughtfully curated.</p>
      </footer>
    </main>
  );
}