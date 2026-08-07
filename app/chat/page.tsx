"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";

type Message = {
  id: number;
  role: "user" | "assistant";
  content: string;
};

type ClothingItem = {
  id: number;
  category: string;
  name: string;
};

const STORAGE_KEY = "fitmate-closet-items";

export default function ChatPage() {
  const [input, setInput] = useState("");
  const [closetItems, setClosetItems] = useState<ClothingItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      role: "assistant",
      content:
        "안녕하세요. FitMate AI 스타일리스트예요. 오늘의 날씨, 장소, 입고 싶은 옷을 알려주세요.",
    },
  ]);

  useEffect(() => {
    const savedItems = localStorage.getItem(STORAGE_KEY);

    if (!savedItems) {
      return;
    }

    try {
      setClosetItems(JSON.parse(savedItems));
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const question = input.trim();

    if (!question || isLoading) {
      return;
    }

    const userMessage: Message = {
      id: Date.now(),
      role: "user",
      content: question,
    };

    setMessages((current) => [...current, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: question,
          closetItems,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "AI 요청에 실패했어요.");
      }

      const assistantMessage: Message = {
        id: Date.now() + 1,
        role: "assistant",
        content: data.answer,
      };

      setMessages((current) => [
        ...current,
        assistantMessage,
      ]);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "AI 답변을 불러오지 못했어요.";

      setMessages((current) => [
        ...current,
        {
          id: Date.now() + 1,
          role: "assistant",
          content: `오류가 발생했어요.\n\n${message}`,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#eee6d8] px-6 py-10 text-[#1d2c25]">
      <section className="mx-auto max-w-4xl">
        <Link
          href="/"
          className="inline-flex items-center text-sm font-semibold text-[#59635b] transition hover:text-[#18372d]"
        >
          ← 홈으로 돌아가기
        </Link>

        <div className="mt-8 overflow-hidden rounded-[2rem] border border-[#b9aa90] bg-[#f8f2e7] shadow-xl">
          <header className="bg-[#18372d] px-7 py-7 text-[#f8f1e2] md:px-10">
            <p className="text-xs font-semibold tracking-[0.25em] text-[#d3b16c]">
              PERSONAL STYLE CONCIERGE
            </p>

            <h1 className="mt-3 font-serif text-3xl font-bold md:text-4xl">
              AI 스타일리스트
            </h1>

            <p className="mt-3 text-[#ddd5c5]">
              현재 등록된 옷 {closetItems.length}개를 함께 참고해 답변합니다.
            </p>
          </header>

          <div className="min-h-[480px] space-y-5 p-6 md:p-9">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.role === "user"
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[88%] whitespace-pre-line rounded-3xl px-5 py-4 leading-7 md:max-w-[75%] ${
                    message.role === "user"
                      ? "rounded-br-md bg-[#18372d] text-[#f8f1e2]"
                      : "rounded-bl-md border border-[#c5b69d] bg-white"
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="rounded-3xl rounded-bl-md border border-[#c5b69d] bg-white px-5 py-4 text-[#687169]">
                  코디를 고민하고 있어요...
                </div>
              </div>
            )}
          </div>

          <form
            onSubmit={handleSubmit}
            className="border-t border-[#c5b69d] bg-[#eee4d3] p-5 md:p-7"
          >
            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="예: 내 옷장으로 오늘 백화점 코디 추천해줘"
                className="min-w-0 flex-1 rounded-2xl border border-[#b9aa90] bg-white px-5 py-4 outline-none transition focus:border-[#18372d]"
              />

              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="rounded-2xl bg-[#d3b16c] px-7 py-4 font-bold text-[#18372d] transition hover:bg-[#e2c789] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isLoading ? "답변 중..." : "추천받기"}
              </button>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {[
                "내 옷장으로 데이트 코디 추천해줘",
                "오늘 31도인데 뭐 입지?",
                "검정 셔츠에 어울리는 하의 추천해줘",
                "백화점 갈 때 깔끔하게 입고 싶어",
              ].map((example) => (
                <button
                  key={example}
                  type="button"
                  onClick={() => setInput(example)}
                  className="rounded-full border border-[#b9aa90] bg-[#f8f2e7] px-4 py-2 text-sm transition hover:border-[#18372d]"
                >
                  {example}
                </button>
              ))}
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}