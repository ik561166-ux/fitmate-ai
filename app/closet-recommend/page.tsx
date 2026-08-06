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
  weatherCode: number;
};

type Outfit = {
  top?: ClothingItem;
  bottom?: ClothingItem;
  shoes?: ClothingItem;
  outer?: ClothingItem;
};

const STORAGE_KEY = "fitmate-closet-items";

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

function isRainy(code: number) {
  return [
    51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82, 95, 96, 99,
  ].includes(code);
}

function filterItemsByWeather(
  items: ClothingItem[],
  category: string,
  temperature: number,
) {
  const categoryItems = items.filter(
    (item) => item.category === category,
  );

  if (categoryItems.length === 0) {
    return [];
  }

  const hotKeywords = ["반팔", "반바지", "린넨", "얇은", "민소매"];
  const coldKeywords = ["니트", "기모", "패딩", "코트", "울", "목폴라"];
  const warmWeatherAvoid = ["패딩", "코트", "기모", "울", "목폴라"];
  const coldWeatherAvoid = ["반팔", "반바지", "민소매"];

  let preferredItems = categoryItems;

  if (temperature >= 27) {
    const hotItems = categoryItems.filter((item) =>
      hotKeywords.some((keyword) => item.name.includes(keyword)),
    );

    const suitableItems = categoryItems.filter(
      (item) =>
        !warmWeatherAvoid.some((keyword) =>
          item.name.includes(keyword),
        ),
    );

    preferredItems =
      hotItems.length > 0
        ? hotItems
        : suitableItems.length > 0
          ? suitableItems
          : categoryItems;
  }

  if (temperature <= 12) {
    const coldItems = categoryItems.filter((item) =>
      coldKeywords.some((keyword) => item.name.includes(keyword)),
    );

    const suitableItems = categoryItems.filter(
      (item) =>
        !coldWeatherAvoid.some((keyword) =>
          item.name.includes(keyword),
        ),
    );

    preferredItems =
      coldItems.length > 0
        ? coldItems
        : suitableItems.length > 0
          ? suitableItems
          : categoryItems;
  }

  return preferredItems;
}

function pickRandomItem(items: ClothingItem[]) {
  if (items.length === 0) {
    return undefined;
  }

  const randomIndex = Math.floor(Math.random() * items.length);
  return items[randomIndex];
}

function getStyleNote(
  temperature: number,
  weatherCode: number,
  outfit: Outfit,
) {
  const selectedNames = [
    outfit.top?.name,
    outfit.bottom?.name,
    outfit.shoes?.name,
    outfit.outer?.name,
  ]
    .filter(Boolean)
    .join(", ");

  if (temperature >= 30) {
    return `현재 기온이 높아 가볍게 입을 수 있는 조합을 우선 선택했어요. 추천 아이템은 ${selectedNames}입니다. 통풍이 잘되는 소재와 밝은 색을 활용하면 더욱 쾌적해요.`;
  }

  if (temperature >= 23) {
    return `따뜻한 날씨에 부담 없이 입기 좋은 조합이에요. 추천 아이템은 ${selectedNames}입니다. 저녁까지 외출한다면 얇은 겉옷을 챙겨도 좋아요.`;
  }

  if (temperature >= 16) {
    return `선선한 날씨를 고려해 적당한 보온성과 활동성을 갖춘 조합을 골랐어요. 추천 아이템은 ${selectedNames}입니다.`;
  }

  if (temperature >= 8) {
    return `쌀쌀한 날씨에 맞춰 긴 옷과 아우터를 중심으로 추천했어요. 추천 아이템은 ${selectedNames}입니다.`;
  }

  return `추운 날씨를 고려해 보온성이 높은 아이템을 우선 추천했어요. 추천 아이템은 ${selectedNames}입니다.`;
}

