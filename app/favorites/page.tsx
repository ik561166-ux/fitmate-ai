"use client";

import Link from "next/link";
import { ChangeEvent, useEffect, useState } from "react";

type SavedOutfit = {
  id: number;
  top?: string;
  bottom?: string;
  shoes?: string;
  outer?: string;
  createdAt: string;
  image?: string;
};

const FAVORITES_KEY = "fitmate-favorite-outfits";

function compressImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      const img = new Image();

      img.onload = () => {
        const maxSize = 900;

        let width = img.width;
        let height = img.height;

        if (width > height && width > maxSize) {
          height = Math.round((height * maxSize) / width);
          width = maxSize;
        } else if (height > maxSize) {
          width = Math.round((width * maxSize) / height);
          height = maxSize;
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const context = canvas.getContext("2d");

        if (!context) {
          reject(new Error("사진 처리에 실패했어요."));
          return;
        }

        context.drawImage(img, 0, 0, width, height);

        const compressed = canvas.toDataURL("image/jpeg", 0.72);

        resolve(compressed);
      };

      img.onerror = () => {
        reject(new Error("사진을 불러오지 못했어요."));
      };

      img.src = reader.result as string;
    };

    reader.onerror = () => {
      reject(new Error("사진을 읽지 못했어요."));
    };

    reader.readAsDataURL(file);
  });
}

