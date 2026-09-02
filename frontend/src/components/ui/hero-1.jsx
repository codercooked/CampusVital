import React from 'react';
import { ChevronRight } from "lucide-react"
import { Button } from "./button"

export function Hero({
  eyebrow = "Innovate Without Limits",
  title,
  subtitle,
  ctaLabel = "Explore Now",
  ctaHref = "#",
}) {
  return (
    <section
      id="hero"
      className="relative mx-auto w-full pt-40 px-6 text-center md:px-8 
      min-h-[calc(100vh-40px)] overflow-hidden 
      bg-[linear-gradient(to_bottom,#000000,#000000_30%,#1a2333_78%,#000000_99%_50%)] 
      rounded-b-xl"
    >
      {/* Grid BG */}
      <div
        className="absolute -z-10 inset-0 opacity-100 h-full w-full 
        bg-[linear-gradient(to_right,rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.08)_1px,transparent_1px)]
        bg-[size:4rem_4rem] 
        [mask-image:radial-gradient(ellipse_100%_100%_at_50%_0%,#000_80%,transparent_110%)]"
      />

      {/* Radial Accent */}
      <div
        className="absolute left-1/2 top-[calc(100%-90px)] lg:top-[calc(100%-150px)] 
        h-[500px] w-[700px] md:h-[500px] md:w-[1100px] lg:h-[750px] lg:w-[140%] 
        -translate-x-1/2 rounded-[100%] border-[#FFFFFF]/30 bg-[#000000] 
        bg-[radial-gradient(closest-side,#FFFFFF_10%,#000000_82%)] 
        animate-[fade-up_0.5s_ease-out_forwards]"
      />

      {/* Eyebrow */}
      {eyebrow && (
        <a href={ctaHref} className="group inline-block">
          <span
            className="text-sm text-[rgba(240,244,255,0.7)] font-heading mx-auto px-5 py-2 
            bg-gradient-to-tr from-[#FFFFFF]/10 via-[#888888]/10 to-transparent  
            border-[2px] border-[rgba(255,255,255,0.2)] 
            rounded-3xl w-fit tracking-tight uppercase flex items-center justify-center"
          >
            {eyebrow}
            <ChevronRight className="inline w-4 h-4 ml-2 text-[#FFFFFF] transition-transform duration-300 group-hover:translate-x-1" />
          </span>
        </a>
      )}

      {/* Title */}
      <h1
        className="animate-[fade-in_0.5s_ease-out_forwards] -translate-y-4 text-balance 
        bg-gradient-to-br from-white from-30% to-white/40 
        bg-clip-text py-6 text-5xl font-bold leading-none tracking-tight 
        text-transparent opacity-0 sm:text-6xl md:text-7xl lg:text-8xl 
        font-heading"
      >
        {title}
      </h1>

      {/* Subtitle */}
      <p
        className="animate-[fade-in_0.5s_ease-out_forwards] mb-12 -translate-y-4 text-balance 
        text-lg tracking-tight text-[rgba(240,244,255,0.7)] 
        opacity-0 md:text-xl font-medium max-w-3xl mx-auto"
      >
        {subtitle}
      </p>

      {/* CTA */}
      {ctaLabel && (
        <div className="flex justify-center">
          <Button
            asChild
            className="mt-[-20px] w-fit md:w-52 z-20 font-heading tracking-tight text-center text-lg bg-[#FFFFFF] text-[#000000] hover:bg-[#FFFFFF]/90 shadow-[0_0_15px_rgba(255,255,255,0.3)] h-12 rounded-xl"
          >
            <a href={ctaHref}>{ctaLabel}</a>
          </Button>
        </div>
      )}

      {/* Bottom Fade */}
      <div
        className="animate-[fade-up_0.5s_ease-out_forwards] relative mt-32 opacity-0 [perspective:2000px] 
        after:absolute after:inset-0 after:z-50 
        after:[background:linear-gradient(to_top,#000000_10%,transparent)]"
      />
    </section>
  )
}