export default function ClosetRecommendPage() {
  const [items, setItems] = useState<ClothingItem[]>([]);
  const [outfit, setOutfit] = useState<Outfit>({});
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isWeatherLoading, setIsWeatherLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const createOutfit = (
    closetItems: ClothingItem[],
    currentWeather: WeatherData,
  ) => {
    const temperature = currentWeather.temperature;

    const tops = filterItemsByWeather(
      closetItems,
      "상의",
      temperature,
    );

    const bottoms = filterItemsByWeather(
      closetItems,
      "하의",
      temperature,
    );

    const shoes = filterItemsByWeather(
      closetItems,
      "신발",
      temperature,
    );

    const outers =
      temperature < 23
        ? filterItemsByWeather(
            closetItems,
            "아우터",
            temperature,
          )
        : [];

    setOutfit({
      top: pickRandomItem(tops),
      bottom: pickRandomItem(bottoms),
      shoes: pickRandomItem(shoes),
      outer: pickRandomItem(outers),
    });
  };

  const loadWeather = (closetItems: ClothingItem[]) => {
    setIsWeatherLoading(true);
    setErrorMessage("");

    if (!navigator.geolocation) {
      setErrorMessage(
        "현재 브라우저에서는 위치 정보를 사용할 수 없어요.",
      );
      setIsWeatherLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;

          const response = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,apparent_temperature,weather_code&timezone=auto`,
          );

          if (!response.ok) {
            throw new Error("날씨 요청 실패");
          }

          const data = await response.json();

          const currentWeather: WeatherData = {
            temperature: data.current.temperature_2m,
            apparentTemperature:
              data.current.apparent_temperature,
            weatherCode: data.current.weather_code,
          };

          setWeather(currentWeather);
          createOutfit(closetItems, currentWeather);
        } catch {
          setErrorMessage(
            "날씨 정보를 불러오는 중 오류가 발생했어요.",
          );
        } finally {
          setIsWeatherLoading(false);
        }
      },
      () => {
        setErrorMessage(
          "날씨를 반영하려면 위치 권한을 허용해주세요.",
        );
        setIsWeatherLoading(false);
      },
    );
  };

  useEffect(() => {
    const savedItems = localStorage.getItem(STORAGE_KEY);
    let parsedItems: ClothingItem[] = [];

    if (savedItems) {
      try {
        parsedItems = JSON.parse(savedItems);
        setItems(parsedItems);
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }

    setIsLoaded(true);
  }, []);

  const outfitParts = [
    {
      label: "상의",
      icon: "👕",
      item: outfit.top,
    },
    {
      label: "하의",
      icon: "👖",
      item: outfit.bottom,
    },
    {
      label: "신발",
      icon: "👞",
      item: outfit.shoes,
    },
    {
      label: "아우터",
      icon: "🧥",
      item: outfit.outer,
    },
  ];

  if (!isLoaded) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#efe8da] text-[#1f2d27]">
        <p className="font-serif text-2xl font-bold">
          옷장을 불러오는 중이에요...
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#efe8da] px-6 py-12 text-[#1f2d27]">
      <section className="mx-auto max-w-5xl">
        <Link
          href="/closet"
          className="inline-flex items-center text-sm font-semibold text-[#59645c] transition hover:text-[#18372d]"
        >
          ← 내 옷장으로 돌아가기
        </Link>

        <div className="mt-8 rounded-[2rem] border border-[#b8aa90] bg-[#f8f3e9] p-8 shadow-xl md:p-12">
          <p className="text-sm font-semibold tracking-[0.25em] text-[#8a6f3d]">
            WEATHER & WARDROBE
          </p>

          <h1 className="mt-3 font-serif text-4xl font-bold md:text-5xl">
            날씨 맞춤 옷장 추천
          </h1>

          <p className="mt-4 max-w-2xl leading-7 text-[#68716a]">
            현재 날씨와 등록된 옷을 함께 확인해 오늘 입기 좋은
            조합을 추천합니다.
          </p>

          {items.length === 0 ? (
            <div className="mt-10 rounded-3xl border border-dashed border-[#b8aa90] bg-[#f1e9da] p-10 text-center">
              <div className="text-6xl">♞</div>

              <h2 className="mt-5 font-serif text-3xl font-bold">
                옷장이 아직 비어 있어요.
              </h2>

              <p className="mt-3 text-[#68716a]">
                먼저 상의, 하의와 신발을 등록해주세요.
              </p>

              <Link
                href="/closet"
                className="mt-7 inline-block rounded-full bg-[#18372d] px-7 py-4 font-bold text-[#f8f3e9] transition hover:bg-[#23493d]"
              >
                옷 등록하러 가기
              </Link>
            </div>
          ) : !weather ? (
            <div className="mt-10 rounded-3xl border border-[#c1b399] bg-white p-8 text-center">
              <div className="text-6xl">🌤️</div>

              <h2 className="mt-5 font-serif text-3xl font-bold">
                현재 날씨를 반영할까요?
              </h2>

              <p className="mt-3 text-[#68716a]">
                위치 권한을 허용하면 날씨에 맞는 옷만 골라서
                추천해드려요.
              </p>

              <button
                type="button"
                onClick={() => loadWeather(items)}
                disabled={isWeatherLoading}
                className="mt-7 rounded-full bg-[#18372d] px-8 py-4 font-bold text-[#f8f3e9] transition hover:bg-[#23493d] disabled:cursor-wait disabled:opacity-60"
              >
                {isWeatherLoading
                  ? "날씨 확인 중..."
                  : "날씨 맞춤 코디 추천"}
              </button>
            </div>
          ) : (
            <>
              <div className="mt-10 flex flex-col justify-between gap-5 rounded-3xl bg-[#18372d] p-7 text-[#f8f3e9] md:flex-row md:items-center">
                <div className="flex items-center gap-5">
                  <div className="text-6xl">
                    {getWeatherIcon(weather.weatherCode)}
                  </div>

                  <div>
                    <p className="text-sm font-semibold tracking-[0.2em] text-[#d2b06d]">
                      CURRENT WEATHER
                    </p>

                    <p className="mt-2 font-serif text-4xl font-bold">
                      {Math.round(weather.temperature)}°
                    </p>

                    <p className="mt-1 text-[#ded7c8]">
                      {getWeatherDescription(weather.weatherCode)}
                      {" · "}
                      체감{" "}
                      {Math.round(weather.apparentTemperature)}°
                    </p>
                  </div>
                </div>

                {isRainy(weather.weatherCode) && (
                  <p className="rounded-full bg-white/10 px-5 py-3 text-sm font-semibold">
                    우산과 물에 강한 신발을 추천해요
                  </p>
                )}
              </div>

              <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {outfitParts.map((part) => (
                  <article
                    key={part.label}
                    className="rounded-3xl border border-[#c1b399] bg-white p-6 shadow-sm"
                  >
                    <div className="text-5xl">{part.icon}</div>

                    <p className="mt-5 text-xs font-semibold tracking-[0.2em] text-[#8a6f3d]">
                      {part.label}
                    </p>

                    <h2 className="mt-2 font-serif text-xl font-bold">
                      {part.item
                        ? part.item.name
                        : part.label === "아우터" &&
                            weather.temperature >= 23
                          ? "오늘은 생략 가능"
                          : `${part.label} 미등록`}
                    </h2>

                    {!part.item &&
                      !(
                        part.label === "아우터" &&
                        weather.temperature >= 23
                      ) && (
                        <p className="mt-3 text-sm text-[#7a7469]">
                          옷장에 {part.label}을 등록하면 추천에
                          포함돼요.
                        </p>
                      )}
                  </article>
                ))}
              </div>

              <div className="mt-8 rounded-3xl bg-[#d8c9ae] p-7">
                <p className="text-sm font-semibold tracking-[0.2em] text-[#6a5530]">
                  STYLE NOTE
                </p>

                <h2 className="mt-3 font-serif text-2xl font-bold">
                  날씨와 옷장을 함께 반영했어요.
                </h2>

                <p className="mt-4 leading-7 text-[#4e584f]">
                  {getStyleNote(
                    weather.temperature,
                    weather.weatherCode,
                    outfit,
                  )}
                </p>
              </div>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => createOutfit(items, weather)}
                  className="rounded-2xl bg-[#d2b06d] px-6 py-4 font-bold text-[#18372d] transition hover:bg-[#e0c48a] active:scale-[0.98]"
                >
                  다른 조합 추천받기
                </button>

                <button
                  type="button"
                  onClick={() => loadWeather(items)}
                  disabled={isWeatherLoading}
                  className="rounded-2xl border border-[#9f927b] px-6 py-4 font-bold transition hover:border-[#18372d] disabled:opacity-60"
                >
                  날씨 다시 확인하기
                </button>
              </div>
            </>
          )}

          {errorMessage && (
            <div className="mt-6 rounded-2xl border border-[#9e5e50] bg-[#f5e6df] p-5 text-[#7a342c]">
              {errorMessage}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}