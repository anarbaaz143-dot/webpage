"use client";

import { useState, useEffect, useRef } from "react";

interface ImageCarouselProps {
  images: string[];
}

interface LightboxProps {
  images: string[];
  index: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  setIndex: (i: number) => void;
}

const wrap = (val: number, max: number) => (val + max) % max;

function useSwipe(onLeft: () => void, onRight: () => void) {
  const startX = useRef<number | null>(null);

  const onTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (startX.current === null) return;
    const diff = startX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) onLeft();
      else onRight();
    }
    startX.current = null;
  };

  return { onTouchStart, onTouchEnd };
}

function NavArrow({
  direction,
  onClick,
  size = "md",
}: {
  direction: "prev" | "next";
  onClick: (e: React.MouseEvent) => void;
  size?: "md" | "lg";
}) {
  const sizeClass = size === "lg" ? "w-14 h-14 text-2xl" : "w-11 h-11 text-xl";
  const posClass = direction === "prev" ? "left-4" : "right-4";

  return (
    <button
      onClick={(e) => { e.stopPropagation(); onClick(e); }}
      className={`absolute ${posClass} top-1/2 -translate-y-1/2 ${sizeClass} hidden md:flex items-center justify-center bg-black/40 backdrop-blur-md hover:bg-amber-400 hover:text-gray-900 text-white rounded-full border border-white/20 transition-all duration-300 font-bold hover:scale-110`}
    >
      {direction === "prev" ? "‹" : "›"}
    </button>
  );
}

function ThumbnailStrip({
  images,
  activeIndex,
  onSelect,
  size = "md",
}: {
  images: string[];
  activeIndex: number;
  onSelect: (i: number) => void;
  size?: "md" | "sm";
}) {
  const thumbClass = size === "sm" ? "w-14 h-10" : "w-20 h-16";

  return (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide px-2">
      {images.map((img, i) => (
        <button
          key={i}
          onClick={(e) => { e.stopPropagation(); onSelect(i); }}
          className={`flex-shrink-0 ${thumbClass} rounded-xl overflow-hidden border-2 transition-all duration-300 ${
            i === activeIndex
              ? "border-amber-400 scale-105 shadow-[0_0_12px_rgba(251,191,36,0.5)]"
              : "border-transparent opacity-50 hover:opacity-80"
          }`}
        >
          <img src={img} alt="" className="w-full h-full object-cover" />
        </button>
      ))}
    </div>
  );
}

