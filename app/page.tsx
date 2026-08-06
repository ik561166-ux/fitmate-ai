"use client";

import Link from "next/link";
import { useState } from "react";

type WeatherData = {
  temperature: number;
  apparentTemperature: number;
  humidity: number;
  weatherCode: number;
};

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
    href: "/closet-recommend",
    eyebrow: "WARDROBE STYLING",
    title: "내 옷으로 추천",
    description: "등록한 옷만 활용해 오늘의 코디를 조합합니다.",
    icon: "◇",
  },
  {
    href: "/analyze",
    eyebrow: "GARMENT ANALYSIS",
    title: "사진으로 옷 분석",
    description: "옷 사진을 올려 색상, 원단, 핏을 확인해보세요.",
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
  if ([71, 73, 75, 77].includes(code)) return "눈";
  if ([80, 81, 82].includes(code)) return "소나기";
  if ([85, 86].includes(code)) return "눈 소나기";
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
  const isRainy = [
    51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82, 95, 96, 99,
  ].includes(weatherCode);

  if (temperature >= 30) {
    return isRainy
      ? "덥고 비가 올 수 있어요. 통기성이 좋고 빨리 마르는 옷이 좋아요."
      : "매우 더운 날이에요. 반팔, 반바지, 린넨처럼 가벼운 옷을 추천해요.";
  }

  if (temperature >= 23) {
    return isRainy
      ? "가벼운 셔츠와 방수에 강한 신발을 추천해요."
      : "반팔이나 얇은 셔츠를 입기 좋은 날씨예요.";
  }

  if (temperature >= 16) {
    return "긴팔 셔츠나 얇은 니트에 가벼운 재킷을 준비해보세요.";
  }

  if (temperature >= 8) {
    return "니트, 재킷, 긴바지처럼 보온성을 갖춘 코디가 좋아요.";
  }

  return "기온이 낮아요. 코트나 패딩처럼 따뜻한 아우터가 필요해요.";
}

