import React from "react";
import Link from "next/link";
import { TopNavBar } from "@/components/landing/navigation";
import { AcrylicGlass } from "@/components/react-bits/acrylicGlass";
import { Zap, BookOpen, User, ArrowRight } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col">
      <TopNavBar />

      {/* Added pt-24 md:pt-32 to safely clear the floating responsive nav ribbon */}
      <main className="flex-grow flex flex-col z-10 w-full max-w-7xl mx-auto px-4 sm:px-8 relative pt-24 md:pt-32">

        {/* HERO SECTION */}
        <section className="mb-24 md:mb-32 grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="flex flex-col gap-6 md:gap-8 items-start animate-fadeInUp">
            <div className="glass-panel px-4 py-1.5 rounded-full flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-outline-variant/60"></span>
              <span className="text-[10px] sm:text-xs font-semibold tracking-wider text-on-surface-variant uppercase font-inter">
                The Digital Curator
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-manrope font-extrabold tracking-tight leading-[1.1]">
              AI-Powered <br />
              Learning{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary-container text-glow">
                Architecture
              </span>
            </h1>

            <p className="text-base sm:text-lg text-on-surface-variant font-inter max-w-lg leading-relaxed">
              Experience a sophisticated, high-end editorial learning journey.
              Raphael curates fluid, self-generating courses tailored to your
              unique cognitive signature.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2 sm:pt-4">
              <Link
                href="/generator"
                className="primary-gradient-btn px-6 py-3 font-semibold text-sm shadow-violet-cta transition-transform hover:scale-105 active:scale-95 duration-400 inline-flex"
              >
                Start Generating
              </Link>
              <Link
                href="/courses"
                className="glass-button px-6 py-3 font-semibold text-sm text-on-surface hover:bg-surface-container-highest transition-colors duration-400 inline-flex border border-outline-variant/20"
              >
                View Showcases
              </Link>
            </div>
          </div>

          <div className="relative flex justify-center lg:justify-end animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
            <AcrylicGlass
              radius="rounded-3xl"
              // Uses aspect-square to remain perfectly relative regardless of screen width
              className="w-full max-w-sm sm:max-w-md aspect-square flex flex-col justify-end p-6 sm:p-8 transform rotate-3 hover:rotate-0 transition-transform duration-700 ease-soft cursor-pointer"
            >
              <div className="relative z-10 flex flex-col gap-1.5 sm:gap-2">
                <span className="text-[9px] sm:text-[10px] font-bold tracking-widest text-primary uppercase">
                  Active Insight
                </span>
                <span className="text-lg sm:text-xl font-manrope font-semibold text-on-surface">
                  Neural Curriculum v2.4
                </span>
              </div>
            </AcrylicGlass>
          </div>
        </section>

        {/* ENGINEERED FOR INTENT SECTION */}
        <section className="mb-24 md:mb-32 flex flex-col gap-8 md:gap-12">
          <div className="flex flex-col gap-3 sm:gap-4">
            <h2 className="text-3xl sm:text-4xl font-manrope font-bold text-on-surface">Engineered for Intent</h2>
            <div className="w-12 sm:w-16 h-0.5 bg-primary rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

            {/* Small Card 1 */}
            <AcrylicGlass className="flex flex-col items-start gap-4 sm:gap-6 p-6 sm:p-8 hover:-translate-y-1 transition-transform duration-400 group">
              <div className="p-3 bg-primary/20 rounded-2xl flex items-center justify-center shrink-0">
                <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
              </div>
              <div className="flex flex-col gap-2 sm:gap-3 flex-grow">
                <h3 className="font-manrope font-bold text-lg sm:text-xl text-on-surface">Instant Generation</h3>
                <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
                  Input any topic, and witness the immediate synthesis of a structured, multi-dimensional curriculum designed for your specific expertise level.
                </p>
              </div>
              <Link href="/technology" className="mt-auto pt-2 flex items-center gap-2 text-primary font-semibold text-xs sm:text-sm">
                Explore Technology
                <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </AcrylicGlass>

            {/* Small Card 2 */}
            <AcrylicGlass className="flex flex-col items-start gap-4 sm:gap-6 p-6 sm:p-8 hover:-translate-y-1 transition-transform duration-400 group">
              <div className="p-3 bg-secondary/20 rounded-2xl flex items-center justify-center shrink-0">
                <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-secondary" />
              </div>
              <div className="flex flex-col gap-2 sm:gap-3 flex-grow">
                <h3 className="font-manrope font-bold text-lg sm:text-xl text-on-surface">Fluid Learning</h3>
                <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
                  A living architecture that adapts as you progress. The curriculum evolves based on your mastery and curiosity spikes.
                </p>
              </div>
            </AcrylicGlass>

            {/* Small Card 3 */}
            <AcrylicGlass className="flex flex-col items-start gap-4 sm:gap-6 p-6 sm:p-8 hover:-translate-y-1 transition-transform duration-400 group md:col-span-2 lg:col-span-1">
              <div className="p-3 bg-tertiary/20 rounded-2xl flex items-center justify-center shrink-0">
                <User className="w-5 h-5 sm:w-6 sm:h-6 text-tertiary" />
              </div>
              <div className="flex flex-col gap-2 sm:gap-3 flex-grow">
                <h3 className="font-manrope font-bold text-lg sm:text-xl text-on-surface">Personalized Curators</h3>
                <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
                  Intelligent agents that guide your focus, offering critical insights and context that traditional platforms miss.
                </p>
              </div>
            </AcrylicGlass>

            {/* Wide Bottom Card */}
            <div className="md:col-span-2 lg:col-span-3">
              <Link href="/courses" className="block group hover:-translate-y-1 transition-transform duration-400 h-full">
                {/* Uses responsive padding (p-8 to p-12) to determine height rather than forcing min-h */}
                <AcrylicGlass className="flex flex-col justify-end p-8 sm:p-10 lg:p-14 relative h-full">
                  <div className="absolute inset-0 bg-gradient-to-br from-surface-container-highest/80 via-surface-container/50 to-transparent opacity-40 group-hover:opacity-60 transition-opacity duration-700"></div>

                  <div className="relative z-10 flex flex-col gap-2 sm:gap-3 max-w-2xl mt-12 sm:mt-24">
                    <h3 className="text-2xl sm:text-3xl lg:text-4xl font-manrope font-bold text-on-surface">Master any domain.</h3>
                    <p className="text-on-surface-variant leading-relaxed text-xs sm:text-sm">
                      From deep-tech engineering to classical philosophy, Raphael builds the bridge.
                    </p>
                  </div>
                </AcrylicGlass>
              </Link>
            </div>

          </div>
        </section>

        {/* CTA SECTION */}
        <section className="mb-24 flex justify-center w-full">
          <div className="w-full max-w-4xl">
            <AcrylicGlass radius="rounded-[32px]" className="p-8 sm:p-12 lg:p-20 flex flex-col items-center text-center gap-6 sm:gap-8 shadow-glow-violet-sm">
              <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent opacity-30"></div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-manrope font-extrabold max-w-2xl leading-tight text-on-surface relative z-10">
                Ready to architect your own{" "}
                <span className="text-primary text-glow">intelligence</span>?
              </h2>

              <p className="text-on-surface-variant max-w-xl text-xs sm:text-sm lg:text-base relative z-10">
                Join the vanguard of AI-driven learning. Join Raphael today and transform how you perceive, digest, and master information.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mt-2 sm:mt-4 relative z-10 w-full sm:w-auto">
                <Link
                  href="/generator"
                  className="primary-gradient-btn w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 font-semibold text-sm shadow-violet-cta hover:scale-105 active:scale-95 transition-transform duration-400 flex justify-center"
                >
                  Create First Course
                </Link>
                <Link
                  href="/demo"
                  className="glass-button w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 font-semibold text-sm text-on-surface hover:bg-surface-container-highest transition-colors duration-400 flex justify-center border border-outline-variant/30"
                >
                  Schedule Demo
                </Link>
              </div>
            </AcrylicGlass>
          </div>
        </section>

      </main>

      <footer className="w-full py-8 text-center text-[10px] sm:text-xs text-on-surface-variant/60 font-inter border-t border-outline-variant/10 bg-background/50 backdrop-blur-md relative z-10 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>&copy; 2024 RAPHAEL AI. THE DIGITAL CURATOR.</p>
          <div className="flex gap-6 sm:gap-8">
            <Link href="/privacy" className="hover:text-on-surface cursor-pointer transition-colors">PRIVACY</Link>
            <Link href="/terms" className="hover:text-on-surface cursor-pointer transition-colors">TERMS</Link>
            <Link href="/api-docs" className="hover:text-on-surface cursor-pointer transition-colors">API</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}