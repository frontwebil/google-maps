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
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Ошибка получения геолокации:", error);
        }
      );
    } else {
      console.log("Геолокация не поддерживается браузером");
    }
  }, []);

  return (
    <div className="">
      <Image src={"/1.jpg"} width={500} height={500} alt="map" />
      <div className="">{location?.lat}</div>
      <div className="">{location?.lon}</div>
    </div>
  );
}