export default function Home() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const loadWeather = () => {
    setIsLoading(true);
    setErrorMessage("");

    if (!navigator.geolocation) {
      setErrorMessage("현재 브라우저에서는 위치 정보를 사용할 수 없어요.");
      setIsLoading(false);
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
            throw new Error("날씨 정보를 가져오지 못했습니다.");
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
          setIsLoading(false);
        }
      },
      () => {
        setErrorMessage(
          "현재 위치의 날씨를 확인하려면 위치 권한을 허용해주세요.",
        );
        setIsLoading(false);
      },
    );
  };

  return (
    <main className="min-h-screen bg-[#efe8da] text-[#1f2d27]">
      <header className="border-b border-[#b7aa93] bg-[#f8f3e9]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <Link
            href="/"
            className="font-serif text-2xl font-bold tracking-wide"
          >
            FitMate AI
          </Link>

          <nav className="hidden items-center gap-8 text-sm font-semibold text-[#4e594e] md:flex">
            <Link
              href="/recommend"
              className="transition hover:text-[#102d25]"
            >
              Style
            </Link>

            <Link
              href="/closet"
              className="transition hover:text-[#102d25]"
            >
              Wardrobe
            </Link>

            <Link
              href="/analyze"
              className="transition hover:text-[#102d25]"
            >
              Analysis
            </Link>

            <Link
              href="/weather"
              className="transition hover:text-[#102d25]"
            >
              Weather
            </Link>
          </nav>
        </div>
      </header>

      <section className="relative overflow-hidden bg-[#18372d] text-[#f7f0df]">
        <div className="absolute -right-24 top-12 h-80 w-80 rounded-full border border-[#d0b071]/25" />
        <div className="absolute -bottom-36 -left-24 h-96 w-96 rounded-full border border-[#d0b071]/20" />

        <div className="relative mx-auto grid max-w-7xl gap-12 px-6 py-20 md:grid-cols-[1.05fr_0.95fr] md:py-28">
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
              날씨, 상황, 옷장의 색감을 함께 고려해 오래 입을수록 멋이
              나는 코디를 추천합니다.
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
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold tracking-[0.25em] text-[#6b6457]">
                    TODAY&apos;S WEATHER
                  </p>

                  <h2 className="mt-3 font-serif text-3xl font-bold">
                    오늘의 날씨와 스타일
                  </h2>
                </div>

                <div className="text-5xl">
                  {weather ? getWeatherIcon(weather.weatherCode) : "🌤️"}
                </div>
              </div>

              {!weather ? (
                <div className="mt-8">
                  <p className="leading-7 text-[#625e54]">
                    현재 위치를 확인하면 오늘 날씨와 어울리는 옷차림을
                    추천해드려요.
                  </p>

                  <button
                    type="button"
                    onClick={loadWeather}
                    disabled={isLoading}
                    className="mt-6 w-full rounded-full bg-[#18372d] px-6 py-4 font-bold text-[#f7f0df] transition hover:bg-[#23493d] disabled:cursor-wait disabled:opacity-60"
                  >
                    {isLoading
                      ? "날씨 불러오는 중..."
                      : "현재 날씨 확인하기"}
                  </button>
                </div>
              ) : (
                <div className="mt-8">
                  <div className="flex items-end gap-3">
                    <p className="font-serif text-6xl font-bold">
                      {Math.round(weather.temperature)}°
                    </p>

                    <p className="pb-2 text-lg font-semibold text-[#5c5b52]">
                      {getWeatherDescription(weather.weatherCode)}
                    </p>
                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-4">
                    <div className="rounded-2xl bg-[#f8f3e9] p-4">
                      <p className="text-xs text-[#7a7469]">체감온도</p>
                      <p className="mt-1 font-serif text-2xl font-bold">
                        {Math.round(weather.apparentTemperature)}°
                      </p>
                    </div>

                    <div className="rounded-2xl bg-[#f8f3e9] p-4">
                      <p className="text-xs text-[#7a7469]">습도</p>
                      <p className="mt-1 font-serif text-2xl font-bold">
                        {weather.humidity}%
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 rounded-2xl bg-[#18372d] p-5 text-[#f7f0df]">
                    <p className="text-xs font-semibold tracking-[0.2em] text-[#d2b06d]">
                      STYLE NOTE
                    </p>

                    <p className="mt-3 leading-7 text-[#ded7c8]">
                      {getStyleAdvice(
                        weather.temperature,
                        weather.weatherCode,
                      )}
                    </p>
                  </div>

                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    <button
                      type="button"
                      onClick={loadWeather}
                      disabled={isLoading}
                      className="rounded-full border border-[#9f927b] px-5 py-3 font-semibold transition hover:border-[#18372d] disabled:opacity-60"
                    >
                      날씨 새로고침
                    </button>

                    <Link
                      href="/weather"
                      className="rounded-full bg-[#d2b06d] px-5 py-3 text-center font-bold text-[#18372d] transition hover:bg-[#e0c48a]"
                    >
                      자세히 보기
                    </Link>
                  </div>
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
            유행보다 취향을, 충동보다 조합을 중요하게 생각하는 사람을
            위한 개인 스타일 서비스입니다.
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
                <span className="transition group-hover:translate-x-1">
                  →
                </span>
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
            <p className="mt-3 font-serif text-2xl font-bold">
              날씨에 맞게
            </p>
            <p className="mt-2 text-[#4e584f]">
              기온과 습도를 고려해 실용적인 조합을 추천합니다.
            </p>
          </div>

          <div>
            <p className="text-sm font-semibold tracking-[0.22em] text-[#6a5530]">
              COLOR
            </p>
            <p className="mt-3 font-serif text-2xl font-bold">
              색감은 클래식하게
            </p>
            <p className="mt-2 text-[#4e584f]">
              네이비, 크림, 브라운처럼 오래 가는 색을 중심으로
              분석합니다.
            </p>
          </div>

          <div>
            <p className="text-sm font-semibold tracking-[0.22em] text-[#6a5530]">
              WARDROBE
            </p>
            <p className="mt-3 font-serif text-2xl font-bold">
              내 옷 안에서
            </p>
            <p className="mt-2 text-[#4e584f]">
              새 옷을 사기 전에 가진 옷으로 가능한 조합을 먼저
              찾아줍니다.
            </p>
          </div>
        </div>
      </section>

      <footer className="bg-[#132a23] px-6 py-10 text-center text-sm text-[#cfc7b8]">
        <p className="font-serif text-lg font-bold text-[#f5eddd]">
          FitMate AI
        </p>
        <p className="mt-2">Classic style, thoughtfully curated.</p>
      </footer>
    </main>
  );
}