"use client";

import Image from "next/image";
import Waves from "./Waves";
import RevealOnScroll from "./RevealOnScroll";

export default function HeroGallery() {
  return (
    <div className="relative w-full max-w-[500px] mx-auto md:mx-0">
      {/* ── Background Arch Decoration ────────────────── */}
      <div
        className="absolute inset-x-0 -inset-y-10 pointer-events-none select-none z-0 flex justify-center text-center"
        aria-hidden="true"
      >
        <div 
          className="w-[88%] h-full bg-white/5 overflow-hidden transition-opacity duration-700 delay-150 relative isolate"
          style={{ 
            borderRadius: '100% 100% 0 0 / 32% 32% 0 0',
            transform: 'translateZ(0)'
          }}
        >
          {/* The Waves Interaction */}
          <Waves
            lineColor="oklch(82% 0.16 85 / 0.12)"
            backgroundColor="transparent"
            waveSpeedX={0.015}
            waveSpeedY={0.01}
            waveAmpX={35}
            waveAmpY={25}
            xGap={14}
            yGap={38}
          />
        </div>
      </div>

      {/* Primary Image (The Arched living room) */}
      <RevealOnScroll className="relative z-10 w-[90%] md:w-full">
        <div className="relative overflow-hidden rounded-t-[60px] md:rounded-t-[100px] rounded-b-lg border border-line shadow-sm">
          <Image
            src="/hero_main_midnight_1775841918533.png"
            alt="صالة معيشة فاخرة بتصاميم ليلية مبهرة"
            width={800}
            height={1066}
            className="object-cover w-full h-auto"
            priority
          />
        </div>
      </RevealOnScroll>

      {/* Floating Bedroom (Circular) — Safe position away from divider */}
      <RevealOnScroll
        className="absolute -top-6 -end-2 md:-top-12 md:-end-4 z-20 w-[40%] md:w-[45%] group"
        delay={200}
      >
        <div className="relative aspect-square rounded-full overflow-hidden border-[6px] border-bg shadow-2xl transition-transform duration-500 group-hover:scale-105">
          <Image
            src="/decor_bedroom_midnight_1775841830474.png"
            alt="غرفة نوم راقية"
            fill
            className="object-cover"
          />
        </div>
      </RevealOnScroll>

      {/* Floating Kitchen (Rectangular) */}
      <RevealOnScroll
        className="absolute bottom-[20%] -end-[8%] md:-end-[20%] z-30 w-[50%] md:w-[55%] group"
        delay={400}
      >
        <div className="relative aspect-[4/3] rounded-sm overflow-hidden border border-line shadow-xl transition-transform duration-500 group-hover:-translate-y-2">
          <Image
            src="/decor_kitchen_midnight_1775841809988.png"
            alt="مطبخ مودرن بتفاصيل رخامية"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
            <span className="text-white text-xs font-medium">تفاصيل عصرية</span>
          </div>
        </div>
      </RevealOnScroll>

      {/* Accent Foyer (Rotated) */}
      <RevealOnScroll
        className="absolute -bottom-4 -start-4 md:-bottom-8 md:-start-6 z-20 w-[30%]"
        delay={600}
      >
        <div className="relative aspect-square rounded-md overflow-hidden border-4 border-bg shadow-lg -rotate-6 transition-all duration-500 hover:rotate-0 hover:scale-110">
          <Image
            src="/decor_foyer_midnight_1775841853922.png"
            alt="مدخل منزل فخم"
            fill
            className="object-cover"
          />
        </div>
      </RevealOnScroll>
    </div>
  );
}
