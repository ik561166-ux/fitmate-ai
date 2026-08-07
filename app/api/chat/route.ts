import OpenAI from "openai";
import { NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const message = body.message?.trim();
    const closetItems = body.closetItems ?? [];

    if (!message) {
      return NextResponse.json(
        { error: "질문을 입력해주세요." },
        { status: 400 },
      );
    }

    const closetText =
      closetItems.length > 0
        ? closetItems
            .map(
              (item: { category: string; name: string }) =>
                `- ${item.category}: ${item.name}`,
            )
            .join("\n")
        : "등록된 옷이 없습니다.";

    const response = await openai.responses.create({
      model: "gpt-5-mini",
      store: false,
      instructions: `
당신은 FitMate AI의 패션 스타일리스트입니다.

항상 한국어로 답변하세요.

사용자의 질문과 보유 옷을 바탕으로
실제로 입을 수 있는 코디를 추천하세요.

가능하면 아래 요소를 고려하세요.

- 날씨
- 장소
- 상황
- 색상 조합
- 상의
- 하의
- 신발
- 아우터

사용자가 자신의 옷장으로 추천해달라고 하면
등록된 옷을 우선 사용하세요.

답변은 너무 길지 않게,
읽기 쉽고 자연스럽게 작성하세요.
      `.trim(),

      input: `
사용자의 질문:
${message}

사용자의 옷장:
${closetText}
      `.trim(),
    });

    return NextResponse.json({
      answer: response.output_text,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "AI 답변을 불러오지 못했어요.",
      },
      { status: 500 },
    );
  }
}