"use client";

import { useEffect, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";

const AUTOPLAY_VIDEO_ID = "udtGzbblnMw";

export function AutoplayMusic() {
  const [hasSound, setHasSound] = useState(false);
  const [stopped, setStopped] = useState(false);

  useEffect(() => {
    // Quando o usuário clicar em qualquer lugar na página, ativar som
    const handleClick = () => {
      if (!hasSound && !stopped) {
        setHasSound(true);
      }
    };
    document.addEventListener("click", handleClick, { once: true });
    return () => document.removeEventListener("click", handleClick);
  }, [hasSound, stopped]);

  if (stopped) return null;

  return (
    <>
      {/* iframe escondido - começa mudo, depois com som */}
      <iframe
        key={hasSound ? "sound" : "muted"}
        src={`https://www.youtube.com/embed/${AUTOPLAY_VIDEO_ID}?autoplay=1&mute=${hasSound ? 0 : 1}&enablejsapi=1`}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        className="hidden"
        title="background music"
      />

      {/* Banner flutuante */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 bg-black/90 border border-primary/50 text-white px-5 py-3 rounded-full shadow-lg shadow-primary/20 backdrop-blur-sm">
        {hasSound ? (
          <>
            <Volume2 className="w-5 h-5 text-primary animate-pulse" />
            <span className="text-sm font-medium">Música tocando</span>
          </>
        ) : (
          <>
            <VolumeX className="w-5 h-5 text-primary" />
            <button
              onClick={() => setHasSound(true)}
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Clique para ativar o som
            </button>
          </>
        )}
        <button
          onClick={() => setStopped(true)}
          className="flex items-center gap-1.5 text-sm bg-primary/20 hover:bg-primary/40 border border-primary/50 text-primary px-3 py-1 rounded-full transition-colors ml-1"
        >
          <VolumeX className="w-4 h-4" />
          Parar
        </button>
      </div>
    </>
  );
}
