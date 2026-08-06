"use client";

import Link from "next/link";
import { useState } from "react";

type WeatherData = {
  temperature: number;
  apparentTemperature: number;
  humidity: number;
  weatherCode: number;
  windSpeed: number;
};

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
  if ([51, 53, 55, 56, 57, 61, 63, 65, 66, 67].includes(code)) {
    return "🌧️";
  }
  if ([71, 73, 75, 77, 85, 86].includes(code)) return "❄️";
  if ([80, 81, 82].includes(code)) return "🌦️";
  if ([95, 96, 99].includes(code)) return "⛈️";

  return "🌤️";
}

function getStyleAdvice(temperature: number, weatherCode: number) {
  const isRainy = [
    51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82, 95, 96, 99,
  ].includes(weatherCode);

  if (temperature >= 30) {
    return isRainy
      ? "덥고 비가 올 수 있어요. 통기성이 좋은 반팔과 빨리 마르는 하의를 추천해요."
      : "매우 더운 날씨예요. 반팔, 반바지, 린넨처럼 가볍고 통풍이 잘되는 옷이 좋아요.";
  }

  if (temperature >= 23) {
    return isRainy
      ? "가벼운 반팔이나 셔츠에 방수 신발을 매치해보세요."
      : "반팔이나 얇은 셔츠가 적당해요. 저녁에는 가벼운 겉옷도 괜찮아요.";
  }

  if (temperature >= 16) {
    return "긴팔 셔츠나 얇은 니트에 가벼운 재킷을 함께 준비하면 좋아요.";
  }

  if (temperature >= 8) {
    return "니트, 재킷, 긴바지처럼 보온성을 갖춘 코디를 추천해요.";
  }

  return "기온이 낮아요. 코트나 패딩처럼 보온성이 높은 아우터가 필요해요.";
}

export default function WeatherPage() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const loadWeather = () => {
    setIsLoading(true);
    setErrorMessage("");

    if (!navigator.geolocation) {
      setErrorMessage("이 브라우저에서는 위치 정보를 사용할 수 없어요.");
      setIsLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;

          const response = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,apparent_temperature,relative_humidity_2m,weather_code,wind_speed_10m&timezone=auto`,
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
            windSpeed: data.current.wind_speed_10m,
          });
        } catch {
          setErrorMessage("날씨 정보를 불러오는 중 오류가 발생했어요.");
        } finally {
          setIsLoading(false);
        }
      },
      () => {
        setErrorMessage(
          "위치 권한을 허용해야 현재 지역의 날씨를 확인할 수 있어요.",
        );
        setIsLoading(false);
      },
    );
  };

  return (
    <main className="min-h-screen bg-[#efe8da] px-6 py-12 text-[#1f2d27]">
      <section className="mx-auto max-w-4xl">
        <Link
          href="/"
          className="inline-flex items-center text-sm font-semibold text-[#59645c] transition hover:text-[#18372d]"
        >
          ← 홈으로 돌아가기
        </Link>

        <div className="mt-8 rounded-[2rem] border border-[#b8aa90] bg-[#f8f3e9] p-8 shadow-xl md:p-12">
          <p className="text-sm font-semibold tracking-[0.25em] text-[#8a6f3d]">
            TODAY&apos;S WEATHER
          </p>

          <h1 className="mt-3 font-serif text-4xl font-bold md:text-5xl">
            오늘 날씨
          </h1>

          <p className="mt-4 text-[#68716a]">
            현재 위치를 기준으로 날씨와 추천 옷차림을 확인해보세요.
          </p>

          {!weather && (
            <div className="mt-10 rounded-3xl border border-[#c1b399] bg-white p-8 text-center">
              <div className="text-6xl">🌤️</div>

              <h2 className="mt-5 font-serif text-2xl font-bold">
                현재 날씨를 불러올까요?
              </h2>

              <p className="mt-3 text-[#68716a]">
                버튼을 누르면 브라우저에서 위치 권한을 요청합니다.
              </p>

              <button
                type="button"
                onClick={loadWeather}
                disabled={isLoading}
                className="mt-7 rounded-full bg-[#18372d] px-8 py-4 font-bold text-[#f8f3e9] transition hover:bg-[#23493d] disabled:cursor-wait disabled:opacity-60"
              >
                {isLoading ? "날씨 불러오는 중..." : "현재 날씨 확인하기"}
              </button>
            </div>
          )}

          {errorMessage && (
            <div className="mt-6 rounded-2xl border border-[#9e5e50] bg-[#f5e6df] p-5 text-[#7a342c]">
              {errorMessage}
            </div>
          )}

          {weather && (
            <>
              <div className="mt-10 grid gap-6 md:grid-cols-[1.2fr_0.8fr]">
                <div className="rounded-3xl bg-[#18372d] p-8 text-[#f8f3e9]">
                  <div className="text-7xl">
                    {getWeatherIcon(weather.weatherCode)}
                  </div>

                  <p className="mt-6 text-sm font-semibold tracking-[0.2em] text-[#d2b06d]">
                    CURRENT CONDITIONS
                  </p>

                  <div className="mt-3 flex items-end gap-3">
                    <p className="font-serif text-6xl font-bold">
                      {Math.round(weather.temperature)}°
                    </p>

                    <p className="pb-2 text-xl text-[#ded7c8]">
                      {getWeatherDescription(weather.weatherCode)}
                    </p>
                  </div>

                  <p className="mt-3 text-[#ded7c8]">
                    체감온도 {Math.round(weather.apparentTemperature)}°
                  </p>
                </div>

                <div className="grid gap-4">
                  <div className="rounded-3xl border border-[#c1b399] bg-white p-6">
                    <p className="text-sm text-[#7a7469]">습도</p>
                    <p className="mt-2 font-serif text-3xl font-bold">
                      {weather.humidity}%
                    </p>
                  </div>

                  <div className="rounded-3xl border border-[#c1b399] bg-white p-6">
                    <p className="text-sm text-[#7a7469]">풍속</p>
                    <p className="mt-2 font-serif text-3xl font-bold">
                      {weather.windSpeed} km/h
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 rounded-3xl bg-[#d8c9ae] p-7">
                <p className="text-sm font-semibold tracking-[0.2em] text-[#6a5530]">
                  STYLE ADVICE
                </p>

                <h2 className="mt-3 font-serif text-2xl font-bold">
                  오늘의 옷차림 추천
                </h2>

                <p className="mt-4 leading-7 text-[#4e584f]">
                  {getStyleAdvice(
                    weather.temperature,
                    weather.weatherCode,
                  )}
                </p>
              </div>

              <button
                type="button"
                onClick={loadWeather}
                disabled={isLoading}
                className="mt-8 w-full rounded-2xl border border-[#9f927b] px-6 py-4 font-bold transition hover:border-[#18372d] disabled:opacity-60"
              >
                날씨 새로고침
              </button>
            </>
          )}
        </div>
      </section>
    </main>
  );
}