export default function FavoritesPage() {
  const [outfits, setOutfits] = useState<SavedOutfit[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem(FAVORITES_KEY);

    if (saved) {
      try {
        setOutfits(JSON.parse(saved));
      } catch {
        localStorage.removeItem(FAVORITES_KEY);
      }
    }

    setIsLoaded(true);
  }, []);

  const saveOutfits = (updated: SavedOutfit[]) => {
    setOutfits(updated);

    try {
      localStorage.setItem(
        FAVORITES_KEY,
        JSON.stringify(updated),
      );
    } catch {
      setMessage(
        "사진 저장 공간이 부족해요. 기존 코디 사진을 일부 삭제해주세요.",
      );
    }
  };

  const deleteOutfit = (id: number) => {
    const updated = outfits.filter(
      (outfit) => outfit.id !== id,
    );

    saveOutfits(updated);
    setMessage("");
  };

  const handleImageChange = async (
    event: ChangeEvent<HTMLInputElement>,
    outfitId: number,
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setMessage("이미지 파일만 선택해주세요.");
      return;
    }

    setMessage("사진을 저장하는 중...");

    try {
      const image = await compressImage(file);

      const updated = outfits.map((outfit) =>
        outfit.id === outfitId
          ? {
              ...outfit,
              image,
            }
          : outfit,
      );

      saveOutfits(updated);
      setMessage("코디 사진을 저장했어요.");
    } catch {
      setMessage("사진을 저장하지 못했어요.");
    }

    event.target.value = "";
  };

  const deleteImage = (outfitId: number) => {
    const updated = outfits.map((outfit) =>
      outfit.id === outfitId
        ? {
            ...outfit,
            image: undefined,
          }
        : outfit,
    );

    saveOutfits(updated);
    setMessage("코디 사진을 삭제했어요.");
  };

  if (!isLoaded) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#eee6d8] text-[#1d2c25]">
        <p className="font-serif text-2xl font-bold">
          저장한 코디를 불러오는 중...
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#eee6d8] px-6 py-10 text-[#1d2c25]">
      <section className="mx-auto max-w-6xl">
        <Link
          href="/"
          className="inline-flex items-center text-sm font-semibold text-[#59635b] transition hover:text-[#18372d]"
        >
          ← 홈으로 돌아가기
        </Link>

        <div className="mt-8 rounded-[2rem] border border-[#b9aa90] bg-[#f8f2e7] p-8 shadow-xl md:p-12">
          <p className="text-xs font-semibold tracking-[0.24em] text-[#8a6e39]">
            SAVED LOOKS
          </p>

          <div className="mt-3 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <h1 className="font-serif text-4xl font-bold md:text-5xl">
                저장한 코디
              </h1>

              <p className="mt-3 text-[#687169]">
                마음에 든 조합에 실제 착용 사진이나 코디 사진을
                함께 저장해보세요.
              </p>
            </div>

            <p className="rounded-full bg-[#e5d7bd] px-4 py-2 text-sm font-semibold">
              총 {outfits.length}개
            </p>
          </div>

          {message && (
            <div className="mt-6 rounded-2xl bg-[#e5d7bd] px-5 py-4 text-center font-semibold text-[#18372d]">
              {message}
            </div>
          )}

          {outfits.length === 0 ? (
            <div className="mt-10 rounded-3xl border border-dashed border-[#b9aa90] bg-[#eee4d3] p-12 text-center">
              <div className="text-6xl">♡</div>

              <h2 className="mt-5 font-serif text-3xl font-bold">
                아직 저장한 코디가 없어요.
              </h2>

              <p className="mt-3 text-[#687169]">
                홈페이지에서 마음에 드는 추천 코디를 먼저
                저장해주세요.
              </p>

              <Link
                href="/"
                className="mt-7 inline-block rounded-full bg-[#18372d] px-7 py-4 font-bold text-[#f8f1e2] transition hover:bg-[#244b3f]"
              >
                오늘의 코디 보러 가기
              </Link>
            </div>
          ) : (
            <div className="mt-10 grid gap-7 lg:grid-cols-2">
              {outfits.map((outfit) => (
                <article
                  key={outfit.id}
                  className="overflow-hidden rounded-[2rem] border border-[#c5b69d] bg-white shadow-sm"
                >
                  {outfit.image ? (
                    <div className="relative bg-[#e6dcc9]">
                      <img
                        src={outfit.image}
                        alt="저장한 코디"
                        className="h-[420px] w-full object-cover"
                      />

                      <div className="absolute bottom-4 left-4 right-4 flex gap-3">
                        <label className="flex-1 cursor-pointer rounded-full bg-white/90 px-4 py-3 text-center text-sm font-bold text-[#18372d] shadow">
                          사진 변경

                          <input
                            type="file"
                            accept="image/*"
                            onChange={(event) =>
                              handleImageChange(
                                event,
                                outfit.id,
                              )
                            }
                            className="hidden"
                          />
                        </label>

                        <button
                          type="button"
                          onClick={() =>
                            deleteImage(outfit.id)
                          }
                          className="rounded-full bg-[#18372d]/90 px-5 py-3 text-sm font-bold text-white shadow"
                        >
                          사진 삭제
                        </button>
                      </div>
                    </div>
                  ) : (
                    <label className="flex min-h-[300px] cursor-pointer flex-col items-center justify-center bg-[#e8decc] p-8 text-center transition hover:bg-[#dfd2bb]">
                      <div className="text-6xl">📷</div>

                      <p className="mt-5 font-serif text-2xl font-bold">
                        코디 사진 추가
                      </p>

                      <p className="mt-2 text-sm leading-6 text-[#6c716b]">
                        실제 착용 사진이나
                        <br />
                        코디 사진을 선택해주세요.
                      </p>

                      <span className="mt-5 rounded-full bg-[#18372d] px-6 py-3 text-sm font-bold text-[#f8f1e2]">
                        사진 선택
                      </span>

                      <input
                        type="file"
                        accept="image/*"
                        onChange={(event) =>
                          handleImageChange(
                            event,
                            outfit.id,
                          )
                        }
                        className="hidden"
                      />
                    </label>
                  )}

                  <div className="p-6 md:p-7">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-xs font-semibold tracking-[0.2em] text-[#8a6e39]">
                          SAVED OUTFIT
                        </p>

                        <p className="mt-2 text-sm text-[#7a7469]">
                          {outfit.createdAt}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          deleteOutfit(outfit.id)
                        }
                        className="rounded-full border border-[#d1c3aa] px-4 py-2 text-sm font-semibold text-[#6f6658] transition hover:border-[#8a3b32] hover:text-[#8a3b32]"
                      >
                        코디 삭제
                      </button>
                    </div>

                    <div className="mt-6 space-y-3">
                      <div className="flex items-center justify-between gap-5 rounded-2xl bg-[#f8f2e7] p-4">
                        <span className="text-sm text-[#786f61]">
                          👕 상의
                        </span>

                        <span className="text-right font-serif font-bold">
                          {outfit.top || "미등록"}
                        </span>
                      </div>

                      <div className="flex items-center justify-between gap-5 rounded-2xl bg-[#f8f2e7] p-4">
                        <span className="text-sm text-[#786f61]">
                          👖 하의
                        </span>

                        <span className="text-right font-serif font-bold">
                          {outfit.bottom || "미등록"}
                        </span>
                      </div>

                      <div className="flex items-center justify-between gap-5 rounded-2xl bg-[#f8f2e7] p-4">
                        <span className="text-sm text-[#786f61]">
                          👞 신발
                        </span>

                        <span className="text-right font-serif font-bold">
                          {outfit.shoes || "미등록"}
                        </span>
                      </div>

                      <div className="flex items-center justify-between gap-5 rounded-2xl bg-[#f8f2e7] p-4">
                        <span className="text-sm text-[#786f61]">
                          🧥 아우터
                        </span>

                        <span className="text-right font-serif font-bold">
                          {outfit.outer || "생략"}
                        </span>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}