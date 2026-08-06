"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

type Message = {
  id: number;
  role: "user" | "assistant";
  content: string;
};

function createStylingAnswer(question: string) {
  const text = question.replaceAll(" ", "").toLowerCase();

  const isHot =
    text.includes("덥") ||
    text.includes("30도") ||
    text.includes("31도") ||
    text.includes("32도") ||
    text.includes("33도") ||
    text.includes("34도") ||
    text.includes("35도");

  const isCold =
    text.includes("춥") ||
    text.includes("겨울") ||
    text.includes("영하");

  const isRainy =
    text.includes("비") ||
    text.includes("장마") ||
    text.includes("우산");

  const isDate =
    text.includes("데이트") ||
    text.includes("소개팅") ||
    text.includes("약속");

  const isDepartmentStore =
    text.includes("백화점") ||
    text.includes("쇼핑");

  const isWork =
    text.includes("출근") ||
    text.includes("회사") ||
    text.includes("직장");

  const hasBlackShirt =
    text.includes("검정셔츠") ||
    text.includes("블랙셔츠") ||
    text.includes("검은셔츠");

  if (isHot && isRainy) {
    return `덥고 비가 오는 날에는 통기성과 건조 속도가 중요해요.

추천 코디
• 상의: 얇은 반팔 또는 린넨 셔츠
• 하의: 가벼운 반바지나 얇은 팬츠
• 신발: 물에 강하고 관리가 쉬운 신발

밝은 크림색 하의는 빗물 자국이 눈에 띌 수 있으므로, 흐린 날에는 그레이나 블랙 계열도 좋아요.`;
  }

  if (isDate && hasBlackShirt) {
    return `검정 셔츠는 데이트 코디로 충분히 좋아요.

추천 조합
• 상의: 검정 옥스포드 셔츠
• 하의: 아이보리 또는 크림 팬츠
• 신발: 흰색 스니커즈
• 이너: 깔끔한 흰색 티셔츠

셔츠를 완전히 잠그기보다 자연스럽게 열어 입으면 인상이 부드러워져요.`;
  }

  if (isDate) {
    return `데이트라면 단정하면서도 과하게 꾸민 느낌이 나지 않는 조합이 좋아요.

추천 코디
• 상의: 네이비 또는 검정 셔츠
• 하의: 크림 팬츠나 깔끔한 슬랙스
• 신발: 흰색 스니커즈 또는 로퍼

전체 색상은 세 가지 이내로 정리하면 훨씬 세련돼 보여요.`;
  }

  if (isDepartmentStore) {
    return `백화점에서는 깔끔함과 편안함을 함께 챙기는 게 좋아요.

추천 코디
• 상의: 셔츠나 얇은 니트
• 하의: 플리츠 팬츠 또는 슬랙스
• 신발: 오래 걸어도 편한 스니커즈

실내 냉방이 강할 수 있으므로 얇은 겉옷도 잘 어울려요.`;
  }

  if (isWork) {
    return `출근 코디는 신뢰감 있고 정돈된 색 조합이 좋아요.

추천 코디
• 상의: 네이비 셔츠
• 하의: 차콜 또는 검정 슬랙스
• 신발: 로퍼나 단정한 스니커즈

핏은 너무 크지 않은 세미오버 정도가 안정적이에요.`;
  }

  if (isHot) {
    return `기온이 높은 날에는 소재와 통풍을 먼저 고려해야 해요.

추천 코디
• 상의: 반팔 티셔츠 또는 린넨 셔츠
• 하의: 반바지나 얇은 와이드 팬츠
• 신발: 가벼운 스니커즈 또는 샌들

검정색을 입는다면 상하의 중 한쪽만 어둡게 두는 것이 시원해 보여요.`;
  }

  if (isCold) {
    return `추운 날에는 보온성을 챙기면서 색을 무겁지 않게 정리해보세요.

추천 코디
• 상의: 니트 또는 목폴라
• 하의: 두께감 있는 슬랙스
• 아우터: 코트나 패딩
• 신발: 가죽 신발 또는 두꺼운 스니커즈

네이비·브라운·크림 조합은 클래식한 분위기를 내기 좋아요.`;
  }

  if (hasBlackShirt) {
    return `검정 셔츠는 활용도가 높은 아이템이에요.

잘 어울리는 하의
• 아이보리
• 크림
• 라이트 그레이
• 연청 데님

신발은 흰색 스니커즈를 매치하면 깔끔하고, 브라운 로퍼를 신으면 더 클래식해 보여요.`;
  }

  return `좋은 코디를 추천하려면 상황과 날씨를 조금 더 알려주세요.

예를 들어 이렇게 질문해보세요.

• 오늘 31도인데 백화점 갈 때 뭐 입지?
• 검정 셔츠에 아이보리 반바지 괜찮아?
• 비 오는 날 데이트 코디 추천해줘
• 내 옷장에 있는 옷으로 추천해줘`;
}

export default function ChatPage() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      role: "assistant",
      content:
        "안녕하세요. FitMate AI 스타일리스트예요. 오늘의 날씨, 장소, 입고 싶은 옷을 알려주세요.",
    },
  ]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedInput = input.trim();

    if (!trimmedInput) {
      return;
    }

    const userMessage: Message = {
      id: Date.now(),
      role: "user",
      content: trimmedInput,
    };

    const assistantMessage: Message = {
      id: Date.now() + 1,
      role: "assistant",
      content: createStylingAnswer(trimmedInput),
    };

    setMessages((currentMessages) => [
      ...currentMessages,
      userMessage,
      assistantMessage,
    ]);

    setInput("");
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
              날씨, 장소와 고민 중인 옷을 자유롭게 입력해보세요.
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
                  className={`max-w-[85%] whitespace-pre-line rounded-3xl px-5 py-4 leading-7 md:max-w-[72%] ${
                    message.role === "user"
                      ? "rounded-br-md bg-[#18372d] text-[#f8f1e2]"
                      : "rounded-bl-md border border-[#c5b69d] bg-white"
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}
          </div>

          <form
            onSubmit={handleSubmit}
            className="border-t border-[#c5b69d] bg-[#eee4d3] p-5 md:p-7"
          >
            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="예: 오늘 31도인데 데이트할 때 뭐 입지?"
                className="min-w-0 flex-1 rounded-2xl border border-[#b9aa90] bg-white px-5 py-4 outline-none transition focus:border-[#18372d]"
              />

              <button
                type="submit"
                disabled={!input.trim()}
                className="rounded-2xl bg-[#d3b16c] px-7 py-4 font-bold text-[#18372d] transition hover:bg-[#e2c789] disabled:cursor-not-allowed disabled:opacity-50"
              >
                추천받기
              </button>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {[
                "오늘 31도인데 뭐 입지?",
                "검정 셔츠 코디해줘",
                "데이트 코디 추천해줘",
                "비 오는 날 뭐 입지?",
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