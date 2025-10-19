import { NextResponse } from "next/server";

const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

interface Data {
  lat: number;
  lon: number;
}

export async function POST(req: Request) {
  try {
    const body: Data = await req.json();
    console.log(body);
    const text = `
    Геолокація штріха
    Широта:${body.lat},
    Долгота:${body.lon}
    `;
    // Отправка сообщения в Telegram
    const tgRes = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: CHAT_ID,
          text,
          parse_mode: "HTML",
        }),
      }
    );

    if (!tgRes.ok) {
      const err = await tgRes.text();
      throw new Error(`Telegram error: ${err}`);
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("❌ Ошибка отправки в Telegram:", error);
    return NextResponse.json({ status: 500 });
  }
}
