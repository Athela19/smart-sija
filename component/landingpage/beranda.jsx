"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { MorphSVGPlugin } from "gsap/MorphSVGPlugin";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import TypingEffect from "@/utils/typing";

if (typeof window !== "undefined") {
  gsap.registerPlugin(MorphSVGPlugin);
}

export default function HomePage() {
  const wave1Ref = useRef(null);
  const wave2Ref = useRef(null);
  const wave3Ref = useRef(null);

  // Refs untuk framer-motion inView (pengganti AOS)
  const leftRef = useRef(null);
  const rightRef = useRef(null);
  const isLeftInView = useInView(leftRef, { once: true, threshold: 0.3 });
  const isRightInView = useInView(rightRef, { once: true, threshold: 0.3 });

  useEffect(() => {
    const wave1Paths = [
      "M0,32 C150,120 350,0 600,32 C850,64 1050,0 1200,32 L1200,120 L0,120 Z",
      "M0,32 C200,60 400,120 600,32 C800,-40 1000,80 1200,32 L1200,120 L0,120 Z",
      "M0,32 C100,80 300,20 600,32 C900,44 1100,0 1200,32 L1200,120 L0,120 Z",
    ];
    const wave2Paths = [
      "M0,32 C180,100 380,0 600,32 C820,64 1020,0 1200,32 L1200,120 L0,120 Z",
      "M0,32 C220,40 420,100 600,32 C780,-10 980,50 1200,32 L1200,120 L0,120 Z",
      "M0,32 C150,70 350,10 600,32 C850,54 1050,0 1200,32 L1200,120 L0,120 Z",
    ];
    const wave3Paths = [
      "M0,32 C140,80 340,0 600,32 C860,64 1060,0 1200,32 L1200,120 L0,120 Z",
      "M0,32 C180,30 380,90 600,32 C820,-20 1020,60 1200,32 L1200,120 L0,120 Z",
      "M0,32 C130,50 330,10 600,32 C870,54 1070,10 1200,32 L1200,120 L0,120 Z",
    ];

    function morphLoop(ref, paths, duration = 8) {
      if (!ref.current) return;
      let index = 0;
      function next() {
        const nextIndex = (index + 1) % paths.length;
        gsap.to(ref.current, {
          duration,
          ease: "power1.inOut",
          morphSVG: paths[nextIndex],
          onComplete: () => {
            index = nextIndex;
            next();
          },
        });
      }
      next();
    }

    morphLoop(wave1Ref, wave1Paths, 2);
    morphLoop(wave2Ref, wave2Paths, 4);
    morphLoop(wave3Ref, wave3Paths, 3);
  }, []);

  return (
    <section
      id="Beranda"
      className="relative min-h-screen bg-[var(--background)] overflow-hidden"
    >
      {/* Background Image + overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/landingPage/assets/bg_home.jpg"
          alt="Latar Belakang"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 opacity-80 bg-[var(--primary)]"></div>
      </div>

      {/* Konten utama */}
      <div className="relative min-h-screen z-40 flex flex-col-reverse md:flex-row justify-between items-center px-4 md:px-16">
        {/* Kiri */}
        <motion.div
          ref={leftRef}
          initial={{ x: -100, opacity: 0 }}
          animate={isLeftInView ? { x: 0, opacity: 1 } : {}}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          className="flex flex-col gap-4 mt-12 md:mt-0 mb-62 md:mb-24 text-center md:text-left"
        >
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
            Smart Product Innovation
          </h1>
          <h2 className="sm:text-3xl lg:text-2xl font-medium text-gray-300">
            <TypingEffect text="SMK Negeri 1 Cimahi" speed={100} />
          </h2>
          <div className="flex flex-row gap-4 justify-center md:justify-start">
            <Link href={"#product"}>
              <button className="px-6 py-3 bg-[var(--secondary)] text-white rounded-full hover:bg-[var(--primary)] border-2 border-[var(--secondary)] transition font-semibold">
                Lihat Produk
              </button>
            </Link>
            <Link href={"/about"}>
              <button className="px-6 py-3 bg-[var(--secondary)] text-white rounded-full hover:bg-[var(--primary)] border-2 border-[var(--secondary)] transition font-semibold">
                Tonton Video
              </button>
            </Link>
          </div>
        </motion.div>

        {/* Kanan */}
        <motion.div
          ref={rightRef}
          initial={{ x: 100, opacity: 0 }}
          animate={isRightInView ? { x: 0, opacity: 1 } : {}}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          className="hero-img w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg mt-40 md:mb-30 md:mt-0 flex items-center justify-end"
        >
          <Image
            src="/landingPage/assets/phone.png"
            alt=""
            width={300}
            height={300}
            className="animated-updown w-100 h-auto "
          />
        </motion.div>
      </div>

      {/* Gelombang animasi bawah */}
      <div className="absolute bottom-0 left-[-50%] w-[200%] z-30 overflow-hidden">
        <svg
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="relative block w-full h-[200px]"
        >
          <path
            ref={wave1Ref}
            fill="var(--background)"
            d="M0,32 C150,120 350,0 600,32 C850,64 1050,0 1200,32 L1200,120 L0,120 Z"
          />
        </svg>
        <svg
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="relative block w-full h-[200px] -mt-[230px]"
        >
          <path
            ref={wave2Ref}
            fill="var(--background)"
            opacity="0.3"
            d="M0,32 C150,120 350,0 600,32 C850,64 1050,0 1200,32 L1200,120 L0,120 Z"
          />
        </svg>
        <svg
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="relative block w-full h-[200px] -mt-[180px]"
        >
          <path
            ref={wave3Ref}
            fill="var(--background)"
            opacity="0.5"
            d="M0,32 C150,120 350,0 600,32 C850,64 1050,0 1200,32 L1200,120 L0,120 Z"
          />
        </svg>
      </div>
    </section>
  );
}
