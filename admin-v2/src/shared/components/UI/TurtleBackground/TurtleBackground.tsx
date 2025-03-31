"use client";

import { Box } from "@mui/material";
import Image from "next/image";
import { useEffect, useState } from "react";

// * Випадково згенеровані черепашки — тільки на клієнті
const generateTurtles = () =>
  Array.from({ length: 5 }).map(() => ({
    top: `${Math.random() * 90}%`,
    left: `${Math.random() * 90}%`,
    size: Math.random() * 40 + 40,
    rotate: Math.random() * 360,
    opacity: Math.random() * 0.2 + 0.05,
  }));

const TurtleBackground = () => {
  const [turtles, setTurtles] = useState<
    | {
        top: string;
        left: string;
        size: number;
        rotate: number;
        opacity: number;
      }[]
    | null
  >(null); // Зберігаємо черепашок у стані

  useEffect(() => {
    const result = generateTurtles();
    setTurtles(result); // генеруємо лише після mount
  }, []);

  if (!turtles) return null;

  return (
    <Box
      sx={{
        position: "absolute",
        inset: 0,
        zIndex: 0,
        overflow: "hidden",
        pointerEvents: "none",
      }}
    >
      {turtles.map((turtle, i) => (
        <Box
          key={i}
          sx={{
            position: "absolute",
            top: turtle.top,
            left: turtle.left,
            width: turtle.size,
            height: turtle.size,
            opacity: turtle.opacity,
            transform: `rotate(${turtle.rotate}deg)`,
          }}
        >
          <Image
            src="/images/LOGO.png"
            alt="bg turtle"
            width={turtle.size}
            height={turtle.size}
            style={{ objectFit: "contain" }}
          />
        </Box>
      ))}
    </Box>
  );
};

export default TurtleBackground;
