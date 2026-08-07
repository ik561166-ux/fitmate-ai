"use client";

import Link from "next/link";
import {
  ChangeEvent,
  useEffect,
  useRef,
  useState,
} from "react";

type ClothingItem = {
  id: number;
  category: string;
  name: string;
  image?: string;
};

const STORAGE_KEY = "fitmate-closet-items";

function compressImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      const image = new Image();

      image.onload = () => {
        const maxSize = 700;

        let width = image.width;
        let height = image.height;

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
          reject(new Error("이미지를 처리하지 못했어요."));
          return;
        }

        context.drawImage(image, 0, 0, width, height);

        resolve(canvas.toDataURL("image/jpeg", 0.7));
      };

      image.onerror = () => {
        reject(new Error("이미지를 불러오지 못했어요."));
      };

      image.src = reader.result as string;
    };

    reader.onerror = () => {
      reject(new Error("파일을 읽지 못했어요."));
    };

    reader.readAsDataURL(file);
  });
}

export default function ClosetPage() {
  const [category, setCategory] = useState("상의");
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [items, setItems] = useState<ClothingItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedCategory, setSelectedCategory] =
    useState("전체");
  const [message, setMessage] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const saveItems = (updatedItems: ClothingItem[]) => {
    setItems(updatedItems);

    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(updatedItems),
      );
    } catch {
      setMessage(
        "브라우저 저장 공간이 부족해요. 일부 사진을 삭제해주세요.",
      );
    }
  };

  const handleImageChange = async (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setMessage("이미지 파일만 선택해주세요.");
      return;
    }

    try {
      setMessage("사진을 준비하는 중...");
      const compressed = await compressImage(file);
      setImage(compressed);
      setMessage("");
    } catch {
      setMessage("사진을 불러오지 못했어요.");
    }
  };

  const addItem = () => {
    const trimmedName = name.trim();

    if (!trimmedName) {
      setMessage("옷 이름을 입력해주세요.");
      return;
    }

    const newItem: ClothingItem = {
      id: Date.now(),
      category,
      name: trimmedName,
      image: image || undefined,
    };

    saveItems([newItem, ...items]);

    setName("");
    setImage("");
    setMessage("옷장에 등록했어요.");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const deleteItem = (id: number) => {
    const updatedItems = items.filter(
      (item) => item.id !== id,
    );

    saveItems(updatedItems);
    setMessage("옷을 삭제했어요.");
  };

  const deleteImage = (id: number) => {
    const updatedItems = items.map((item) =>
      item.id === id
        ? {
            ...item,
            image: undefined,
          }
        : item,
    );

    saveItems(updatedItems);
    setMessage("사진을 삭제했어요.");
  };

  const updateItemImage = async (
    event: ChangeEvent<HTMLInputElement>,
    id: number,
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    try {
      const compressed = await compressImage(file);

      const updatedItems = items.map((item) =>
        item.id === id
          ? {
              ...item,
              image: compressed,
            }
          : item,
      );

      saveItems(updatedItems);
      setMessage("사진을 변경했어요.");
    } catch {
      setMessage("사진을 변경하지 못했어요.");
    }

    event.target.value = "";
  };

  const categories = [
    "전체",
    "상의",
    "하의",
    "아우터",
    "신발",
    "가방",
    "액세서리",
  ];

  const filteredItems =
    selectedCategory === "전체"
      ? items
      : items.filter(
          (item) => item.category === selectedCategory,
        );

  if (!isLoaded) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#eee6d8] text-[#1d2c25]">
        <p className="font-serif text-2xl font-bold">
          옷장을 불러오는 중...
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#eee6d8] px-6 py-10 text-[#1d2c25]">
      <section className="mx-auto max-w-7xl">
        <div className="flex items-center justify-between gap-4">
          <Link
            href="/"
            className="text-sm font-semibold text-[#59635b] transition hover:text-[#18372d]"
          >
            ← 홈으로 돌아가기
          </Link>

          <Link
            href="/closet-recommend"
            className="rounded-full border border-[#9f927b] px-5 py-2 text-sm font-bold transition hover:border-[#18372d]"
          >
            내 옷으로 추천받기 →
          </Link>
        </div>

        <div className="mt-8 rounded-[2rem] border border-[#b9aa90] bg-[#f8f2e7] p-8 shadow-xl md:p-12">
          <p className="text-xs font-semibold tracking-[0.24em] text-[#8a6e39]">
            MY WARDROBE
          </p>

          <div className="mt-3 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
            <div>
              <h1 className="font-serif text-4xl font-bold md:text-5xl">
                내 옷장
              </h1>

              <p className="mt-3 max-w-2xl leading-7 text-[#687169]">
                가지고 있는 옷을 사진과 함께 등록해
                나만의 디지털 옷장을 만들어보세요.
              </p>
            </div>

            <p className="rounded-full bg-[#e5d7bd] px-5 py-2 text-sm font-semibold">
              총 {items.length}개
            </p>
          </div>

          {message && (
            <div className="mt-6 rounded-2xl bg-[#e5d7bd] p-4 text-center font-semibold text-[#18372d]">
              {message}
            </div>
          )}

          <div className="mt-10 grid gap-6 rounded-[2rem] border border-[#c5b69d] bg-[#eee4d3] p-6 lg:grid-cols-[0.75fr_1.25fr]">
            <label className="flex min-h-[320px] cursor-pointer flex-col items-center justify-center overflow-hidden rounded-3xl border-2 border-dashed border-[#b9aa90] bg-[#f8f2e7] text-center transition hover:border-[#18372d]">
              {image ? (
                <img
                  src={image}
                  alt="새 옷 미리보기"
                  className="h-[320px] w-full object-cover"
                />
              ) : (
                <div className="p-8">
                  <div className="text-6xl">📷</div>

                  <p className="mt-5 font-serif text-2xl font-bold">
                    옷 사진 추가
                  </p>

                  <p className="mt-2 text-sm leading-6 text-[#687169]">
                    사진 없이 이름만 등록해도 되고,
                    <br />
                    사진을 추가하면 갤러리에서 볼 수 있어요.
                  </p>

                  <span className="mt-5 inline-block rounded-full bg-[#18372d] px-6 py-3 text-sm font-bold text-[#f8f1e2]">
                    사진 선택
                  </span>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>

            <div className="flex flex-col justify-center">
              <p className="text-xs font-semibold tracking-[0.2em] text-[#8a6e39]">
                ADD NEW ITEM
              </p>

              <h2 className="mt-3 font-serif text-3xl font-bold">
                새 옷 등록
              </h2>

              <div className="mt-7 space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-semibold">
                    카테고리
                  </label>

                  <select
                    value={category}
                    onChange={(event) =>
                      setCategory(event.target.value)
                    }
                    className="w-full rounded-2xl border border-[#b9aa90] bg-white px-5 py-4 outline-none focus:border-[#18372d]"
                  >
                    <option>상의</option>
                    <option>하의</option>
                    <option>아우터</option>
                    <option>신발</option>
                    <option>가방</option>
                    <option>액세서리</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold">
                    옷 이름
                  </label>

                  <input
                    value={name}
                    onChange={(event) =>
                      setName(event.target.value)
                    }
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        addItem();
                      }
                    }}
                    placeholder="예: 네이비 옥스포드 셔츠"
                    className="w-full rounded-2xl border border-[#b9aa90] bg-white px-5 py-4 outline-none focus:border-[#18372d]"
                  />
                </div>

                <button
                  type="button"
                  onClick={addItem}
                  className="w-full rounded-2xl bg-[#18372d] px-6 py-4 font-bold text-[#f8f1e2] transition hover:bg-[#244b3f]"
                >
                  옷장에 등록하기
                </button>

                {image && (
                  <button
                    type="button"
                    onClick={() => {
                      setImage("");

                      if (fileInputRef.current) {
                        fileInputRef.current.value = "";
                      }
                    }}
                    className="w-full rounded-2xl border border-[#9f927b] px-6 py-4 font-bold transition hover:border-[#18372d]"
                  >
                    선택한 사진 취소
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="mt-14">
            <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
              <div>
                <p className="text-xs font-semibold tracking-[0.22em] text-[#8a6e39]">
                  WARDROBE GALLERY
                </p>

                <h2 className="mt-3 font-serif text-4xl font-bold">
                  옷장 갤러리
                </h2>
              </div>

              <div className="flex flex-wrap gap-2">
                {categories.map((itemCategory) => (
                  <button
                    key={itemCategory}
                    type="button"
                    onClick={() =>
                      setSelectedCategory(itemCategory)
                    }
                    className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                      selectedCategory === itemCategory
                        ? "bg-[#18372d] text-[#f8f1e2]"
                        : "border border-[#b9aa90] bg-[#f8f2e7] hover:border-[#18372d]"
                    }`}
                  >
                    {itemCategory}
                  </button>
                ))}
              </div>
            </div>

            {filteredItems.length === 0 ? (
              <div className="mt-8 rounded-3xl border border-dashed border-[#b9aa90] bg-[#eee4d3] p-12 text-center">
                <div className="text-6xl">♞</div>

                <h3 className="mt-5 font-serif text-2xl font-bold">
                  {selectedCategory === "전체"
                    ? "아직 등록된 옷이 없어요."
                    : `${selectedCategory} 카테고리에 등록된 옷이 없어요.`}
                </h3>

                <p className="mt-3 text-[#687169]">
                  위에서 첫 번째 옷을 등록해보세요.
                </p>
              </div>
            ) : (
              <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredItems.map((item) => (
                  <article
                    key={item.id}
                    className="group overflow-hidden rounded-[1.75rem] border border-[#c5b69d] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                  >
                    {item.image ? (
                      <div className="relative overflow-hidden bg-[#e7dcc8]">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-72 w-full object-cover transition duration-300 group-hover:scale-[1.03]"
                        />

                        <div className="absolute bottom-3 left-3 right-3 flex gap-2">
                          <label className="flex-1 cursor-pointer rounded-full bg-white/90 px-3 py-2 text-center text-xs font-bold text-[#18372d] shadow">
                            사진 변경

                            <input
                              type="file"
                              accept="image/*"
                              onChange={(event) =>
                                updateItemImage(
                                  event,
                                  item.id,
                                )
                              }
                              className="hidden"
                            />
                          </label>

                          <button
                            type="button"
                            onClick={() =>
                              deleteImage(item.id)
                            }
                            className="rounded-full bg-[#18372d]/90 px-4 py-2 text-xs font-bold text-white shadow"
                          >
                            사진 삭제
                          </button>
                        </div>
                      </div>
                    ) : (
                      <label className="flex h-72 cursor-pointer flex-col items-center justify-center bg-[#e8decc] text-center transition hover:bg-[#dfd2bb]">
                        <div className="text-5xl">📷</div>

                        <p className="mt-4 font-serif text-xl font-bold">
                          사진 추가
                        </p>

                        <span className="mt-4 rounded-full bg-[#18372d] px-5 py-2 text-xs font-bold text-[#f8f1e2]">
                          사진 선택
                        </span>

                        <input
                          type="file"
                          accept="image/*"
                          onChange={(event) =>
                            updateItemImage(
                              event,
                              item.id,
                            )
                          }
                          className="hidden"
                        />
                      </label>
                    )}

                    <div className="p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-xs font-semibold tracking-[0.18em] text-[#8a6e39]">
                            {item.category}
                          </p>

                          <h3 className="mt-2 font-serif text-xl font-bold">
                            {item.name}
                          </h3>
                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            deleteItem(item.id)
                          }
                          className="rounded-full border border-[#d1c3aa] px-3 py-1 text-xs font-semibold text-[#6f6658] transition hover:border-[#8a3b32] hover:text-[#8a3b32]"
                        >
                          삭제
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}