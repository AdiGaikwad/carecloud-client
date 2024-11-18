"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
// import { Barcode } from 'lucide-react'
import JsBarcode from "jsbarcode";
import { Copyright } from "lucide-react";
interface HealthIdCardProps {
  patientName?: string;
  healthId?: string;
  darkMode?: boolean;
}

export default function HealthIdCard({
  patientName = "John Doe",
  healthId,
  darkMode = false,
}: HealthIdCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  const gradientLight = "bg-gradient-to-br from-blue-400 to-purple-700 bg-[length:200%_200%] animate-gradient";
  const gradientDark =
    "bg-gradient-to-tr from-slate-900 via-teal-900 to-slate-800 bg-[length:200%_200%] animate-gradient";

  useEffect(() => {
    if (healthId) {
      JsBarcode("#barcode", healthId, {
        background: "transparent",
        lineColor: "#fff",
        width: 4,
        height: 60,
        displayValue: true,
      });
    }
  }, [healthId]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (cardRef.current) {
        const rect = cardRef.current.getBoundingClientRect();
        setMousePosition({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        });
      }
    };

    const card = cardRef.current;
    if (card) {
      card.addEventListener("mousemove", handleMouseMove);
    }

    return () => {
      if (card) {
        card.removeEventListener("mousemove", handleMouseMove);
      }
    };
  }, []);

  const shineEffect = {
    background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 50%)`,
  };

  const borderShineEffect = {
    boxShadow: `
      ${
        Math.abs(mousePosition.x) < 50 || Math.abs(mousePosition.x - 400) < 50
          ? "0 0 20px rgba(255,255,255,0.5),"
          : ""
      }
      ${
        Math.abs(mousePosition.y) < 50 || Math.abs(mousePosition.y - 250) < 50
          ? "0 0 20px rgba(255,255,255,0.5),"
          : ""
      }
      0 0 0 1px rgba(255,255,255,0.1)
    `,
  };

  return (
    <div
      ref={cardRef}
      className="perspective-[1000px] w-[425px] h-[265px] cursor-pointer"
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <motion.div
        className="relative w-full h-full transition-all duration-500"
        initial={false}
        animate={{ rotateY: isFlipped ? -180 : 0 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
        style={{ transformStyle: "preserve-3d" }}
      >
      
        {/* Front of the card */}
        <motion.div
          className="absolute front w-full h-full rounded-xl overflow-hidden"
          style={{ backfaceVisibility: "hidden" }}
        >
          <div
            className={`w-full h-full p-6 ${
              darkMode ? gradientDark : gradientLight
            } text-white shadow-xl relative`}
            style={borderShineEffect}
          >
            <div className="relative z-10">
              <div className="flex justify-between items-start">
                <Image
                  src="/image.png"
                  alt="Chip"
                  width={40}
                  height={40}
                  className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm"
                />
                <div className="text-right">
                  <h2 className="text-2xl font-bold tracking-tight">
                    CareCloud
                  </h2>
                  <p className="text-sm opacity-75">Health ID</p>
                </div>
              </div>

              <div className="mt-12 space-y-6">
                <div className="flex justify-between items-center">
                  <div className="space-y-1">
                    <p className="text-sm opacity-75">Patient Name</p>
                    <p className="font-medium tracking-wide">{patientName}</p>
                  </div>
                  <Image
                    src="https://github.com/shadcn.png"
                    alt="Chip"
                    width={40}
                    height={40}
                    className="opacity-75"
                  />
                </div>

                <div>
                  <p className="text-sm opacity-75 mb-1">Health ID</p>
                  <p className="font-mono text-xl tracking-widest">
                    {healthId}
                  </p>
                </div>
              </div>
            </div>
            <div className="absolute inset-0 z-0" style={shineEffect} />
          </div>
        </motion.div>

        {/* Back of the card */}
        <motion.div
          className="absolute back w-full h-full rounded-xl overflow-hidden"
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          <div
            className={`w-full h-full p-6 ${
              darkMode ? gradientDark : gradientLight
            } text-white shadow-xl relative`}
            style={borderShineEffect}
          >
            <div className="relative z-10">
              <div className="w-full h-24 backdrop-blur-sm ">
                <svg id="barcode" className="w-full h-24"></svg>
              </div>
              <div className="space-y-4">
                <br />
                <p className="text-xs opacity-75 text-center ">
                  This Health ID card is property of CareCloud. If found, please
                  return to nearest healthcare facility.
                </p>
                <span className="text-xs flex justify-center opacity-75 ">
                  <Copyright className="text-xs" height={16} />{" "}
                  {new Date().getFullYear()} CareCloud
                </span>
                <br />
              </div>
            </div>
            <div className="absolute inset-0 z-0" style={shineEffect} />
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

// bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 text-white shadow-xl
