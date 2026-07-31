import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { messages, apiKey: clientApiKey } = await req.json();

    // Use environment variable OPENAI_API_KEY or client provided API key
    const apiKey = process.env.OPENAI_API_KEY || clientApiKey;

    if (!apiKey) {
      return NextResponse.json(
        {
          error:
            "OpenAI API 키가 설정되지 않았습니다. Vercel 환경변수에 OPENAI_API_KEY를 등록하거나 챗봇 설정창에서 API 키를 입력해주세요.",
        },
        { status: 400 }
      );
    }

    const systemPrompt = {
      role: "system",
      content:
        "너는 친절하고 명쾌한 중·고등학교 수학 전문 교사 '아궁진영 수학 선생님'이야. 학생이 수학 개념이나 문제풀이에 대해 질문하면 다음과 같이 답변해줘:\n" +
        "1. 친절하고 격려하는 말투(~해요, ~해보세요)를 사용한다.\n" +
        "2. 문제 풀이의 경우 개념 힌트 -> 풀이 과정 -> 최종 정답 순으로 단계별(Step-by-step)로 나누어 쉽고 명확하게 설명한다.\n" +
        "3. 수식이나 공식은 이해하기 쉽게 기호와 함께 표현한다.",
    };

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [systemPrompt, ...messages],
        temperature: 0.7,
        max_tokens: 800,
      }),
    });

    if (!response.ok) {
      const errData = await response.json();
      return NextResponse.json(
        { error: errData.error?.message || "OpenAI API 호출 실패" },
        { status: response.status }
      );
    }

    const data = await response.json();
    const botMessage = data.choices[0]?.message?.content || "답변을 생성하지 못했습니다.";

    return NextResponse.json({ reply: botMessage });
  } catch (error: any) {
    console.error("Chatbot API error:", error);
    return NextResponse.json(
      { error: error.message || "서버 에러가 발생했습니다." },
      { status: 500 }
    );
  }
}
