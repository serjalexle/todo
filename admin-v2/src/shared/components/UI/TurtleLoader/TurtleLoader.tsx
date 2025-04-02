"use client";

import { useEffect, useState } from "react";
import { Box, Fade } from "@mui/material";
import { useLoaderStore } from "@/shared/store/useLoaderStore";
import Image from "next/image";

// * SVG-черепашка має бути в /public/images/turtle.svg

const TurtleLoader = () => {
  const { visible } = useLoaderStore();
  const [internalVisible, setInternalVisible] = useState(false);
  const [wave, setWave] = useState(false);

  // * Локальний control для хвилі
  useEffect(() => {
    if (visible) {
      setInternalVisible(true);
      setWave(true);
    } else {
      setTimeout(() => setInternalVisible(false), 500);
    }
  }, [visible]);

  return (
    <Fade in={internalVisible} timeout={300} unmountOnExit>
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          backgroundColor: "rgba(0, 0, 0, 0.7)",
          zIndex: 999999,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            position: "relative",
            width: 80,
            height: 80,
          }}
        >
          {/* Поточна черепаха */}
          <Image
            src="/images/LOGO.png"
            alt="turtle"
            fill
            style={{
              animation: wave ? "fadeout 2s linear forwards infinite" : undefined,
            }}
            // onAnimationEnd={() => setWave(false)}
          />

          {/* Нова, яка вже зʼявляється */}
          {wave && (
            <Image
              src="/images/LOGO.png"
              alt="turtle"
              fill
              style={{
                animation: "fadein 2s linear forwards",
                position: "absolute",
                top: 0,
                left: 0,
              }}
            />
          )}

          <style jsx global>{`
            @keyframes fadeout {
              0% {
                opacity: 1;
                transform: scale(1);
              }
              100% {
                opacity: 0;
                transform: scale(1.5);
              }
            }

            @keyframes fadein {
              0% {
                opacity: 0;
                transform: scale(0.9);
              }
              100% {
                opacity: 1;
                transform: scale(1);
              }
            }
          `}</style>
        </Box>
      </Box>
    </Fade>
  );
};

export default TurtleLoader;