function Lightbox({ images, index, onClose, onPrev, onNext, setIndex }: LightboxProps) {
  const swipe = useSwipe(onNext, onPrev);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    };
    window.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";

    // Push a history state so mobile back button closes lightbox
    window.history.pushState({ lightbox: true }, "");
    const handlePopState = () => onClose();
    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("keydown", handleKey);
      window.removeEventListener("popstate", handlePopState);
      document.body.style.overflow = "";
    };
  }, [onClose, onPrev, onNext]);

  return (
    <div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center"
      style={{ background: "rgba(0,0,0,0.95)" }}
      {...swipe}
    >
      <div className="absolute inset-0" onClick={onClose} />

      {/* Top bar */}
<div className="absolute top-5 left-0 right-0 z-10 px-5 pt-safe" onClick={(e) => e.stopPropagation()}>
        {/* Mobile back button */}
        <button
          onClick={onClose}
          className="flex items-center gap-2 md:hidden bg-white/10 hover:bg-white/20 text-white text-sm font-semibold px-4 py-2 rounded-full border border-white/20 transition-all"
        >
          ← Back
        </button>

        {/* Counter */}
        <div className="bg-white/10 backdrop-blur-md text-white text-xs font-semibold px-4 py-1.5 rounded-full border border-white/20 mx-auto md:mx-0">
          {index + 1} / {images.length}
        </div>

        {/* Desktop close */}
        <button
          onClick={onClose}
          className="hidden md:flex w-11 h-11 items-center justify-center bg-white/10 hover:bg-white/20 text-white rounded-full border border-white/20 transition-all duration-200 hover:scale-110 text-lg"
        >✕</button>
      </div>

{/* Main image with swipe — tap image to close, swipe to navigate */}
<div
  className="relative z-10 flex items-center justify-center w-full h-full px-4 md:px-20 py-16"
  {...swipe}
>
  <img
    key={index}
    src={images[index]}
    alt={`Image ${index + 1}`}
    className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl select-none cursor-pointer"
    style={{ animation: "fadeIn 0.2s ease" }}
    onClick={onClose}
  />
</div>

      {/* Nav arrows — desktop only */}
      {images.length > 1 && (
        <>
          <NavArrow direction="prev" size="lg" onClick={() => onPrev()} />
          <NavArrow direction="next" size="lg" onClick={() => onNext()} />
        </>
      )}

{/* Swipe hint — mobile only */}
{images.length > 1 && (
  <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-10 md:hidden">
    <div className="text-white/40 text-xs font-medium px-3 py-1 rounded-full border border-white/10">
      ← swipe to navigate · tap image to close
    </div>
  </div>
)}

{/* Keyboard hint — desktop only, right side */}
{images.length > 1 && (
  <div className="hidden md:flex absolute right-6 top-1/2 -translate-y-1/2 z-10">
    <div
      className="text-white/35 text-[11px] font-medium px-2.5 py-3 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm whitespace-nowrap"
      
    >
      ← arrow keys · click image to close
    </div>
  </div>
)}

      {/* Thumbnail strip */}
      {images.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 max-w-[90vw]">
          <ThumbnailStrip images={images} activeIndex={index} onSelect={setIndex} size="sm" />
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.97); }
          to   { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}

export default function ImageCarousel({ images }: ImageCarouselProps) {
  const [current, setCurrent] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const swipe = useSwipe(
    () => setCurrent((c) => wrap(c + 1, images.length)),
    () => setCurrent((c) => wrap(c - 1, images.length))
  );

  if (!images || images.length === 0) return null;

  const prev = () => setCurrent((c) => wrap(c - 1, images.length));
  const next = () => setCurrent((c) => wrap(c + 1, images.length));

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const lightboxPrev = () => setLightboxIndex((i) => wrap(i - 1, images.length));
  const lightboxNext = () => setLightboxIndex((i) => wrap(i + 1, images.length));

  return (
    <>
      <div className="relative mb-12">
        <div
          className="relative w-full aspect-[16/9] overflow-hidden rounded-3xl shadow-2xl bg-gray-900 cursor-zoom-in"
          onClick={() => openLightbox(current)}
          {...swipe}
        >
          <img
            key={current}
            src={images[current]}
            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out"
            alt={`Image ${current + 1}`}
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />

          <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-md text-white text-xs font-semibold px-3 py-1.5 rounded-full border border-white/20">
            {current + 1} / {images.length}
          </div>

          <div className="absolute bottom-4 left-4 flex items-center gap-1.5 bg-black/40 backdrop-blur-md text-white/70 text-[11px] px-3 py-1.5 rounded-full border border-white/10 pointer-events-none">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
            </svg>
            <span className="hidden md:inline">Click to zoom</span>
            <span className="md:hidden">Tap to zoom</span>
          </div>

          {images.length > 1 && (
            <>
              <NavArrow direction="prev" onClick={prev} />
              <NavArrow direction="next" onClick={next} />
            </>
          )}
        </div>

        {images.length > 1 && (
          <div className="mt-4">
            <ThumbnailStrip images={images} activeIndex={current} onSelect={setCurrent} size="md" />
          </div>
        )}
      </div>

      {lightboxOpen && (
        <Lightbox
          images={images}
          index={lightboxIndex}
          onClose={() => setLightboxOpen(false)}
          onPrev={lightboxPrev}
          onNext={lightboxNext}
          setIndex={setLightboxIndex}
        />
      )}
    </>
  );
}