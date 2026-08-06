"use client";

import Link from "next/link";
import { useState } from "react";

type ClothingItem = {
  category: string;
  name: string;
};

export default function ClosetPage() {
  const [category, setCategory] = useState("상의");
  const [name, setName] = useState("");
  const [items, setItems] = useState<ClothingItem[]>([]);

  const addItem = () => {
    if (name.trim() === "") return;

    setItems([...items, { category, name }]);
    setName("");
  };

  return (
    <main className="min-h-screen bg-gray-100 px-6 py-12">
      <section className="mx-auto max-w-3xl">

        <Link
          href="/"
          className="text-gray-600 hover:text-black"
        >
          ← 홈으로
        </Link>

        <div className="mt-8 rounded-3xl bg-white p-8 shadow-xl">

          <h1 className="text-4xl font-bold">
            👔 내 옷장
          </h1>

          <p className="mt-3 text-gray-500">
            가지고 있는 옷을 등록해보세요.
          </p>

          <div className="mt-8 space-y-4">

            <select
              value={category}
              onChange={(e)=>setCategory(e.target.value)}
              className="w-full rounded-xl border p-3"
            >
              <option>상의</option>
              <option>하의</option>
              <option>신발</option>
              <option>아우터</option>
            </select>

            <input
              value={name}
              onChange={(e)=>setName(e.target.value)}
              placeholder="예) 검정 옥스포드 셔츠"
              className="w-full rounded-xl border p-3"
            />

            <button
              onClick={addItem}
              className="w-full rounded-xl bg-black py-3 font-bold text-white hover:bg-gray-800"
            >
              옷 등록하기
            </button>

          </div>

          <div className="mt-10">

            <h2 className="text-2xl font-bold">
              등록된 옷
            </h2>

            {items.length === 0 ? (

              <p className="mt-4 text-gray-500">
                아직 등록된 옷이 없습니다.
              </p>

            ) : (

              <div className="mt-5 space-y-3">

                {items.map((item,index)=>(
                  <div
                    key={index}
                    className="flex justify-between rounded-xl border p-4"
                  >
                    <span>{item.category}</span>

                    <span className="font-bold">
                      {item.name}
                    </span>

                  </div>
                ))}

              </div>

            )}

          </div>

        </div>

      </section>
    </main>
  );
}